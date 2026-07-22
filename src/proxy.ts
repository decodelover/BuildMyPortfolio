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
  const sessionToken = request.cookies.get("__session")?.value || request.cookies.get("token")?.value;

  // Check user role from cookies (case-insensitive check for ADMIN or SUPER_ADMIN)
  const userRole = request.cookies.get("user_role")?.value?.toUpperCase();
  const isAdmin = userRole === "ADMIN" || userRole === "SUPER_ADMIN";

  // Check subscription operational status from cookie
  const subStatus = request.cookies.get("sub_status")?.value?.toLowerCase();
  const isSuspended = subStatus === "suspended" || subStatus === "expired";

  const isProtected = protectedPaths.some((path) => pathname.startsWith(path));
  const isAdminRoute = adminPaths.some((path) => pathname.startsWith(path));
  const isAuthRoute = authPaths.some((path) => pathname.startsWith(path));

  // If trying to access a protected dashboard route without a session, redirect to login
  if (isProtected && !sessionToken) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // If subscription is suspended/expired and accessing dashboard, redirect to billing portal (except if already on billing)
  if (isProtected && sessionToken && isSuspended && pathname !== "/dashboard/billing") {
    const billingUrl = new URL("/dashboard/billing", request.url);
    billingUrl.searchParams.set("reason", "subscription_inactive");
    return NextResponse.redirect(billingUrl);
  }

  // If trying to access an admin route, verify authentication and admin role
  if (isAdminRoute) {
    if (!sessionToken) {
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("redirect", pathname);
      return NextResponse.redirect(loginUrl);
    }
    if (!isAdmin) {
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
    "/((?!api|_next/static|_next/image|favicon.ico|images|icons|logos|illustrations|themes).*)",
  ],
};
