import createMiddleware from "next-intl/middleware";
import type { NextRequest } from "next/server";
import { defaultLocale, locales } from "./app/i18n/routing";

const intlMiddleware = createMiddleware({
  defaultLocale,
  locales,
});

export default function middleware(request: NextRequest) {
  return intlMiddleware(request);
}

export const config = {
  matcher: ["/((?!api|_next|.*\\..*|opengraph-image|icon).*)"],
};
