import type { Metadata } from "next";
import { SignInForm } from "./SignInForm";
import { signInAction } from "./actions";

export const metadata: Metadata = {
  title: "Airnub admin · Sign in",
  description: "Authenticate with Supabase to access the Airnub remote operations console.",
};

export default function SignInPage() {
  return (
    <div className="mx-auto flex min-h-screen w-full max-w-lg items-center justify-center px-6 py-12">
      <div className="w-full space-y-8 rounded-3xl border border-border/60 bg-card/60 p-10 shadow-2xl shadow-slate-950/40">
        <div className="space-y-3 text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-sky-400/70">Airnub</p>
          <h1 className="text-3xl font-semibold tracking-tight text-foreground">Operations console access</h1>
          <p className="text-sm text-muted-foreground">
            Use the Supabase credentials for your admin user. Sessions are stored securely in HttpOnly cookies and refresh in the
            background.
          </p>
        </div>
        <SignInForm action={signInAction} />
      </div>
    </div>
  );
}
