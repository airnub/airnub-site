import { createServerClient, type CookieOptions } from "@supabase/ssr";
import type { Database } from "@airnub/db";
import { cookies as getCookies } from "next/headers";

type Cookie = { name: string; value: string };
type CookieWithOptions = { name: string; value: string; options: Partial<CookieOptions> };
type CookieStore = Awaited<ReturnType<typeof getCookies>>;

function ensureEnv(name: string) {
  const value = process.env[name];
  if (!value) {
    throw new Error(`${name} is not configured`);
  }
  return value;
}

export function createServerActionSupabase() {
  const supabaseUrl = ensureEnv("NEXT_PUBLIC_SUPABASE_URL");
  const supabaseAnonKey = ensureEnv("NEXT_PUBLIC_SUPABASE_ANON_KEY");

  const cookieStorePromise = Promise.resolve(getCookies() as Promise<CookieStore> | CookieStore);

  return createServerClient<Database>(supabaseUrl, supabaseAnonKey, {
    cookies: {
      async getAll() {
        const store = await cookieStorePromise;
        const all = store.getAll();
        return all.map(({ name, value }) => ({ name, value })) as Cookie[];
      },
      async setAll(cookies) {
        const store = await Promise.resolve(getCookies() as Promise<CookieStore> | CookieStore);
        for (const cookie of cookies as CookieWithOptions[]) {
          store.set(cookie.name, cookie.value, cookie.options);
        }
      },
    },
  });
}
