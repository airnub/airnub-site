import type { Metadata } from "next";
import Link from "next/link";
import { Button, Container } from "@airnub/ui";
import { PageHero } from "../components/PageHero";
import { getCurrentLanguage } from "../lib/language";
import { getSpeckitMessages } from "../i18n/messages";

export const revalidate = 86_400;

export const metadata: Metadata = {
  title: "End vibe-coding. Ship secure, auditable releases.",
};

export default async function SpeckitHome() {
  const language = await getCurrentLanguage();
  const messages = getSpeckitMessages(language);
  const home = messages.home;

  return (
    <div className="space-y-24 pb-24">
      <PageHero
        eyebrow={home.hero.eyebrow}
        title={home.hero.title}
        description={home.hero.description}
        actions={
          <>
            <Button asChild>
              <Link href="/contact">{home.hero.actions.requestDemo}</Link>
            </Button>
            <Button variant="ghost" asChild>
              <Link href="https://docs.speckit.dev" target="_blank" rel="noreferrer">
                {home.hero.actions.exploreDocs}
              </Link>
            </Button>
          </>
        }
      />

      <section>
        <Container className="grid gap-8 lg:grid-cols-3">
          {home.features.map((feature) => (
            <div
              key={feature.title}
              className="rounded-3xl border border-slate-200 bg-white p-8 shadow-lg dark:border-white/10 dark:bg-white/10"
            >
              <h3 className="text-xl font-semibold text-slate-900 dark:text-white">{feature.title}</h3>
              <p className="mt-3 text-sm text-slate-600 dark:text-slate-300">{feature.description}</p>
            </div>
          ))}
        </Container>
      </section>

      <section>
        <Container className="grid gap-12 lg:grid-cols-[3fr,2fr] lg:items-center">
          <div>
            <h2 className="text-3xl font-semibold text-slate-900 dark:text-white">{home.workflows.title}</h2>
            <p className="mt-4 text-base text-slate-600 dark:text-slate-300">{home.workflows.description}</p>
            <div className="mt-6 grid gap-4">
              {home.workflows.items.map((workflow) => (
                <div
                  key={workflow.name}
                  className="rounded-2xl border border-slate-200 bg-white p-4 dark:border-white/10 dark:bg-white/5"
                >
                  <h3 className="text-lg font-semibold text-slate-900 dark:text-white">{workflow.name}</h3>
                  <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">{workflow.description}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="relative overflow-hidden rounded-3xl border border-slate-200 bg-white p-6 dark:border-white/10 dark:bg-white/5">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(99,102,241,0.15),_transparent_55%)] dark:bg-[radial-gradient(circle_at_top,_rgba(99,102,241,0.25),_transparent_55%)]" aria-hidden="true" />
            <div className="relative space-y-6 text-sm text-slate-700 dark:text-slate-200">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-indigo-600 dark:text-indigo-300">
                  {home.guardrails.cardTitle}
                </p>
                <div className="mt-3 rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-white/10 dark:bg-slate-950/60">
                  <p className="font-semibold text-slate-900 dark:text-white">{home.guardrails.specTitle}</p>
                  <ul className="mt-3 space-y-2 text-xs text-slate-600 dark:text-slate-300">
                    {home.guardrails.checklist.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </div>
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-indigo-600 dark:text-indigo-300">
                  {home.guardrails.evidenceTitle}
                </p>
                <div className="mt-3 space-y-2 text-xs text-slate-700 dark:text-slate-200">
                  {home.guardrails.evidence.map((item) => (
                    <div
                      key={item.label}
                      className="flex items-center justify-between rounded-xl border border-slate-200 bg-white px-3 py-2 dark:border-white/10 dark:bg-white/5"
                    >
                      <span>{item.label}</span>
                      <span className="text-indigo-600 dark:text-indigo-300">{item.status}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </Container>
      </section>

      <section>
        <Container className="rounded-3xl border border-slate-200 bg-white p-10 shadow-xl dark:border-white/10 dark:bg-white/10">
          <div className="grid gap-10 lg:grid-cols-[2fr,3fr] lg:items-center">
            <div>
              <h2 className="text-3xl font-semibold text-slate-900 dark:text-white">{home.alignment.title}</h2>
              <p className="mt-4 text-base text-slate-600 dark:text-slate-200">{home.alignment.description}</p>
              <div className="mt-6 flex flex-wrap gap-4">
                <Button variant="ghost" asChild>
                  <Link href="/how-it-works">{home.alignment.actions.howItWorks}</Link>
                </Button>
                <Button asChild>
                  <Link href="/template">{home.alignment.actions.template}</Link>
                </Button>
              </div>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              {home.alignment.cards.map((card) => (
                <div
                  key={card.title}
                  className="rounded-2xl border border-slate-200 bg-slate-50 p-6 dark:border-white/10 dark:bg-slate-950/40"
                >
                  <h3 className="text-lg font-semibold text-slate-900 dark:text-white">{card.title}</h3>
                  <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">{card.description}</p>
                </div>
              ))}
            </div>
          </div>
        </Container>
      </section>

      <section>
        <Container className="text-center">
          <p className="text-sm font-semibold uppercase tracking-wide text-indigo-600 dark:text-indigo-300">
            {home.integrations.eyebrow}
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-6 text-slate-600 dark:text-slate-300">
            {home.integrations.items.map((logo) => (
              <div
                key={logo}
                className="flex h-16 w-36 items-center justify-center rounded-2xl border border-slate-200 bg-white dark:border-white/10 dark:bg-white/5"
              >
                <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">{logo}</span>
              </div>
            ))}
          </div>
        </Container>
      </section>
    </div>
  );
}
