import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { auth } from "@/lib/auth";

// Access control and basic security headers via proxy (replaces deprecated middleware)
const protectedRoutes = ["/profil", "/alerty", "/watchlist", "/ustawienia"];
const authRoutes = ["/logowanie", "/rejestracja"];

const rateLimitStore = new Map<string, { start: number; count: number }>();
const RATE_LIMIT_WINDOW_MS = 60_000; // 1 minute
const RATE_LIMIT_MAX = 120; // per IP per window for API routes

const getClientIp = (request: NextRequest): string => {
  const xff = request.headers.get("x-forwarded-for");
  if (xff) return xff.split(",")[0]?.trim() || "unknown";
  const xRealIp = request.headers.get("x-real-ip");
  if (xRealIp) return xRealIp;
  return "unknown";
};

const applyRateLimit = (request: NextRequest): NextResponse | null => {
  const ip = getClientIp(request);
  const now = Date.now();
  const entry = rateLimitStore.get(ip);

  if (!entry || now - entry.start > RATE_LIMIT_WINDOW_MS) {
    rateLimitStore.set(ip, { start: now, count: 1 });
    return null;
  }

  if (entry.count >= RATE_LIMIT_MAX) {
    return new NextResponse("Rate limit exceeded. Please slow down.", {
      status: 429,
      headers: {
        "Retry-After": Math.ceil(
          (RATE_LIMIT_WINDOW_MS - (now - entry.start)) / 1000
        ).toString(),
      },
    });
  }

  entry.count += 1;
  rateLimitStore.set(ip, entry);
  return null;
};

const withSecurityHeaders = (
  response: NextResponse,
  request: NextRequest
): NextResponse => {
  response.headers.set("X-Frame-Options", "DENY");
  response.headers.set("X-Content-Type-Options", "nosniff");
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  response.headers.set(
    "Permissions-Policy",
    "camera=(), microphone=(), geolocation=()"
  );

  if (request.nextUrl.protocol === "https:") {
    response.headers.set(
      "Strict-Transport-Security",
      "max-age=63072000; includeSubDomains; preload"
    );
  }

  return response;
};

export default async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Basic rate limiting for API routes
  if (pathname.startsWith("/api")) {
    const limited = applyRateLimit(request);
    if (limited) return withSecurityHeaders(limited, request);
  }

  let response: NextResponse | null = null;

  const isProtectedRoute = protectedRoutes.some((route) =>
    pathname.startsWith(route)
  );
  const isAuthRoute = authRoutes.some((route) => pathname.startsWith(route));

  if (isProtectedRoute || isAuthRoute) {
    const session = await auth();

    if (isProtectedRoute && !session) {
      const loginUrl = new URL("/logowanie", request.url);
      loginUrl.searchParams.set("callbackUrl", pathname);
      response = NextResponse.redirect(loginUrl);
    }

    if (isAuthRoute && session) {
      response = NextResponse.redirect(new URL("/", request.url));
    }
  }

  if (!response) {
    response = NextResponse.next();
  }

  return withSecurityHeaders(response, request);
}

export const config = {
  matcher: [
    "/api/:path*",
    "/profil/:path*",
    "/alerty/:path*",
    "/watchlist/:path*",
    "/ustawienia/:path*",
    "/logowanie",
    "/rejestracja",
  ],
};
