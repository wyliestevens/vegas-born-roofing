import { NextResponse } from "next/server";
import {
  loadCredentials,
  findUser,
  verifyPassword,
  signSession,
  sessionCookieConfig,
} from "@/lib/auth";

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required" },
        { status: 400 }
      );
    }

    const creds = await loadCredentials();
    const user = findUser(creds, email);

    if (!user) {
      return NextResponse.json(
        { error: "Invalid email or password" },
        { status: 401 }
      );
    }

    const valid = await verifyPassword(password, user.passwordHash);
    if (!valid) {
      return NextResponse.json(
        { error: "Invalid email or password" },
        { status: 401 }
      );
    }

    const token = await signSession({
      sub: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      mustChangePassword: user.mustChangePassword,
    });

    const res = NextResponse.json({
      ok: true,
      mustChangePassword: user.mustChangePassword,
    });

    res.cookies.set(sessionCookieConfig.name, token, {
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
