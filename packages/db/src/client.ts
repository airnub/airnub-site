import type { SupabaseClient } from "@supabase/supabase-js";
import { createBrowserClient, createServerClient } from "@supabase/ssr";
import type { Database } from "./types";
import type { TablesInsert } from "./types-helpers";

type Cookie = { name: string; value: string };

type CookieStore = {
  getAll(): Cookie[] | Promise<Cookie[] | null> | null;
};

type MaybePromise<T> = T | Promise<T>;

type CookieAccessor = () => MaybePromise<CookieStore>;

type TypedClient = SupabaseClient<Database, "public", "public", Database["public"]>;

export type SupabaseDatabaseClient = TypedClient;

export function getBrowserClient(
  url = process.env.NEXT_PUBLIC_SUPABASE_URL!,
  anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
): TypedClient {
  return createBrowserClient<Database, "public", Database["public"]>(url, anon) as unknown as TypedClient;
}

export function getServerClient(
  getCookies: CookieAccessor,
  url = process.env.NEXT_PUBLIC_SUPABASE_URL!,
  anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
): TypedClient {
  return createServerClient<Database, "public", Database["public"]>(url, anon, {
    cookies: {
      async getAll() {
        const store = await getCookies();
        const all = await store.getAll();
        return all ?? [];
      },
    },
  }) as unknown as TypedClient;
}

export async function insertContactLead(
  db: SupabaseDatabaseClient,
  payload: TablesInsert<"contact_leads">
) {
  return (db as SupabaseClient<any>).from("contact_leads").insert(payload);
}

export type { Database } from "./types";
