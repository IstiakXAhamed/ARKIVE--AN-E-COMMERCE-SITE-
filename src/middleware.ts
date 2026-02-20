import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import NextAuth from 'next-auth';
import { authConfig } from '@/lib/auth.config';

const { auth } = NextAuth(authConfig);

// Define route patterns
const PUBLIC_ROUTES = ['/', '/shop', '/category', '/product', '/about', '/contact', '/flash-sale'];
const AUTH_ROUTES = ['/login', '/register', '/forgot-password', '/reset-password', '/verify-email'];
const ADMIN_ROUTES = ['/admin'];
const CUSTOMER_ROUTES = ['/account', '/cart', '/checkout', '/wishlist'];
const API_AUTH_ROUTES = ['/api/auth'];

export default auth((req) => {
  const { nextUrl } = req;
  const isLoggedIn = !!req.auth;
  const userRole = req.auth?.user?.role as string | undefined;
  
  const isApiAuthRoute = API_AUTH_ROUTES.some(route => 
    nextUrl.pathname.startsWith(route)
  );
  const isPublicRoute = PUBLIC_ROUTES.some(route => 
    nextUrl.pathname === route || nextUrl.pathname.startsWith(`${route}/`)
  );
  const isAuthRoute = AUTH_ROUTES.some(route => 
    nextUrl.pathname.startsWith(route)
  );
  const isAdminRoute = ADMIN_ROUTES.some(route => 
    nextUrl.pathname.startsWith(route)
  );
  const isCustomerRoute = CUSTOMER_ROUTES.some(route => 
    nextUrl.pathname.startsWith(route)
  );
  
  // Always allow API auth routes
  if (isApiAuthRoute) {
    return NextResponse.next();
  }
  
  // Redirect logged-in users away from auth pages
  if (isAuthRoute && isLoggedIn) {
    if (userRole === 'CUSTOMER') {
      return NextResponse.redirect(new URL('/account', nextUrl));
    }
    return NextResponse.redirect(new URL('/admin', nextUrl));
  }
  
  // Protect customer routes
  if (isCustomerRoute && !isLoggedIn) {
    return NextResponse.redirect(new URL('/login', nextUrl));
  }
  
  // Protect admin routes
  if (isAdminRoute) {
    if (!isLoggedIn) {
      return NextResponse.redirect(new URL('/login', nextUrl));
    }
    
    if (userRole === 'CUSTOMER') {
      return NextResponse.redirect(new URL('/account', nextUrl));
    }
    
    // Allow admin and superadmin
    if (userRole !== 'ADMIN' && userRole !== 'SUPERADMIN') {
      return NextResponse.redirect(new URL('/', nextUrl));
    }
  }
  
  return NextResponse.next();
});

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|public|api/webhook).*)'],
};
