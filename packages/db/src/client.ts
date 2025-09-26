import { createClient } from "@supabase/supabase-js";
import type { Database } from "./types";

export function getBrowserClient(
  url = process.env.NEXT_PUBLIC_SUPABASE_URL!,
  anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
) {
  return createClient<Database>(url, anon);
}

export function getServerClient(
  _cookies?: () => unknown,
  url = process.env.NEXT_PUBLIC_SUPABASE_URL!,
  anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
) {
  return createClient<Database>(url, anon, {
    auth: { persistSession: false },
  });
}

export type { Database } from "./types";
