import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Console log for debugging
  console.log("🔍 Middleware:", {
    pathname,
    method: request.method,
    hasAuthCookie: request.cookies.has("auth-storage"),
  });

  // Redirect /login to /auth/login
  if (pathname === "/login") {
    console.log("⚠️ Redirecting /login → /auth/login");
    return NextResponse.redirect(new URL("/auth/login", request.url));
  }

  // Redirect /register to /auth/register
  if (pathname === "/register") {
    console.log("⚠️ Redirecting /register → /auth/register");
    return NextResponse.redirect(new URL("/auth/register", request.url));
  }

  // Check if accessing dashboard without being logged in
  if (pathname.startsWith("/dashboard")) {
    const authStorage = request.cookies.get("auth-storage");
    const hasToken = authStorage?.value?.includes('"token"');

    console.log("🔐 Dashboard access:", {
      hasAuthStorage: !!authStorage,
      hasToken,
      pathname,
    });

    // If no token and trying to access dashboard, redirect to login
    if (!hasToken) {
      console.log("❌ No token found, redirecting to /auth/login");
      return NextResponse.redirect(new URL("/auth/login", request.url));
    }
  }

  console.log("✅ Request allowed");
  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\..*|api).*)",
  ],
};
