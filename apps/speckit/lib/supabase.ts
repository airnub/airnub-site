import { getBrowserClient, getServerClient } from "@airnub/db";
import { cookies } from "next/headers";

export function createBrowserSupabase() {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    console.warn("Supabase environment variables are not set. Leads will not be persisted.");
  }
  return getBrowserClient();
}

export function createServerSupabase() {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    console.warn("Supabase environment variables are not set. Server actions cannot write to Supabase.");
  }
  return getServerClient(cookies);
}
