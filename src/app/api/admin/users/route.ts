import { NextResponse } from "next/server";
import {
  verifySession,
  getSessionCookie,
  loadCredentials,
  saveCredentials,
  hashPassword,
} from "@/lib/auth";

async function authenticate(request: Request) {
  const cookieHeader = request.headers.get("cookie");
  const token = getSessionCookie(cookieHeader);
  if (!token) return null;
  return verifySession(token);
}

function isAuthorized(role: string): boolean {
  return role === "super_admin" || role === "owner";
}

// GET - list all users (without passwordHash)
export async function GET(request: Request) {
  try {
    const session = await authenticate(request);
    if (!session) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }
    if (!isAuthorized(session.role)) {
      return NextResponse.json({ error: "Insufficient permissions" }, { status: 403 });
    }

    const creds = await loadCredentials();
    const users = creds.users.map(({ passwordHash, ...rest }) => rest);

    return NextResponse.json({ users });
  } catch {
    return NextResponse.json(
      { error: "Failed to load users" },
      { status: 500 }
    );
  }
}

// POST - create a new user
export async function POST(request: Request) {
  try {
    const session = await authenticate(request);
    if (!session) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }
    if (!isAuthorized(session.role)) {
      return NextResponse.json({ error: "Insufficient permissions" }, { status: 403 });
    }

    const body = await request.json();
    const { name, email, role } = body;

    if (!name || !email || !role) {
      return NextResponse.json(
        { error: "Name, email, and role are required" },
        { status: 400 }
      );
    }

    if (!["admin", "editor", "owner"].includes(role)) {
      return NextResponse.json(
        { error: "Invalid role. Must be admin, editor, or owner." },
        { status: 400 }
      );
    }

    const creds = await loadCredentials();

    // Check for duplicate email
    if (creds.users.some((u) => u.email.toLowerCase() === email.toLowerCase())) {
      return NextResponse.json(
        { error: "A user with this email already exists" },
        { status: 409 }
      );
    }

    const id = name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");

    const hashed = await hashPassword("Password");
    const now = new Date().toISOString();

    creds.users.push({
      id,
      email,
      name,
      role,
      passwordHash: hashed,
      mustChangePassword: true,
      createdAt: now,
      updatedAt: now,
    });

    await saveCredentials(creds);

    const { passwordHash, ...safeUser } = creds.users[creds.users.length - 1];
    return NextResponse.json({ user: safeUser }, { status: 201 });
  } catch {
    return NextResponse.json(
      { error: "Failed to create user" },
      { status: 500 }
    );
  }
}

// DELETE - remove a user
export async function DELETE(request: Request) {
  try {
    const session = await authenticate(request);
    if (!session) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }
    if (!isAuthorized(session.role)) {
      return NextResponse.json({ error: "Insufficient permissions" }, { status: 403 });
    }

    const { id } = await request.json();

    if (!id) {
      return NextResponse.json(
        { error: "User ID is required" },
        { status: 400 }
      );
    }

    const creds = await loadCredentials();
    const target = creds.users.find((u) => u.id === id);

    if (!target) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    if (target.role === "super_admin") {
      return NextResponse.json(
        { error: "Cannot delete super_admin users" },
        { status: 403 }
      );
    }

    if (target.id === session.sub) {
      return NextResponse.json(
        { error: "Cannot delete your own account" },
        { status: 403 }
      );
    }

    creds.users = creds.users.filter((u) => u.id !== id);
    await saveCredentials(creds);

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json(
      { error: "Failed to delete user" },
      { status: 500 }
    );
  }
}
