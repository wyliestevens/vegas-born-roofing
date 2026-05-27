import { NextResponse } from "next/server";
import { getSessionCookie, verifySession } from "@/lib/auth";
import { listUploads, readFile, deleteFile } from "@/lib/github";

async function authenticate(request: Request) {
  const cookieHeader = request.headers.get("cookie");
  const token = getSessionCookie(cookieHeader);
  if (!token) return null;
  return verifySession(token);
}

export async function GET(request: Request) {
  try {
    const session = await authenticate(request);
    if (!session) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const images = await listUploads();
    return NextResponse.json({ images });
  } catch {
    return NextResponse.json(
      { error: "Failed to load images" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  try {
    const session = await authenticate(request);
    if (!session) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const { path } = await request.json();
    if (!path) {
      return NextResponse.json(
        { error: "Image path is required" },
        { status: 400 }
      );
    }

    // Get the current sha for the file
    const { sha } = await readFile(path);
    await deleteFile(path, sha, `Delete image: ${path.split("/").pop()}`);

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json(
      { error: "Failed to delete image" },
      { status: 500 }
    );
  }
}
