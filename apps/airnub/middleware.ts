import createMiddleware from "next-intl/middleware";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { defaultLocale, locales } from "./i18n/routing";

const intlMiddleware = createMiddleware({
  defaultLocale,
  locales,
});

function unauthorizedResponse() {
  return new NextResponse("Unauthorized", {
    status: 401,
    headers: {
      "WWW-Authenticate": 'Basic realm="Airnub Admin"',
    },
  });
}

export default function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  if (pathname.startsWith("/admin")) {
    const username = process.env.ADMIN_DASHBOARD_USER;
    const password = process.env.ADMIN_DASHBOARD_PASSWORD;

    if (!username || !password) {
      return new NextResponse("Admin credentials are not configured.", { status: 503 });
    }

    const authHeader = request.headers.get("authorization");

    if (!authHeader || !authHeader.startsWith("Basic ")) {
      return unauthorizedResponse();
    }

    try {
      const encoded = authHeader.split(" ", 2)[1] ?? "";
      const decoded = atob(encoded);
      const [providedUser, providedPassword] = decoded.split(":", 2);

      if (providedUser !== username || providedPassword !== password) {
        return unauthorizedResponse();
      }
    } catch {
      return unauthorizedResponse();
    }

    return NextResponse.next();
  }

  return intlMiddleware(request);
}

export const config = {
  matcher: ["/((?!api|_next|.*\\..*).*)"],
};
