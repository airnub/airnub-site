"use server";

import type { Database } from "@airnub/db";
import { createServerSupabase } from "../../lib/supabase";

type LeadInsert = Database["public"]["Tables"]["contact_leads"]["Insert"];

type ContactFormState = {
  status: "idle" | "success" | "error";
  message?: string;
};

export const initialFormState: ContactFormState = { status: "idle" };

export async function submitSpeckitLead(_previous: ContactFormState, formData: FormData): Promise<ContactFormState> {
  const payload: LeadInsert = {
    full_name: formData.get("full_name")?.toString() || null,
    email: formData.get("email")?.toString() || "",
    company: formData.get("company")?.toString() || null,
    message: formData.get("message")?.toString() || null,
    consent: formData.get("consent") === "on",
    source: "speckit",
  };

  if (!payload.email) {
    return { status: "error", message: "Email is required." };
  }

  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    return { status: "error", message: "Lead capture temporarily unavailable." };
  }

  const supabase = createServerSupabase();
  const { error } = await supabase.from("contact_leads").insert(payload);
  if (error) {
    console.error("speckit lead error", error);
    return { status: "error", message: "We couldn't save your message. Please retry." };
  }

  return { status: "success" };
}
