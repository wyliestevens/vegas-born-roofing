import { NextResponse } from "next/server";
import {
  loadCredentials,
  saveCredentials,
  findUserById,
  verifyPassword,
  hashPassword,
  signSession,
  verifySession,
  getSessionCookie,
  sessionCookieConfig,
} from "@/lib/auth";

export async function POST(request: Request) {
  try {
    const cookieHeader = request.headers.get("cookie");
    const token = getSessionCookie(cookieHeader);

    if (!token) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const session = await verifySession(token);
    if (!session) {
      return NextResponse.json({ error: "Invalid session" }, { status: 401 });
    }

    const { currentPassword, newPassword } = await request.json();

    if (!currentPassword || !newPassword) {
      return NextResponse.json(
        { error: "Current password and new password are required" },
        { status: 400 }
      );
    }

    if (newPassword.length < 8) {
      return NextResponse.json(
        { error: "New password must be at least 8 characters" },
        { status: 400 }
      );
    }

    const creds = await loadCredentials();
    const user = findUserById(creds, session.sub);

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const valid = await verifyPassword(currentPassword, user.passwordHash);
    if (!valid) {
      return NextResponse.json(
        { error: "Current password is incorrect" },
        { status: 401 }
      );
    }

    const sameAsOld = await verifyPassword(newPassword, user.passwordHash);
    if (sameAsOld) {
      return NextResponse.json(
        { error: "New password must be different from your current password" },
        { status: 400 }
      );
    }

    const newHash = await hashPassword(newPassword);
    const now = new Date().toISOString();

    const updatedUsers = creds.users.map((u) =>
      u.id === user.id
        ? {
            ...u,
            passwordHash: newHash,
            mustChangePassword: false,
            updatedAt: now,
          }
        : u
    );

    await saveCredentials({ users: updatedUsers });

    const newToken = await signSession({
      sub: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      mustChangePassword: false,
    });

    const res = NextResponse.json({ ok: true });

    res.cookies.set(sessionCookieConfig.name, newToken, {
      httpOnly: sessionCookieConfig.httpOnly,
      secure: sessionCookieConfig.secure,
      sameSite: sessionCookieConfig.sameSite,
      path: sessionCookieConfig.path,
      maxAge: sessionCookieConfig.maxAge,
    });

    return res;
  } catch {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
