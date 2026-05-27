import { NextResponse } from "next/server";
import { getSessionCookie, verifySession } from "@/lib/auth";
import { uploadImage } from "@/lib/github";

async function authenticate(request: Request) {
  const cookieHeader = request.headers.get("cookie");
  const token = getSessionCookie(cookieHeader);
  if (!token) return null;
  return verifySession(token);
}

const MAX_SIZE = 8 * 1024 * 1024; // 8MB

const ALLOWED_TYPES = [
  "image/jpeg",
  "image/png",
  "image/gif",
  "image/webp",
  "image/svg+xml",
  "image/avif",
  "image/x-icon",
];

function sanitizeFilename(name: string): string {
  const ext = name.split(".").pop()?.toLowerCase() || "jpg";
  const base = name
    .replace(/\.[^.]+$/, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
  return `${base || "image"}.${ext}`;
}

export async function POST(request: Request) {
  try {
    const session = await authenticate(request);
    if (!session) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const formData = await request.formData();
    const file = formData.get("file") as File | null;
    const folder = (formData.get("folder") as string) || "general";

    if (!file) {
      return NextResponse.json(
        { error: "No file provided" },
        { status: 400 }
      );
    }

    if (!ALLOWED_TYPES.includes(file.type)) {
      return NextResponse.json(
        { error: "Only image files are allowed" },
        { status: 400 }
      );
    }

    if (file.size > MAX_SIZE) {
      return NextResponse.json(
        { error: "File must be under 8MB" },
        { status: 400 }
      );
    }

    const filename = sanitizeFilename(file.name);
    const arrayBuffer = await file.arrayBuffer();
    const base64 = Buffer.from(arrayBuffer).toString("base64");

    const { url } = await uploadImage({ folder, filename, base64 });

    return NextResponse.json({ ok: true, url });
  } catch {
    return NextResponse.json(
      { error: "Upload failed" },
      { status: 500 }
    );
  }
}
