import NextAuth from "next-auth";
import { authConfig } from "./auth.config";
import { NextResponse } from "next/server";

const { auth } = NextAuth(authConfig);

export default auth((req) => {
  const { pathname } = req.nextUrl;
  const isLoggedIn = !!req.auth;
  const userRole = (req.auth?.user as { role?: string })?.role;

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
});

export const config = {
  matcher: ["/admin/:path*", "/account/:path*", "/login", "/register"],
};
