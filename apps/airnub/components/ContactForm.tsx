"use client";

import { useFormState, useFormStatus } from "react-dom";
import Link from "next/link";
import type { ReactNode } from "react";
import { initialFormState, submitLeadAction } from "../app/contact/actions";

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      className="inline-flex items-center rounded-full bg-sky-600 px-5 py-2 text-sm font-semibold text-white transition hover:bg-sky-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-500"
      disabled={pending}
    >
      {pending ? "Sending…" : "Send message"}
    </button>
  );
}

export function ContactForm({ footer }: { footer?: ReactNode }) {
  const [state, formAction] = useFormState(submitLeadAction, initialFormState);

  return (
    <form action={formAction} className="space-y-6" noValidate>
      <div className="grid gap-6 md:grid-cols-2">
        <div>
          <label htmlFor="full_name" className="block text-sm font-semibold text-slate-900">
            Full name
          </label>
          <input
            id="full_name"
            name="full_name"
            type="text"
            autoComplete="name"
            className="mt-2 w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm shadow-sm focus:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-500"
          />
        </div>
        <div>
          <label htmlFor="email" className="block text-sm font-semibold text-slate-900">
            Work email <span className="text-rose-500">*</span>
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            autoComplete="email"
            className="mt-2 w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm shadow-sm focus:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-500"
          />
        </div>
      </div>
      <div className="grid gap-6 md:grid-cols-2">
        <div>
          <label htmlFor="company" className="block text-sm font-semibold text-slate-900">
            Company
          </label>
          <input
            id="company"
            name="company"
            type="text"
            autoComplete="organization"
            className="mt-2 w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm shadow-sm focus:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-500"
          />
        </div>
        <div>
          <label htmlFor="message" className="block text-sm font-semibold text-slate-900">
            What can we help with?
          </label>
          <textarea
            id="message"
            name="message"
            rows={4}
            className="mt-2 w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm shadow-sm focus:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-500"
          />
        </div>
      </div>
      <div className="flex items-start gap-3">
        <input id="consent" name="consent" type="checkbox" className="mt-1 h-4 w-4 rounded border-slate-300 text-sky-600 focus:ring-sky-500" />
        <label htmlFor="consent" className="text-sm text-slate-600">
          I agree to receive communications from Airnub. You can unsubscribe anytime.
        </label>
      </div>
      {state.status === "error" ? <p className="text-sm text-rose-600">{state.message}</p> : null}
      {state.status === "success" ? <p className="text-sm font-semibold text-emerald-600">Thanks! We will be in touch shortly.</p> : null}
      <div className="flex items-center gap-4">
        <SubmitButton />
        {footer}
      </div>
    </form>
  );
}

export function ContactShortcuts() {
  return (
    <div className="space-y-6">
      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-400">Email</h3>
        <p className="mt-2 text-sm text-slate-600">
          Sales & partnerships: <Link className="text-sky-600" href="mailto:hello@airnub.io">hello@airnub.io</Link>
        </p>
        <p className="mt-1 text-sm text-slate-600">
          Security reports: <Link className="text-sky-600" href="mailto:security@airnub.io">security@airnub.io</Link>
        </p>
      </div>
      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-400">Office hours</h3>
        <p className="mt-2 text-sm text-slate-600">
          Join a weekly live session to see how Airnub and Speckit can accelerate your platform roadmap.
        </p>
        <Link href="https://cal.com/airnub/office-hours" className="mt-3 inline-flex text-sm font-semibold text-sky-600" target="_blank" rel="noreferrer">
          Book office hours →
        </Link>
      </div>
    </div>
  );
}
