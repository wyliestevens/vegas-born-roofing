"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { Send, Bot, User, ChevronDown, ChevronRight, Loader2 } from "lucide-react";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface Message {
  role: "user" | "assistant";
  content: string;
  toolResults?: ToolResult[];
}

interface ToolResult {
  tool: string;
  result: unknown;
  isError?: boolean;
}

// ---------------------------------------------------------------------------
// ToolResultBlock — collapsible display for tool calls
// ---------------------------------------------------------------------------

function ToolResultBlock({ tool, result, isError }: ToolResult) {
  const [open, setOpen] = useState(false);

  return (
    <button
      type="button"
      onClick={() => setOpen((o) => !o)}
      className={`mt-2 w-full text-left rounded border text-xs ${
        isError
          ? "border-red-300 bg-red-50"
          : "border-slate-200 bg-slate-50"
      }`}
    >
      <span className="flex items-center gap-1 px-2 py-1 font-medium text-slate-600">
        {open ? <ChevronDown className="h-3 w-3" /> : <ChevronRight className="h-3 w-3" />}
        {tool}
        {isError && <span className="text-red-500 ml-1">(error)</span>}
      </span>
      {open && (
        <pre className="px-2 pb-2 whitespace-pre-wrap break-words text-slate-500 max-h-60 overflow-auto">
          {typeof result === "string" ? result : JSON.stringify(result, null, 2)}
        </pre>
      )}
    </button>
  );
}

// ---------------------------------------------------------------------------
// ChatInterface
// ---------------------------------------------------------------------------

export default function ChatInterface() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  // Auto-resize textarea
  useEffect(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = Math.min(el.scrollHeight, 160) + "px";
  }, [input]);

  const sendMessage = useCallback(async () => {
    const text = input.trim();
    if (!text || loading) return;

    const userMessage: Message = { role: "user", content: text };
    const updated = [...messages, userMessage];
    setMessages(updated);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/admin/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: updated.map((m) => ({ role: m.role, content: m.content })),
        }),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({ error: "Request failed" }));
        throw new Error(err.error || "Request failed");
      }

      const data = await res.json();
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: data.content,
          toolResults: data.toolResults,
        },
      ]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content:
            err instanceof Error ? err.message : "Something went wrong.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  }, [input, loading, messages]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)]">
      {/* Header */}
      <div className="border-b border-slate-200 bg-white px-6 py-4">
        <h1 className="text-xl font-semibold text-slate-900">AI Chat</h1>
        <p className="text-sm text-slate-500">
          Manage website content with natural language
        </p>
      </div>

      {/* Messages area */}
      <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4 bg-slate-50">
        {messages.length === 0 && !loading && (
          <div className="flex flex-col items-center justify-center h-full text-center text-slate-400">
            <Bot className="h-12 w-12 mb-3" />
            <p className="text-lg font-medium text-slate-500">
              How can I help?
            </p>
            <p className="text-sm max-w-md">
              Ask me to manage blog posts, testimonials, projects, team bios,
              and more.
            </p>
          </div>
        )}

        {messages.map((msg, i) => (
          <div
            key={i}
            className={`flex items-start gap-3 ${
              msg.role === "user" ? "justify-end" : "justify-start"
            }`}
          >
            {msg.role === "assistant" && (
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center">
                <Bot className="h-4 w-4 text-slate-600" />
              </div>
            )}

            <div
              className={`max-w-[70%] rounded-lg px-4 py-3 ${
                msg.role === "user"
                  ? "bg-red-600 text-white"
                  : "bg-white border border-slate-200 text-slate-800"
              }`}
            >
              <p className="whitespace-pre-wrap text-sm">{msg.content}</p>
              {msg.toolResults?.map((tr, j) => (
                <ToolResultBlock key={j} {...tr} />
              ))}
            </div>

            {msg.role === "user" && (
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-red-600 flex items-center justify-center">
                <User className="h-4 w-4 text-white" />
              </div>
            )}
          </div>
        ))}

        {/* Loading indicator */}
        {loading && (
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center">
              <Bot className="h-4 w-4 text-slate-600" />
            </div>
            <div className="bg-white border border-slate-200 rounded-lg px-4 py-3">
              <Loader2 className="h-5 w-5 animate-spin text-slate-400" />
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input area */}
      <div className="border-t border-slate-200 bg-white px-6 py-4">
        <div className="flex items-end gap-3">
          <textarea
            ref={textareaRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type a message..."
            rows={1}
            className="flex-1 resize-none rounded-lg border border-slate-300 px-4 py-2.5 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-red-600 focus:border-transparent"
          />
          <button
            onClick={sendMessage}
            disabled={!input.trim() || loading}
            className="flex-shrink-0 rounded-lg bg-slate-900 p-2.5 text-white hover:bg-slate-800 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            <Send className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
