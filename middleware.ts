import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Console log for debugging
  console.log("🔍 Middleware:", {
    pathname,
    method: request.method,
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

  // For dashboard routes, we'll check auth on client side
  // Middleware can't access localStorage, so we skip the check here
  if (pathname.startsWith("/dashboard")) {
    console.log("📊 Dashboard route accessed:", pathname);
    console.log("ℹ️ Auth check will be done client-side");
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
