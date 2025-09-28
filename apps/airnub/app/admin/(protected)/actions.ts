"use server";

import { redirect } from "next/navigation";
import { createServerActionSupabase } from "../../../lib/supabase-auth";

export async function signOut() {
  try {
    const supabase = createServerActionSupabase();
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error("Failed to sign out", error);
    }
  } catch (error) {
    console.error("Supabase sign-out threw", error);
  }
  redirect("/admin/sign-in");
}
