"use client";

import { useFormState, useFormStatus } from "react-dom";
import type { SignInFormState } from "./actions";

type Props = {
  action: (state: SignInFormState | undefined, formData: FormData) => Promise<SignInFormState | void>;
};

const initialState: SignInFormState = {};

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className="inline-flex items-center justify-center rounded-full border border-slate-700/70 bg-sky-500/90 px-6 py-2 text-xs font-semibold uppercase tracking-[0.25em] text-white transition hover:bg-sky-400/90 disabled:cursor-not-allowed disabled:opacity-70"
    >
      {pending ? "Signing in…" : "Sign in"}
    </button>
  );
}

export function SignInForm({ action }: Props) {
  const [state, formAction] = useFormState(action, initialState);

  return (
    <form action={formAction} className="space-y-6" noValidate>
      <div className="space-y-2">
        <label htmlFor="email" className="text-xs font-semibold uppercase tracking-[0.25em] text-slate-300">
          Email address
        </label>
        <input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          className="w-full rounded-2xl border border-slate-800 bg-slate-950 px-4 py-3 text-sm text-white shadow-inner shadow-slate-950 focus:border-sky-400 focus:outline-none"
          required
        />
      </div>
      <div className="space-y-2">
        <label htmlFor="password" className="text-xs font-semibold uppercase tracking-[0.25em] text-slate-300">
          Password
        </label>
        <input
          id="password"
          name="password"
          type="password"
          autoComplete="current-password"
          className="w-full rounded-2xl border border-slate-800 bg-slate-950 px-4 py-3 text-sm text-white shadow-inner shadow-slate-950 focus:border-sky-400 focus:outline-none"
          required
        />
      </div>
      {state?.error ? <p className="text-sm text-rose-300">{state.error}</p> : null}
      <div className="flex items-center justify-between gap-4">
        <SubmitButton />
        <p className="text-xs text-slate-400">Supabase manages the session cookie for this device.</p>
      </div>
    </form>
  );
}
