import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { auth } from "@/lib/auth";

// Routes that require authentication
const protectedRoutes = [
  "/profil",
  "/alerty",
  "/watchlist",
  "/ustawienia",
];

// Routes that should redirect to home if already authenticated
const authRoutes = [
  "/logowanie",
  "/rejestracja",
];

export default async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Check if route is protected
  const isProtectedRoute = protectedRoutes.some(route => pathname.startsWith(route));
  const isAuthRoute = authRoutes.some(route => pathname.startsWith(route));

  if (isProtectedRoute || isAuthRoute) {
    const session = await auth();

    // Redirect to login if accessing protected route without session
    if (isProtectedRoute && !session) {
      const loginUrl = new URL("/logowanie", request.url);
      loginUrl.searchParams.set("callbackUrl", pathname);
      return NextResponse.redirect(loginUrl);
    }

    // Redirect to home if accessing auth routes with session
    if (isAuthRoute && session) {
      return NextResponse.redirect(new URL("/", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/profil/:path*",
    "/alerty/:path*",
    "/watchlist/:path*",
    "/ustawienia/:path*",
    "/logowanie",
    "/rejestracja",
  ],
};

