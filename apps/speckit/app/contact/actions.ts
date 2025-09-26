"use server";

import { cookies } from "next/headers";
import { getServerClient } from "@airnub/db";

type LeadInput = {
  full_name?: string;
  email: string;
  company?: string;
  message?: string;
};

export async function submitLead(formData: FormData) {
  const input: LeadInput = {
    full_name: formData.get("full_name")?.toString().trim() || undefined,
    email: formData.get("email")?.toString().trim() || "",
    company: formData.get("company")?.toString().trim() || undefined,
    message: formData.get("message")?.toString().trim() || undefined,
  };

  if (!input.email) {
    throw new Error("Email is required.");
  }

  const db = getServerClient(cookies);
  const { error } = await db.from("contact_leads").insert({
    full_name: input.full_name ?? null,
    email: input.email,
    company: input.company ?? null,
    message: input.message ?? null,
    source: "speckit",
    consent: false,
  });

  if (error) {
    throw new Error(error.message);
  }
}
