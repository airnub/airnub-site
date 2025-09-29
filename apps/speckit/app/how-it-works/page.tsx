import type { Metadata } from "next";
import { Container } from "@airnub/ui";
import { PageHero } from "../../components/PageHero";
import { getCurrentLanguage } from "../../lib/language";
import { getSpeckitMessages } from "../../i18n/messages";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const language = await getCurrentLanguage();
  const messages = getSpeckitMessages(language).howItWorks;
  return {
    title: messages.hero.title,
    description: messages.hero.description,
  };
}

export default async function HowItWorksPage() {
  const language = await getCurrentLanguage();
  const messages = getSpeckitMessages(language).howItWorks;

  return (
    <div className="space-y-16 pb-20">
      <PageHero
        eyebrow={messages.hero.eyebrow}
        title={messages.hero.title}
        description={messages.hero.description}
      />

      <section>
        <Container className="grid gap-8 lg:grid-cols-3">
          {messages.stages.map((stage, index) => (
            <div
              key={stage.name}
              className="rounded-3xl border border-slate-200 bg-white p-8 shadow-lg dark:border-white/10 dark:bg-white/10"
            >
              <span className="text-xs font-semibold uppercase tracking-wide text-indigo-600 dark:text-indigo-300">
                {messages.stageLabel.replace(/\{[^}]+\}/g, String(index + 1))}
              </span>
              <h2 className="mt-4 text-xl font-semibold text-slate-900 dark:text-white">{stage.name}</h2>
              <p className="mt-3 text-sm text-slate-600 dark:text-slate-300">{stage.description}</p>
            </div>
          ))}
        </Container>
      </section>

      <section>
        <Container className="rounded-3xl border border-slate-200 bg-white p-10 shadow-xl dark:border-white/10 dark:bg-white/10">
          <div className="grid gap-8 lg:grid-cols-3">
            {messages.audiences.map((audience) => (
              <div
                key={audience.role}
                className="rounded-2xl border border-slate-200 bg-slate-50 p-6 dark:border-white/10 dark:bg-slate-950/40"
              >
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white">{audience.role}</h3>
                <p className="mt-3 text-sm text-slate-600 dark:text-slate-300">{audience.value}</p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      <section>
        <Container className="rounded-3xl border border-slate-200 bg-gradient-to-br from-slate-50 via-white to-slate-100 p-10 shadow-xl dark:border-white/10 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
          <h2 className="text-3xl font-semibold text-slate-900 dark:text-white">{messages.tooling.title}</h2>
          <p className="mt-4 text-sm text-slate-600 dark:text-slate-300">{messages.tooling.description}</p>
          <ul className="mt-6 grid gap-4 text-sm text-slate-700 dark:text-slate-200 md:grid-cols-2">
            {messages.tooling.items.map((item) => (
              <li key={item}>→ {item}</li>
            ))}
          </ul>
        </Container>
      </section>
    </div>
  );
}
