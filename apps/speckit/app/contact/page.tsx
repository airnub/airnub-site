import type { Metadata } from "next";
import { Container } from "@airnub/ui";
import { PageHero } from "../../components/PageHero";
import { getCurrentLanguage } from "../../lib/language";
import { getSpeckitMessages, type SpeckitMessages } from "../../i18n/messages";
import { submitLead } from "./actions";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const language = await getCurrentLanguage();
  const contact = getSpeckitMessages(language).contact;
  return {
    title: contact.hero.title,
    description: contact.hero.description,
  };
}

type ContactShortcutsProps = {
  shortcuts: SpeckitMessages["contact"]["shortcuts"];
};

function ContactShortcuts({ shortcuts }: ContactShortcutsProps) {
  return (
    <div className="space-y-6">
      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-lg dark:border-white/10 dark:bg-white/10">
        <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-300">
          {shortcuts.emailHeading}
        </h3>
        <p className="mt-2 text-sm text-slate-600 dark:text-slate-200">{shortcuts.productQuestions}</p>
        <p className="mt-1 text-sm text-slate-600 dark:text-slate-200">{shortcuts.security}</p>
      </div>
      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-lg dark:border-white/10 dark:bg-white/10">
        <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-300">
          {shortcuts.docsHeading}
        </h3>
        <p className="mt-2 text-sm text-slate-600 dark:text-slate-200">{shortcuts.docsDescription}</p>
        <a
          href="https://docs.speckit.dev"
          className="mt-3 inline-flex text-sm font-semibold text-indigo-600 transition hover:text-indigo-700 dark:text-indigo-300 dark:hover:text-indigo-200"
          target="_blank"
          rel="noreferrer"
        >
          {shortcuts.docsCtaLabel}
        </a>
      </div>
    </div>
  );
}

export default async function ContactPage() {
  const language = await getCurrentLanguage();
  const contact = getSpeckitMessages(language).contact;

  return (
    <div className="space-y-16 pb-20">
      <PageHero
        eyebrow={contact.hero.eyebrow}
        title={contact.hero.title}
        description={contact.hero.description}
      />

      <section>
        <Container className="grid gap-12 lg:grid-cols-[2fr,1fr]">
          <div className="rounded-3xl border border-slate-200 bg-white p-10 shadow-xl dark:border-white/10 dark:bg-white/10">
            <h2 className="text-xl font-semibold text-slate-900 dark:text-white">{contact.form.title}</h2>
            <p className="mt-3 text-sm text-slate-600 dark:text-slate-300">{contact.form.description}</p>
            <form action={submitLead} className="mt-8 space-y-6">
              <div className="grid gap-6 md:grid-cols-2">
                <div>
                  <label htmlFor="full_name" className="block text-sm font-semibold text-slate-900 dark:text-slate-100">
                    {contact.form.fields.nameLabel}
                  </label>
                  <input
                    id="full_name"
                    name="full_name"
                    type="text"
                    autoComplete="name"
                    className="mt-2 w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm placeholder:text-slate-500 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:border-white/10 dark:bg-white/10 dark:text-white dark:placeholder:text-slate-400"
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-semibold text-slate-900 dark:text-slate-100">
                    {contact.form.fields.emailLabel} <span className="text-rose-400">{contact.form.fields.emailRequiredSuffix}</span>
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    autoComplete="email"
                    className="mt-2 w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm placeholder:text-slate-500 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:border-white/10 dark:bg-white/10 dark:text-white dark:placeholder:text-slate-400"
                  />
                </div>
              </div>
              <div className="grid gap-6 md:grid-cols-2">
                <div>
                  <label htmlFor="company" className="block text-sm font-semibold text-slate-900 dark:text-slate-100">
                    {contact.form.fields.companyLabel}
                  </label>
                  <input
                    id="company"
                    name="company"
                    type="text"
                    autoComplete="organization"
                    className="mt-2 w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm placeholder:text-slate-500 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:border-white/10 dark:bg-white/10 dark:text-white dark:placeholder:text-slate-400"
                  />
                </div>
                <div>
                  <label htmlFor="message" className="block text-sm font-semibold text-slate-900 dark:text-slate-100">
                    {contact.form.fields.focusLabel}
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    rows={4}
                    className="mt-2 w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm placeholder:text-slate-500 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:border-white/10 dark:bg-white/10 dark:text-white dark:placeholder:text-slate-400"
                  />
                </div>
              </div>
              <button
                type="submit"
                className="inline-flex items-center rounded-full bg-gradient-to-r from-speckit-indigo to-speckit-violet px-5 py-2 text-sm font-semibold text-white shadow-lg transition hover:opacity-90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-400"
              >
                {contact.form.submitLabel}
              </button>
            </form>
          </div>
          <ContactShortcuts shortcuts={contact.shortcuts} />
        </Container>
      </section>
    </div>
  );
}
