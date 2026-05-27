import { NextResponse } from "next/server";
import { verifySession, getSessionCookie } from "@/lib/auth";
import {
  listCommits,
  readFileAtCommit,
  readFile,
  writeFile,
} from "@/lib/github";

async function authenticate(request: Request) {
  const cookieHeader = request.headers.get("cookie");
  const token = getSessionCookie(cookieHeader);
  if (!token) return null;
  return verifySession(token);
}

// GET - list recent commits
export async function GET(request: Request) {
  try {
    const session = await authenticate(request);
    if (!session) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const commits = await listCommits(undefined, 50);
    return NextResponse.json({ commits });
  } catch (err) {
    console.error("History GET error:", err);
    return NextResponse.json(
      { error: "Failed to load commit history" },
      { status: 500 }
    );
  }
}

// POST - restore a data file from a previous commit
export async function POST(request: Request) {
  try {
    const session = await authenticate(request);
    if (!session) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const body = await request.json();
    const { path, commitSha } = body;

    if (!path || !commitSha) {
      return NextResponse.json(
        { error: "path and commitSha are required" },
        { status: 400 }
      );
    }

    // Only allow restoring data/ files
    if (!path.startsWith("data/")) {
      return NextResponse.json(
        { error: "Only data/ files can be restored" },
        { status: 403 }
      );
    }

    // Read the file content at the old commit
    const { content: oldContent } = await readFileAtCommit(path, commitSha);

    // Get the current file SHA (needed for update)
    let currentSha: string | undefined;
    try {
      const current = await readFile(path);
      currentSha = current.sha;
    } catch {
      // File may not exist currently — will create it
    }

    // Write the old content as a new commit
    const contentBase64 = Buffer.from(oldContent).toString("base64");
    await writeFile({
      path,
      contentBase64,
      message: `admin: Restore ${path} from ${commitSha.slice(0, 7)}`,
      sha: currentSha,
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("History POST error:", err);
    return NextResponse.json(
      { error: "Failed to restore file" },
      { status: 500 }
    );
  }
}
