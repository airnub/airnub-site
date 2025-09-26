"use client";

import { useFormState, useFormStatus } from "react-dom";
import Link from "next/link";
import type { ReactNode } from "react";
import { initialFormState, submitSpeckitLead } from "../app/contact/actions";

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      className="inline-flex items-center rounded-full bg-gradient-to-r from-speckit-indigo to-speckit-violet px-5 py-2 text-sm font-semibold text-white shadow-lg transition hover:opacity-90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-400"
      disabled={pending}
    >
      {pending ? "Sending…" : "Request demo"}
    </button>
  );
}

export function SpeckitContactForm({ footer }: { footer?: ReactNode }) {
  const [state, formAction] = useFormState(submitSpeckitLead, initialFormState);

  return (
    <form action={formAction} className="space-y-6" noValidate>
      <div className="grid gap-6 md:grid-cols-2">
        <div>
          <label htmlFor="full_name" className="block text-sm font-semibold text-slate-100">
            Full name
          </label>
          <input
            id="full_name"
            name="full_name"
            type="text"
            autoComplete="name"
            className="mt-2 w-full rounded-xl border border-white/10 bg-white/10 px-3 py-2 text-sm text-white shadow-sm placeholder:text-slate-400 focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-400"
          />
        </div>
        <div>
          <label htmlFor="email" className="block text-sm font-semibold text-slate-100">
            Work email <span className="text-rose-400">*</span>
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            autoComplete="email"
            className="mt-2 w-full rounded-xl border border-white/10 bg-white/10 px-3 py-2 text-sm text-white shadow-sm placeholder:text-slate-400 focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-400"
          />
        </div>
      </div>
      <div className="grid gap-6 md:grid-cols-2">
        <div>
          <label htmlFor="company" className="block text-sm font-semibold text-slate-100">
            Company
          </label>
          <input
            id="company"
            name="company"
            type="text"
            autoComplete="organization"
            className="mt-2 w-full rounded-xl border border-white/10 bg-white/10 px-3 py-2 text-sm text-white shadow-sm placeholder:text-slate-400 focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-400"
          />
        </div>
        <div>
          <label htmlFor="message" className="block text-sm font-semibold text-slate-100">
            What should we focus on?
          </label>
          <textarea
            id="message"
            name="message"
            rows={4}
            className="mt-2 w-full rounded-xl border border-white/10 bg-white/10 px-3 py-2 text-sm text-white shadow-sm placeholder:text-slate-400 focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-400"
          />
        </div>
      </div>
      <div className="flex items-start gap-3">
        <input id="consent" name="consent" type="checkbox" className="mt-1 h-4 w-4 rounded border-white/20 bg-white/10 text-speckit-indigo focus:ring-indigo-400" />
        <label htmlFor="consent" className="text-sm text-slate-200">
          Keep me posted on Speckit launches and community events.
        </label>
      </div>
      {state.status === "error" ? <p className="text-sm text-rose-400">{state.message}</p> : null}
      {state.status === "success" ? <p className="text-sm font-semibold text-emerald-300">Thanks! We will reach out soon.</p> : null}
      <div className="flex items-center gap-4">
        <SubmitButton />
        {footer}
      </div>
    </form>
  );
}

export function SpeckitContactShortcuts() {
  return (
    <div className="space-y-6">
      <div className="rounded-3xl border border-white/10 bg-white/10 p-6 shadow-lg">
        <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-300">Email</h3>
        <p className="mt-2 text-sm text-slate-200">
          Product questions: <Link className="text-indigo-300" href="mailto:speckit@airnub.io">speckit@airnub.io</Link>
        </p>
        <p className="mt-1 text-sm text-slate-200">
          Security: <Link className="text-indigo-300" href="mailto:security@airnub.io">security@airnub.io</Link>
        </p>
      </div>
      <div className="rounded-3xl border border-white/10 bg-white/10 p-6 shadow-lg">
        <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-300">Docs</h3>
        <p className="mt-2 text-sm text-slate-200">Explore API references and implementation guides.</p>
        <Link href="https://docs.speckit.dev" className="mt-3 inline-flex text-sm font-semibold text-indigo-300" target="_blank" rel="noreferrer">
          docs.speckit.dev →
        </Link>
      </div>
    </div>
  );
}
