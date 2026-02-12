import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const token = await getToken({ req, secret: process.env.AUTH_SECRET });
  const isLoggedIn = !!token;
  const userRole = token?.role as string | undefined;

  // Admin routes — require ADMIN or SUPERADMIN
  if (pathname.startsWith("/admin")) {
    if (!isLoggedIn) {
      return NextResponse.redirect(
        new URL("/login?callbackUrl=/admin", req.url)
      );
    }
    if (userRole !== "ADMIN" && userRole !== "SUPERADMIN") {
      return NextResponse.redirect(new URL("/", req.url));
    }
  }

  // Account route — require login
  if (pathname.startsWith("/account")) {
    if (!isLoggedIn) {
      return NextResponse.redirect(
        new URL("/login?callbackUrl=/account", req.url)
      );
    }
  }

  // Login/Register — redirect to home if already logged in
  if (pathname === "/login" || pathname === "/register") {
    if (isLoggedIn) {
      return NextResponse.redirect(new URL("/", req.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/account/:path*", "/login", "/register"],
};
