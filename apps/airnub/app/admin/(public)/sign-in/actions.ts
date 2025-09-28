"use server";

import { redirect } from "next/navigation";
import { createServerActionSupabase } from "../../../../lib/supabase-auth";

export type SignInFormState = {
  error?: string;
};

const GENERIC_ERROR = "Unable to sign in with those credentials. Confirm the admin email and password in Supabase.";

export async function signInAction(_prevState: SignInFormState | undefined, formData: FormData): Promise<SignInFormState | void> {
  const email = formData.get("email");
  const password = formData.get("password");

  if (typeof email !== "string" || typeof password !== "string" || !email || !password) {
    return { error: "Enter both the email address and password." };
  }

  try {
    const supabase = createServerActionSupabase();
    const { error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      return { error: GENERIC_ERROR };
    }
  } catch (error) {
    console.error("Admin sign-in failed", error);
    return { error: GENERIC_ERROR };
  }

  redirect("/admin/leads");
}
