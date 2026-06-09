import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Routes that require authentication
const PROTECTED_PREFIXES = [
  "/dashboard",
  "/reading",
  "/listening",
  "/writing",
  "/speaking",
  "/mock-test",
  "/analytics",
  "/vocabulary",
  "/ai-tutor",
  "/profile",
  "/subscription",
  "/settings",
  "/leaderboard",
  "/community",
];

// Routes that should redirect to dashboard if already authenticated
const AUTH_ROUTES = ["/login", "/register", "/forgot-password"];

// Routes that are always public
const PUBLIC_ROUTES = [
  "/",
  "/pricing",
  "/blog",
  "/support",
  "/auth/callback",
  "/verify-email",
  "/reset-password",
];

function isProtected(pathname: string): boolean {
  return PROTECTED_PREFIXES.some((prefix) => pathname.startsWith(prefix));
}

function isAuthRoute(pathname: string): boolean {
  return AUTH_ROUTES.some((route) => pathname.startsWith(route));
}

export default function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Always allow public routes and API routes
  if (
    PUBLIC_ROUTES.some((r) => pathname.startsWith(r)) ||
    pathname.startsWith("/api/") ||
    pathname.startsWith("/_next/") ||
    pathname.includes(".")
  ) {
    return NextResponse.next();
  }

  // Read auth state from cookie (set by frontend on login)
  // We use a lightweight "has-session" cookie rather than storing the JWT
  // in a cookie (JWT stays in localStorage for XSS surface minimisation
  // vs CSRF trade-off — this is a known decision for SPAs)
  const hasSession = request.cookies.get("has-session")?.value === "1";

  // Redirect unauthenticated users away from protected routes
  if (isProtected(pathname) && !hasSession) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Redirect authenticated users away from auth routes
  if (isAuthRoute(pathname) && hasSession) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|icons|images|audio|fonts).*)",
  ],
};
