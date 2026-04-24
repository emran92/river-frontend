import { NextRequest, NextResponse } from "next/server";
import { TOKEN_COOKIE } from "@/lib/auth";

// Routes that require authentication
const PROTECTED_ROUTES = ["/account", "/orders", "/wishlist", "/checkout"];

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const isProtected = PROTECTED_ROUTES.some((route) =>
    pathname.startsWith(route),
  );

  if (isProtected) {
    const token = request.cookies.get(TOKEN_COOKIE)?.value;
    if (!token) {
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("redirect", pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/account/:path*",
    "/orders/:path*",
    "/wishlist/:path*",
    "/checkout/:path*",
  ],
};
