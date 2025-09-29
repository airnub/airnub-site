"use client";

import { useFormState, useFormStatus } from "react-dom";
import { Button } from "@airnub/ui";
import type { SignInFormState } from "./actions";

type Props = {
  action: (state: SignInFormState | undefined, formData: FormData) => Promise<SignInFormState | void>;
};

const initialState: SignInFormState = {};

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <Button
      type="submit"
      disabled={pending}
      aria-disabled={pending}
      className="px-6 py-2 text-xs font-semibold uppercase tracking-[0.25em]"
    >
      {pending ? "Signing in…" : "Sign in"}
    </Button>
  );
}

export function SignInForm({ action }: Props) {
  const [state, formAction] = useFormState(action, initialState);

  return (
    <form action={formAction} className="space-y-6" noValidate>
      <div className="space-y-2">
        <label htmlFor="email" className="text-xs font-semibold uppercase tracking-[0.25em] text-muted-foreground">
          Email address
        </label>
        <input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          className="w-full rounded-2xl border border-border bg-card px-4 py-3 text-sm text-foreground shadow-inner shadow-slate-950 focus:border-ring focus:outline-none"
          required
        />
      </div>
      <div className="space-y-2">
        <label htmlFor="password" className="text-xs font-semibold uppercase tracking-[0.25em] text-muted-foreground">
          Password
        </label>
        <input
          id="password"
          name="password"
          type="password"
          autoComplete="current-password"
          className="w-full rounded-2xl border border-border bg-card px-4 py-3 text-sm text-foreground shadow-inner shadow-slate-950 focus:border-ring focus:outline-none"
          required
        />
      </div>
      {state?.error ? <p className="text-sm text-rose-300">{state.error}</p> : null}
      <div className="flex items-center justify-between gap-4">
        <SubmitButton />
        <p className="text-xs text-muted-foreground">Supabase manages the session cookie for this device.</p>
      </div>
    </form>
  );
}
