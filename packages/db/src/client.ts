import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { createBrowserClient, createServerClient } from "@supabase/ssr";
import type { Database } from "./types";
import type { TablesInsert, TablesRow } from "./types-helpers";

type Cookie = { name: string; value: string };

type CookieStore = {
  getAll(): Cookie[] | Promise<Cookie[] | null> | null;
};

type MaybePromise<T> = T | Promise<T>;

type CookieAccessor = () => MaybePromise<CookieStore>;

type TypedClient = SupabaseClient<Database, "public", "public", Database["public"]>;

type ServiceClient = SupabaseClient<Database>;

export type SupabaseDatabaseClient = TypedClient;

export function getBrowserClient(
  url = process.env.NEXT_PUBLIC_SUPABASE_URL!,
  anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
): TypedClient {
  return createBrowserClient<Database, "public">(url, anon) as unknown as TypedClient;
}

export function getServerClient(
  getCookies: CookieAccessor,
  url = process.env.NEXT_PUBLIC_SUPABASE_URL!,
  anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
): TypedClient {
  return createServerClient<Database, "public">(url, anon, {
    cookies: {
      async getAll() {
        const store = await getCookies();
        const all = await store.getAll();
        return all ?? [];
      },
    },
  }) as unknown as TypedClient;
}

export function getServiceRoleClient(
  url = process.env.NEXT_PUBLIC_SUPABASE_URL!,
  serviceRole = process.env.SUPABASE_SERVICE_ROLE_KEY!
): ServiceClient {
  return createClient<Database>(url, serviceRole, {
    auth: { persistSession: false },
  });
}

export async function insertContactLead(
  db: SupabaseDatabaseClient,
  payload: TablesInsert<"contact_leads">
) {
  return (db as SupabaseClient<any>).from("contact_leads").insert(payload);
}

export async function insertLeadAction(
  db: ServiceClient,
  payload: TablesInsert<"lead_actions">
) {
  return db.from("lead_actions").insert(payload);
}

export async function upsertRuntimeFlag(
  db: ServiceClient,
  payload: TablesInsert<"runtime_flags">
) {
  return db.from("runtime_flags").upsert(payload, { onConflict: "key" });
}

export async function fetchRuntimeFlag(
  db: ServiceClient,
  key: string
) {
  return db.from("runtime_flags").select("key,value,updated_at,updated_by").eq("key", key).maybeSingle();
}

export type LeadWithActions = TablesRow<"contact_leads"> & {
  lead_actions: TablesRow<"lead_actions">[];
};

export type RuntimeFlagRow = TablesRow<"runtime_flags">;

export type { Database } from "./types";
