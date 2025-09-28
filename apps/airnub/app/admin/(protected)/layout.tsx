import type { ReactNode } from "react";
import { redirect } from "next/navigation";
import { createServerSupabase } from "../../../lib/supabase";
import { signOut } from "./actions";

export default async function ProtectedAdminLayout({ children }: { children: ReactNode }) {
  const supabase = createServerSupabase();
  const {
    data: { session },
    error,
  } = await supabase.auth.getSession();

  if (error) {
    console.error("Supabase session error", error);
    redirect("/admin/sign-in");
  }

  if (!session) {
    redirect("/admin/sign-in");
  }

  const userEmail = session.user.email ?? "Admin";

  return (
    <div className="mx-auto flex min-h-screen w-full max-w-7xl flex-col gap-10 px-6 py-12 sm:px-10 lg:px-16">
      <header className="flex flex-col gap-6 border-b border-slate-800/60 pb-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="space-y-2">
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-sky-400/70">Airnub</p>
            <h1 className="text-3xl font-semibold tracking-tight text-white">Operations console</h1>
            <p className="max-w-2xl text-sm text-slate-300">
              Securely manage inbound leads and runtime toggles from any device. Supabase Auth protects this console; sessions
              refresh automatically while you work.
            </p>
          </div>
          <form action={signOut} className="flex w-full flex-col items-start gap-2 text-sm text-slate-300 sm:w-auto sm:items-end">
            <span className="text-xs uppercase tracking-wide text-slate-500">Signed in</span>
            <span className="text-sm font-medium text-slate-100">{userEmail}</span>
            <button
              type="submit"
              className="rounded-full border border-slate-700/70 bg-slate-900/60 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.25em] text-slate-200 transition hover:border-slate-600 hover:bg-slate-900"
            >
              Sign out
            </button>
          </form>
        </div>
      </header>
      <main className="flex-1 pb-16">{children}</main>
      <footer className="border-t border-slate-800/60 pt-6 text-xs text-slate-500">
        © {new Date().getFullYear()} Airnub. Remote updates are tracked via Supabase service role.
      </footer>
    </div>
  );
}
