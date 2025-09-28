import "../globals.css";
import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  title: "Airnub admin",
  description: "Remote operations for marketing leads and runtime controls.",
};

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-slate-100">
        <div className="mx-auto flex min-h-screen w-full max-w-7xl flex-col gap-10 px-6 py-12 sm:px-10 lg:px-16">
          <header className="flex flex-col gap-2 border-b border-slate-800/60 pb-6">
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-sky-400/70">Airnub</p>
            <h1 className="text-3xl font-semibold tracking-tight text-white">Operations console</h1>
            <p className="max-w-2xl text-sm text-slate-300">
              Securely manage inbound leads and runtime toggles from any device. Credentials are required through HTTP basic
              auth; please keep them private.
            </p>
          </header>
          <main className="flex-1 pb-16">{children}</main>
          <footer className="border-t border-slate-800/60 pt-6 text-xs text-slate-500">
            © {new Date().getFullYear()} Airnub. Remote updates are tracked via Supabase service role.
          </footer>
        </div>
      </body>
    </html>
  );
}
