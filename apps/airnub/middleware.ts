import createMiddleware from "next-intl/middleware";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { defaultLocale, locales } from "./i18n/routing";

const intlMiddleware = createMiddleware({
  defaultLocale,
  locales,
});

export default function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  if (
    pathname.startsWith("/admin") ||
    pathname === "/opengraph-image" ||
    pathname === "/icon"
  ) {
    return NextResponse.next();
  }

  return intlMiddleware(request);
}

export const config = {
  matcher: ["/((?!api|_next|.*\\..*|opengraph-image|icon).*)"],
};
