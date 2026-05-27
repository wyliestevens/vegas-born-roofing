import { NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { getSessionCookie, verifySession } from "@/lib/auth";
import { toolSchemas, toolExecutors, SYSTEM_PROMPT } from "@/lib/chat-tools";

// Max tool-use rounds to prevent runaway loops
const MAX_ROUNDS = 8;

async function authenticate(request: Request) {
  const cookieHeader = request.headers.get("cookie");
  const token = getSessionCookie(cookieHeader);
  if (!token) return null;
  return verifySession(token);
}

export async function POST(request: Request) {
  // --- Auth ---
  const session = await authenticate(request);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // --- Parse body ---
  const { messages } = await request.json();
  if (!Array.isArray(messages) || messages.length === 0) {
    return NextResponse.json(
      { error: "messages array is required" },
      { status: 400 }
    );
  }

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { error: "ANTHROPIC_API_KEY not configured" },
      { status: 500 }
    );
  }

  const client = new Anthropic({ apiKey });

  // Build Anthropic-format messages
  const anthropicMessages: Anthropic.MessageParam[] = messages.map(
    (m: { role: string; content: string }) => ({
      role: m.role as "user" | "assistant",
      content: m.content,
    })
  );

  // Convert tool schemas to Anthropic tool format
  const tools: Anthropic.Tool[] = toolSchemas.map((t) => ({
    name: t.name,
    description: t.description,
    input_schema: t.input_schema as Anthropic.Tool.InputSchema,
  }));

  // Collect all tool results across rounds
  const allToolResults: { tool: string; result: unknown; isError: boolean }[] =
    [];

  try {
    let currentMessages = [...anthropicMessages];

    for (let round = 0; round < MAX_ROUNDS; round++) {
      const response = await client.messages.create({
        model: "claude-sonnet-4-6",
        max_tokens: 4096,
        system: SYSTEM_PROMPT,
        tools,
        messages: currentMessages,
      });

      // Check if there are any tool_use blocks
      const toolUseBlocks = response.content.filter(
        (b): b is Anthropic.ContentBlock & { type: "tool_use" } =>
          b.type === "tool_use"
      );

      if (toolUseBlocks.length === 0) {
        // No more tool calls — extract final text
        const textBlock = response.content.find((b) => b.type === "text") as
          | (Anthropic.ContentBlock & { type: "text"; text: string })
          | undefined;

        return NextResponse.json({
          role: "assistant",
          content: textBlock?.text ?? "",
          toolResults: allToolResults,
        });
      }

      // Execute all tool calls in parallel
      const toolResults = await Promise.all(
        toolUseBlocks.map(async (block) => {
          const executor = toolExecutors[block.name];
          if (!executor) {
            return {
              type: "tool_result" as const,
              tool_use_id: block.id,
              content: JSON.stringify({ error: `Unknown tool: ${block.name}` }),
              is_error: true,
              _meta: { tool: block.name, isError: true },
            };
          }

          try {
            const result = await executor(
              block.input as Record<string, unknown>
            );
            return {
              type: "tool_result" as const,
              tool_use_id: block.id,
              content: JSON.stringify(result),
              is_error: false,
              _meta: { tool: block.name, isError: false },
            };
          } catch (err) {
            const errMsg =
              err instanceof Error ? err.message : "Tool execution failed";
            return {
              type: "tool_result" as const,
              tool_use_id: block.id,
              content: JSON.stringify({ error: errMsg }),
              is_error: true,
              _meta: { tool: block.name, isError: true },
            };
          }
        })
      );

      // Collect results for the client
      for (const tr of toolResults) {
        allToolResults.push({
          tool: tr._meta.tool,
          result: JSON.parse(tr.content),
          isError: tr._meta.isError,
        });
      }

      // Append assistant response + tool results to conversation
      currentMessages = [
        ...currentMessages,
        { role: "assistant" as const, content: response.content },
        {
          role: "user" as const,
          content: toolResults.map(({ _meta, ...rest }) => rest),
        },
      ];
    }

    // Exceeded max rounds — do one final call without tools
    const finalResponse = await client.messages.create({
      model: "claude-sonnet-4-6",
      max_tokens: 4096,
      system: SYSTEM_PROMPT,
      messages: currentMessages,
    });

    const textBlock = finalResponse.content.find((b) => b.type === "text") as
      | (Anthropic.ContentBlock & { type: "text"; text: string })
      | undefined;

    return NextResponse.json({
      role: "assistant",
      content: textBlock?.text ?? "",
      toolResults: allToolResults,
    });
  } catch (err) {
    console.error("Chat API error:", err);
    const message =
      err instanceof Error ? err.message : "Internal server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
