import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Path prefixes that require authentication
const protectedPaths = ["/dashboard", "/portfolio/manage", "/checkout"];

// Path prefixes that require admin privileges
const adminPaths = ["/admin"];

// Path prefixes that are only for unauthenticated users (e.g., login, register)
const authPaths = ["/login", "/register", "/forgot-password"];

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Retrieve user session identifier (token or session cookie)
  // Firebase Auth session cookie is traditionally named '__session' for Firebase Hosting compatibility
  const sessionToken = request.cookies.get("__session")?.value || request.cookies.get("token")?.value;

  // Check user role from cookies (case-insensitive check for ADMIN)
  const userRole = request.cookies.get("user_role")?.value?.toUpperCase();
  const isAdmin = userRole === "ADMIN";

  const isProtected = protectedPaths.some((path) => pathname.startsWith(path));
  const isAdminRoute = adminPaths.some((path) => pathname.startsWith(path));
  const isAuthRoute = authPaths.some((path) => pathname.startsWith(path));

  // If trying to access a protected dashboard route without a session, redirect to login
  if (isProtected && !sessionToken) {
    const loginUrl = new URL("/login", request.url);
    // Save the original path to redirect back after login
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // If trying to access an admin route, verify the user is authenticated and has the admin role
  if (isAdminRoute) {
    if (!sessionToken) {
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("redirect", pathname);
      return NextResponse.redirect(loginUrl);
    }
    if (!isAdmin) {
      // Forbidden - redirect authenticated non-admins to dashboard
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }
  }

  // If trying to access login/signup while already logged in, redirect to dashboard
  if (isAuthRoute && sessionToken) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public assets (images, icons, logos, illustrations, themes)
     */
    "/((?!api|_next/static|_next/image|favicon.ico|images|icons|logos|illustrations|themes).*)",
  ],
};
