import type { Metadata } from "next";
import { Container } from "@airnub/ui";
import { PageHero } from "../../components/PageHero";
import { submitLead } from "./actions";

export const revalidate = 86_400;

export const metadata: Metadata = {
  title: "Contact",
  description: "Get in touch with Airnub for product demos, partnerships, or media inquiries.",
};

function ContactShortcuts() {
  return (
    <div className="space-y-6">
      <div className="rounded-3xl border border-slate-800 bg-slate-900/60 p-6 shadow-lg shadow-slate-950/40">
        <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-400">Email</h3>
        <p className="mt-2 text-sm text-slate-300">
          Sales & partnerships: <a className="text-sky-400" href="mailto:hello@airnub.io">hello@airnub.io</a>
        </p>
        <p className="mt-1 text-sm text-slate-300">
          Security reports: <a className="text-sky-400" href="mailto:security@airnub.io">security@airnub.io</a>
        </p>
      </div>
      <div className="rounded-3xl border border-slate-800 bg-slate-900/60 p-6 shadow-lg shadow-slate-950/40">
        <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-400">Office hours</h3>
        <p className="mt-2 text-sm text-slate-300">
          Join a weekly live session to see how Airnub and Speckit can accelerate your platform roadmap.
        </p>
        <a
          href="https://cal.com/airnub/office-hours"
          className="mt-3 inline-flex text-sm font-semibold text-sky-400"
          target="_blank"
          rel="noreferrer"
        >
          Book office hours →
        </a>
      </div>
    </div>
  );
}

export default function ContactPage() {
  return (
    <div className="space-y-16 pb-24 text-slate-300">
      <PageHero
        eyebrow="Contact"
        title="Let’s build your trust-forward platform"
        description="Tell us about your goals and we will connect you with the right Airnub experts."
      />

      <section>
        <Container className="grid gap-12 lg:grid-cols-[2fr,1fr]">
          <div className="rounded-3xl border border-slate-800 bg-slate-900/70 p-10 shadow-lg shadow-slate-950/40">
            <h2 className="text-xl font-semibold text-white">Send us a note</h2>
            <p className="mt-3 text-sm text-slate-400">We typically reply within one business day.</p>
            <form action={submitLead} className="mt-8 space-y-6">
              <div className="grid gap-6 md:grid-cols-2">
                <div>
                  <label htmlFor="full_name" className="block text-sm font-semibold text-white">
                    Full name
                  </label>
                  <input
                    id="full_name"
                    name="full_name"
                    type="text"
                    autoComplete="name"
                    className="mt-2 w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-white shadow-sm placeholder:text-slate-500 focus:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-500"
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-semibold text-white">
                    Work email <span className="text-rose-400">*</span>
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    autoComplete="email"
                    className="mt-2 w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-white shadow-sm placeholder:text-slate-500 focus:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-500"
                  />
                </div>
              </div>
              <div className="grid gap-6 md:grid-cols-2">
                <div>
                  <label htmlFor="company" className="block text-sm font-semibold text-white">
                    Company
                  </label>
                  <input
                    id="company"
                    name="company"
                    type="text"
                    autoComplete="organization"
                    className="mt-2 w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-white shadow-sm placeholder:text-slate-500 focus:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-500"
                  />
                </div>
                <div>
                  <label htmlFor="message" className="block text-sm font-semibold text-white">
                    What can we help with?
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    rows={4}
                    className="mt-2 w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-white shadow-sm placeholder:text-slate-500 focus:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-500"
                  />
                </div>
              </div>
              <button
                type="submit"
                className="inline-flex items-center rounded-full bg-sky-600 px-5 py-2 text-sm font-semibold text-white transition hover:bg-sky-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-500"
              >
                Send message
              </button>
            </form>
          </div>
          <ContactShortcuts />
        </Container>
      </section>
    </div>
  );
}
