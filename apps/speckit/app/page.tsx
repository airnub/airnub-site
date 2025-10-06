import type { Metadata } from "next";
import Link from "next/link";
import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CTASection,
  FeatureGrid,
  Hero,
  LogoCloud,
  TestimonialWall,
} from "@airnub/ui";
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
  const heroActions = home.hero.actions;

  const isExternalLink = (href: string) => /^https?:\/\//.test(href);

  const heroActionItems = [
    heroActions.primaryLabel
      ? {
          label: heroActions.primaryLabel,
          href: heroActions.primaryHref ?? "https://airnub.github.io/speckit",
          variant: "primary" as const,
        }
      : null,
    heroActions.secondaryLabel
      ? {
          label: heroActions.secondaryLabel,
          href: heroActions.secondaryHref ?? "/quickstart",
          variant: "secondary" as const,
        }
      : null,
    heroActions.tertiaryLabel
      ? {
          label: heroActions.tertiaryLabel,
          href: heroActions.tertiaryHref ?? "https://github.com/airnub/speckit",
          variant: "ghost" as const,
        }
      : null,
  ].filter(Boolean) as {
    label: string;
    href: string;
    variant: "primary" | "secondary" | "ghost";
  }[];

  return (
    <main className="flex flex-col">
      <Hero
        eyebrow={home.hero.eyebrow}
        title={home.hero.title}
        description={home.hero.description}
        variant="gradient"
        actions={
          heroActionItems.length
            ? heroActionItems.map((action) => {
                const external = isExternalLink(action.href);
                return (
                  <Button key={action.label} variant={action.variant} asChild>
                    <Link
                      href={action.href}
                      target={external ? "_blank" : undefined}
                      rel={external ? "noopener" : undefined}
                    >
                      {action.label}
                    </Link>
                  </Button>
                );
              })
            : undefined
        }
      />

      <FeatureGrid
        items={home.features.map((feature) => ({
          id: feature.title,
          title: feature.title,
          description: feature.description,
        }))}
      />

      <CTASection
        title={home.workflows.title}
        description={home.workflows.description}
        aside={
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
        }
      >
        <div className="grid gap-4">
          {home.workflows.items.map((workflow) => (
            <Card key={workflow.name} className="h-full">
              <CardHeader className="h-full">
                <CardTitle className="text-lg">{workflow.name}</CardTitle>
                <CardDescription>{workflow.description}</CardDescription>
              </CardHeader>
            </Card>
          ))}
        </div>
      </CTASection>

      <CTASection
        title={home.alignment.title}
        description={home.alignment.description}
        actions={
          <>
            <Button variant="ghost" asChild>
              <Link href={home.alignment.actions.primaryHref}>{home.alignment.actions.primaryLabel}</Link>
            </Button>
            <Button asChild>
              <Link href={home.alignment.actions.secondaryHref}>{home.alignment.actions.secondaryLabel}</Link>
            </Button>
          </>
        }
        aside={
          <TestimonialWall
            items={home.alignment.cards.map((card) => ({
              id: card.title,
              author: card.title,
              quote: card.description,
            }))}
            columnsClassName="md:grid-cols-2"
            inline
          />
        }
      />

      <LogoCloud
        eyebrow={home.integrations.eyebrow}
        items={home.integrations.items.map((logo) => ({
          id: logo,
          name: logo,
          logo: <span className="text-sm font-semibold text-foreground">{logo}</span>,
        }))}
      />
    </main>
  );
}
