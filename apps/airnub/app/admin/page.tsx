import type { Metadata } from "next";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "Airnub admin",
  description: "Redirecting to the remote operations console.",
};

export default function AdminIndexPage() {
  redirect("/admin/leads");
}
