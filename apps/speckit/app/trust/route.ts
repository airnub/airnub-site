import { redirect } from "next/navigation";

export const dynamic = "force-static";

export function GET() {
  redirect("https://trust.airnub.io");
}
