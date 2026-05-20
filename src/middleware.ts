import { withAuth } from 'next-auth/middleware';
import { NextResponse } from 'next/server';

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token;
    const pathname = req.nextUrl.pathname;

    // Allow login page without auth
    if (pathname === '/admin/login') {
      return NextResponse.next();
    }

    // Force password change if required
    if (
      token?.mustChangePassword &&
      pathname !== '/admin/change-password' &&
      pathname.startsWith('/admin')
    ) {
      return NextResponse.redirect(new URL('/admin/change-password', req.url));
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        if (req.nextUrl.pathname === '/admin/login') return true;
        return !!token;
      },
    },
  }
);

export const config = {
  matcher: ['/admin/:path*'],
};
