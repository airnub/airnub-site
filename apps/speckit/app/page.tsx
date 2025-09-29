import type { Metadata } from "next";
import Link from "next/link";
import { Button, Container } from "@airnub/ui";
import { PageHero } from "../components/PageHero";
import { getCurrentLanguage } from "../lib/language";
import { getSpeckitMessages } from "../i18n/messages";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const language = await getCurrentLanguage();
  const home = getSpeckitMessages(language).home;
  return {
    title: home.hero.title,
    description: home.hero.description,
  };
}

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
            {home.hero.actions.primaryLabel ? (
              <Button asChild>
                <Link href={home.hero.actions.primaryHref ?? "/contact"}>{home.hero.actions.primaryLabel}</Link>
              </Button>
            ) : null}
            {home.hero.actions.secondaryLabel ? (
              <Button variant="ghost" asChild>
                <Link
                  href={home.hero.actions.secondaryHref ?? "https://docs.speckit.dev"}
                  target={home.hero.actions.secondaryHref?.startsWith("http") ? "_blank" : undefined}
                  rel={home.hero.actions.secondaryHref?.startsWith("http") ? "noreferrer" : undefined}
                >
                  {home.hero.actions.secondaryLabel}
                </Link>
              </Button>
            ) : null}
          </>
        }
      />

      <section>
        <Container className="grid gap-8 lg:grid-cols-3">
          {home.features.map((feature) => (
            <div
              key={feature.title}
              className="rounded-3xl border border-border bg-card p-8 shadow-lg"
            >
              <h3 className="text-xl font-semibold text-foreground">{feature.title}</h3>
              <p className="mt-3 text-sm text-muted-foreground">{feature.description}</p>
            </div>
          ))}
        </Container>
      </section>

      <section>
        <Container className="grid gap-12 lg:grid-cols-[3fr,2fr] lg:items-center">
          <div>
            <h2 className="text-3xl font-semibold text-foreground">{home.workflows.title}</h2>
            <p className="mt-4 text-base text-muted-foreground">{home.workflows.description}</p>
            <div className="mt-6 grid gap-4">
              {home.workflows.items.map((workflow) => (
                <div
                  key={workflow.name}
                  className="rounded-2xl border border-border bg-card p-4"
                >
                  <h3 className="text-lg font-semibold text-foreground">{workflow.name}</h3>
                  <p className="mt-2 text-sm text-muted-foreground">{workflow.description}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="relative overflow-hidden rounded-3xl border border-border bg-card p-6">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(99,102,241,0.15),_transparent_55%)] dark:bg-[radial-gradient(circle_at_top,_rgba(99,102,241,0.25),_transparent_55%)]" aria-hidden="true" />
            <div className="relative space-y-6 text-sm text-muted-foreground">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-indigo-600 dark:text-indigo-300">
                  {home.guardrails.cardTitle}
                </p>
                <div className="mt-3 rounded-2xl border border-border bg-muted p-4">
                  <p className="font-semibold text-foreground">{home.guardrails.specTitle}</p>
                  <ul className="mt-3 space-y-2 text-xs text-muted-foreground">
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
                <div className="mt-3 space-y-2 text-xs text-muted-foreground">
                  {home.guardrails.evidence.map((item) => (
                    <div
                      key={item.label}
                      className="flex items-center justify-between rounded-xl border border-border bg-card px-3 py-2"
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
        <Container className="rounded-3xl border border-border bg-card p-10 shadow-xl">
          <div className="grid gap-10 lg:grid-cols-[2fr,3fr] lg:items-center">
            <div>
              <h2 className="text-3xl font-semibold text-foreground">{home.alignment.title}</h2>
              <p className="mt-4 text-base text-muted-foreground">{home.alignment.description}</p>
              <div className="mt-6 flex flex-wrap gap-4">
                <Button variant="ghost" asChild>
                  <Link href={home.alignment.actions.primaryHref}>{home.alignment.actions.primaryLabel}</Link>
                </Button>
                <Button asChild>
                  <Link href={home.alignment.actions.secondaryHref}>{home.alignment.actions.secondaryLabel}</Link>
                </Button>
              </div>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              {home.alignment.cards.map((card) => (
                <div
                  key={card.title}
                  className="rounded-2xl border border-border bg-muted p-6"
                >
                  <h3 className="text-lg font-semibold text-foreground">{card.title}</h3>
                  <p className="mt-2 text-sm text-muted-foreground">{card.description}</p>
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
          <div className="mt-8 flex flex-wrap items-center justify-center gap-6 text-muted-foreground">
            {home.integrations.items.map((logo) => (
              <div
                key={logo}
                className="flex h-16 w-36 items-center justify-center rounded-2xl border border-border bg-card"
              >
                <span className="text-sm font-semibold text-foreground">{logo}</span>
              </div>
            ))}
          </div>
        </Container>
      </section>
    </div>
  );
}
