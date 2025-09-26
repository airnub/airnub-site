"use server";

import { createServerSupabase } from "../../lib/supabase";
import type { Database } from "@airnub/db";

type LeadInsert = Database["public"]["Tables"]["contact_leads"]["Insert"];

type ContactFormState = {
  status: "idle" | "success" | "error";
  message?: string;
};

export async function submitLeadAction(_prevState: ContactFormState, formData: FormData): Promise<ContactFormState> {
  const payload: LeadInsert = {
    full_name: formData.get("full_name")?.toString() || null,
    email: formData.get("email")?.toString() || "",
    company: formData.get("company")?.toString() || null,
    message: formData.get("message")?.toString() || null,
    consent: formData.get("consent") === "on",
    source: "airnub",
  };

  if (!payload.email) {
    return { status: "error", message: "Email is required." };
  }

  const supabase = createServerSupabase();
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    return { status: "error", message: "Lead capture temporarily unavailable." };
  }

  const { error } = await supabase.from("contact_leads").insert(payload);
  if (error) {
    console.error("lead submission failed", error);
    return { status: "error", message: "We couldn't save your details just yet. Please retry." };
  }

  return { status: "success" };
}

export const initialFormState: ContactFormState = { status: "idle" };
