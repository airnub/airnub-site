import type { Metadata } from "next";
import { Container } from "@airnub/ui";
import { PageHero } from "../../components/PageHero";
import { submitLead } from "./actions";

export const revalidate = 86_400;

export const metadata: Metadata = {
  title: "Contact",
  description: "Request a Speckit demo or talk to our product specialists.",
};

function ContactShortcuts() {
  return (
    <div className="space-y-6">
      <div className="rounded-3xl border border-white/10 bg-white/10 p-6 shadow-lg">
        <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-300">Email</h3>
        <p className="mt-2 text-sm text-slate-200">
          Product questions: <a className="text-indigo-300" href="mailto:speckit@airnub.io">speckit@airnub.io</a>
        </p>
        <p className="mt-1 text-sm text-slate-200">
          Security: <a className="text-indigo-300" href="mailto:security@airnub.io">security@airnub.io</a>
        </p>
      </div>
      <div className="rounded-3xl border border-white/10 bg-white/10 p-6 shadow-lg">
        <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-300">Docs</h3>
        <p className="mt-2 text-sm text-slate-200">Explore API references and implementation guides.</p>
        <a
          href="https://docs.speckit.dev"
          className="mt-3 inline-flex text-sm font-semibold text-indigo-300"
          target="_blank"
          rel="noreferrer"
        >
          docs.speckit.dev →
        </a>
      </div>
    </div>
  );
}

export default function ContactPage() {
  return (
    <div className="space-y-16 pb-20">
      <PageHero
        eyebrow="Contact"
        title="See Speckit in action"
        description="Share a bit about your platform program and we will tailor a walkthrough to your goals."
      />

      <section>
        <Container className="grid gap-12 lg:grid-cols-[2fr,1fr]">
          <div className="rounded-3xl border border-white/10 bg-white/10 p-10 shadow-xl">
            <h2 className="text-xl font-semibold text-white">Request a demo</h2>
            <p className="mt-3 text-sm text-slate-300">Tell us about your environment and target launch timeline.</p>
            <form action={submitLead} className="mt-8 space-y-6">
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
              <button
                type="submit"
                className="inline-flex items-center rounded-full bg-gradient-to-r from-speckit-indigo to-speckit-violet px-5 py-2 text-sm font-semibold text-white shadow-lg transition hover:opacity-90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-400"
              >
                Request demo
              </button>
            </form>
          </div>
          <ContactShortcuts />
        </Container>
      </section>
    </div>
  );
}
