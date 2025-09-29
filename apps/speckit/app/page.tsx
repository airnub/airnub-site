import type { Metadata } from "next";
import Link from "next/link";
import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Container,
} from "@airnub/ui";
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
            <Card key={feature.title} className="h-full">
              <CardHeader className="h-full">
                <CardTitle className="text-xl">{feature.title}</CardTitle>
                <CardDescription>{feature.description}</CardDescription>
              </CardHeader>
            </Card>
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
                <Card key={workflow.name} className="h-full">
                  <CardHeader className="h-full">
                    <CardTitle className="text-lg">{workflow.name}</CardTitle>
                    <CardDescription>{workflow.description}</CardDescription>
                  </CardHeader>
                </Card>
              ))}
            </div>
          </div>
          <Card className="relative overflow-hidden">
            <div
              className="absolute inset-0 bg-[radial-gradient(circle_at_top,_color-mix(in_srgb,var(--brand-primary)_15%,transparent),_transparent_55%)]"
              aria-hidden="true"
            />
            <CardContent className="relative space-y-6 pt-5 text-sm text-muted-foreground">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-primary/80">
                  {home.guardrails.cardTitle}
                </p>
                <Card className="mt-3 border-none bg-muted shadow-none">
                  <CardHeader className="gap-3">
                    <CardTitle className="text-base">{home.guardrails.specTitle}</CardTitle>
                  </CardHeader>
                  <CardContent className="text-xs text-muted-foreground">
                    <ul className="space-y-2">
                      {home.guardrails.checklist.map((item) => (
                        <li key={item}>{item}</li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-primary/80">
                  {home.guardrails.evidenceTitle}
                </p>
                <div className="mt-3 space-y-2 text-xs text-muted-foreground">
                  {home.guardrails.evidence.map((item) => (
                    <Card key={item.label} className="shadow-none">
                      <CardContent className="flex items-center justify-between pt-5">
                        <span>{item.label}</span>
                        <span className="text-primary">{item.status}</span>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </Container>
      </section>

      <section>
        <Container>
          <Card>
            <CardContent className="grid gap-10 pt-5 lg:grid-cols-[2fr,3fr] lg:items-center">
              <div className="space-y-6">
                <CardHeader className="p-0">
                  <CardTitle className="text-3xl text-foreground">{home.alignment.title}</CardTitle>
                  <CardDescription className="text-base text-muted-foreground">
                    {home.alignment.description}
                  </CardDescription>
                </CardHeader>
                <div className="flex flex-wrap gap-4">
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
                  <Card key={card.title} className="bg-muted shadow-none">
                    <CardHeader>
                      <CardTitle className="text-lg">{card.title}</CardTitle>
                      <CardDescription>{card.description}</CardDescription>
                    </CardHeader>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </Container>
      </section>

      <section>
        <Container className="text-center">
          <p className="text-sm font-semibold uppercase tracking-wide text-primary/80">
            {home.integrations.eyebrow}
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-6 text-muted-foreground">
            {home.integrations.items.map((logo) => (
              <Card key={logo} className="h-16 w-36 shadow-none">
                <CardContent className="flex h-full items-center justify-center pt-5 text-sm font-semibold text-foreground">
                  {logo}
                </CardContent>
              </Card>
            ))}
          </div>
        </Container>
      </section>
    </div>
  );
}
