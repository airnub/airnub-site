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
              className="rounded-3xl border border-border bg-card p-8 shadow-lg"
            >
              <span className="text-xs font-semibold uppercase tracking-wide text-indigo-600 dark:text-indigo-300">
                {messages.stageLabel.replace(/\{[^}]+\}/g, String(index + 1))}
              </span>
              <h2 className="mt-4 text-xl font-semibold text-foreground">{stage.name}</h2>
              <p className="mt-3 text-sm text-muted-foreground">{stage.description}</p>
            </div>
          ))}
        </Container>
      </section>

      <section>
        <Container className="rounded-3xl border border-border bg-card p-10 shadow-xl">
          <div className="grid gap-8 lg:grid-cols-3">
            {messages.audiences.map((audience) => (
              <div
                key={audience.role}
                className="rounded-2xl border border-border bg-muted p-6"
              >
                <h3 className="text-lg font-semibold text-foreground">{audience.role}</h3>
                <p className="mt-3 text-sm text-muted-foreground">{audience.value}</p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      <section>
        <Container className="rounded-3xl border border-border bg-gradient-to-br from-muted via-background to-muted p-10 shadow-xl">
          <h2 className="text-3xl font-semibold text-foreground">{messages.tooling.title}</h2>
          <p className="mt-4 text-sm text-muted-foreground">{messages.tooling.description}</p>
          <ul className="mt-6 grid gap-4 text-sm text-muted-foreground md:grid-cols-2">
            {messages.tooling.items.map((item) => (
              <li key={item}>→ {item}</li>
            ))}
          </ul>
        </Container>
      </section>
    </div>
  );
}
