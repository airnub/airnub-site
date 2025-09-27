"use server";

import { cookies } from "next/headers";
import { getServerClient, insertContactLead } from "@airnub/db";
import type { SupabaseDatabaseClient, TablesInsert } from "@airnub/db";

export type LeadInput = {
  full_name?: string;
  email: string;
  company?: string;
  message?: string;
};

export async function leadInputFromFormData(formData: FormData): Promise<LeadInput> {
  const toValue = (field: string) => formData.get(field)?.toString().trim();
  return {
    full_name: toValue("full_name") || undefined,
    email: toValue("email") || "",
    company: toValue("company") || undefined,
    message: toValue("message") || undefined,
  };
}

export async function submitLead(input: LeadInput) {
  if (!input.email) {
    throw new Error("Email is required.");
  }

  const db: SupabaseDatabaseClient = getServerClient(cookies);
  const payload: TablesInsert<"contact_leads"> = {
    full_name: input.full_name ?? null,
    email: input.email,
    company: input.company ?? null,
    message: input.message ?? null,
    source: "speckit" as const,
    consent: false,
  };

  const { error } = await insertContactLead(db, payload);

  if (error) {
    throw new Error(error.message);
  }
}
