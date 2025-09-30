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

export type LeadFormState = {
  status: "idle" | "success" | "error";
  message?: string;
  errors?: {
    email?: string;
  };
};

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const GENERIC_ERROR_MESSAGE =
  "We couldn't send your request right now. Please try again in a moment.";

const supabaseErrorMessages: Record<string, string> = {
  "23505":
    "Looks like we already have your request. We'll reach out as soon as possible.",
};

type SupabaseError = {
  code?: string | null;
  message?: string | null;
};

function mapSupabaseErrorMessage(error: SupabaseError | null): string {
  if (!error) {
    return GENERIC_ERROR_MESSAGE;
  }

  if (error.code && supabaseErrorMessages[error.code]) {
    return supabaseErrorMessages[error.code];
  }

  return GENERIC_ERROR_MESSAGE;
}

export async function submitLead(
  _state: LeadFormState,
  formData: FormData,
): Promise<LeadFormState> {
  const input = await leadInputFromFormData(formData);

  if (!input.email || !emailPattern.test(input.email)) {
    return {
      status: "error",
      errors: {
        email: "validation.email",
      },
    };
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
    return {
      status: "error",
      message: mapSupabaseErrorMessage(error),
    };
  }

  return {
    status: "success",
  };
}
