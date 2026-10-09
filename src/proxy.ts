import { NextResponse, type NextRequest } from "next/server";
import {
  ADMIN_COOKIE_NAME,
  verifyAdminSessionEdge,
} from "@/server/auth/edge-session";

function getAuthSecret(): string {
  const secret = process.env.AUTH_SECRET;
  if (!secret) {
    if (process.env.NODE_ENV === "production") {
      return "";
    }
    return "dev-insecure-auth-secret-do-not-use-in-production-1234567890";
  }
  return secret;
}

const CSP_HEADER = `
  default-src 'self';
  script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.googletagmanager.com https://va.vercel-scripts.com;
  style-src 'self' 'unsafe-inline';
  img-src 'self' data: blob: https://*.supabase.co https://www.googletagmanager.com;
  font-src 'self' data:;
  connect-src 'self' https://*.supabase.co https://www.google-analytics.com https://*.google-analytics.com https://*.analytics.google.com https://*.googletagmanager.com https://va.vercel-scripts.com;
  frame-ancestors 'none';
  object-src 'none';
  base-uri 'self';
  form-action 'self';
`
  .replace(/\s{2,}/g, " ")
  .trim();

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get(ADMIN_COOKIE_NAME)?.value;
  const secret = getAuthSecret();

  // 1. Admin route protection guard
  if (pathname.startsWith("/admin")) {
    const isLoginPage = pathname === "/admin/login";
    let isAuthenticated = false;

    if (token && secret) {
      const session = await verifyAdminSessionEdge(token, secret);
      isAuthenticated = session !== null;
    }

    // Unauthenticated user trying to access protected admin page
    if (!isAuthenticated && !isLoginPage) {
      const loginUrl = new URL("/admin/login", request.url);
      return NextResponse.redirect(loginUrl);
    }

    // Authenticated admin accessing login page should redirect to dashboard
    if (isAuthenticated && isLoginPage) {
      const ordersUrl = new URL("/admin/orders", request.url);
      return NextResponse.redirect(ordersUrl);
    }
  }

  // 2. Security Headers
  const response = NextResponse.next();

  response.headers.set("Content-Security-Policy", CSP_HEADER);
  response.headers.set("X-Frame-Options", "DENY");
  response.headers.set("X-Content-Type-Options", "nosniff");
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  response.headers.set(
    "Permissions-Policy",
    "camera=(), microphone=(), geolocation=()"
  );

  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico, robots.txt, sitemap.xml
     */
    "/((?!_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml).*)",
  ],
};
