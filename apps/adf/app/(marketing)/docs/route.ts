import { NextResponse } from "next/server";

const DOCS_URL = process.env.NEXT_PUBLIC_DOCS_URL ?? "https://airnub.github.io/agentic-delivery-framework/";

export const dynamic = "force-static";

export function GET() {
  return NextResponse.redirect(DOCS_URL, {
    status: 302,
  });
}
