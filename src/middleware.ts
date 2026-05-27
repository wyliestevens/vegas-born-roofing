import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";

export const config = {
  matcher: ["/admin/:path*", "/api/admin/:path*"],
};

const JWT_SECRET = new TextEncoder().encode(
  process.env.ADMIN_JWT_SECRET || "vbr-dev-secret-change-in-production"
);

const PUBLIC_PATHS = ["/admin/login", "/api/admin/login"];
const MUST_CHANGE_ALLOWED = [
  "/admin/change-password",
  "/api/admin/account",
  "/api/admin/logout",
];

export default async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Allow unauthenticated access to login routes
  if (PUBLIC_PATHS.includes(pathname)) {
    return NextResponse.next();
  }

  const token = req.cookies.get("vbr_admin")?.value;
  const isApi = pathname.startsWith("/api/");

  // No cookie -> redirect or 401
  if (!token) {
    if (isApi) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const loginUrl = req.nextUrl.clone();
    loginUrl.pathname = "/admin/login";
    loginUrl.searchParams.set("next", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Verify JWT
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);

    // If mustChangePassword, restrict access
    if (payload.mustChangePassword === true) {
      const allowed = MUST_CHANGE_ALLOWED.some((p) => pathname.startsWith(p));
      if (!allowed) {
        if (isApi) {
          return NextResponse.json(
            { error: "Password change required" },
            { status: 403 }
          );
        }
        const changeUrl = req.nextUrl.clone();
        changeUrl.pathname = "/admin/change-password";
        changeUrl.search = "";
        return NextResponse.redirect(changeUrl);
      }
    }

    return NextResponse.next();
  } catch {
    return expire(req, isApi);
  }
}

function expire(req: NextRequest, isApi: boolean) {
  if (isApi) {
    const res = NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    res.cookies.delete("vbr_admin");
    return res;
  }
  const loginUrl = req.nextUrl.clone();
  loginUrl.pathname = "/admin/login";
  loginUrl.searchParams.set(
    "next",
    encodeURIComponent(req.nextUrl.pathname)
  );
  const res = NextResponse.redirect(loginUrl);
  res.cookies.delete("vbr_admin");
  return res;
}
