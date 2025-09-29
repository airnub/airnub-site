import type { Metadata } from "next";
import { Button, Container } from "@airnub/ui";
import { PageHero } from "../../components/PageHero";
import Link from "next/link";
import { getCurrentLanguage } from "../../lib/language";
import { getSpeckitMessages } from "../../i18n/messages";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const language = await getCurrentLanguage();
  const pricing = getSpeckitMessages(language).pricing;
  return {
    title: pricing.hero.title,
    description: pricing.hero.description,
  };
}

export default async function PricingPage() {
  const language = await getCurrentLanguage();
  const pricing = getSpeckitMessages(language).pricing;

  return (
    <div className="space-y-16 pb-20">
      <PageHero
        eyebrow={pricing.hero.eyebrow}
        title={pricing.hero.title}
        description={pricing.hero.description}
        actions={
          pricing.hero.actions.primaryLabel ? (
            <Button asChild>
              <Link href={pricing.hero.actions.primaryHref ?? "/contact"}>{pricing.hero.actions.primaryLabel}</Link>
            </Button>
          ) : null
        }
      />

      <section>
        <Container className="grid gap-8 lg:grid-cols-3">
          {pricing.tiers.map((tier) => (
            <div
              key={tier.name}
              className="flex h-full flex-col rounded-3xl border border-border bg-card p-8 shadow-lg"
            >
              <div className="flex-1">
                <h2 className="text-2xl font-semibold text-foreground">{tier.name}</h2>
                <p className="mt-3 text-lg font-semibold text-indigo-600 dark:text-indigo-300">{tier.price}</p>
                <p className="mt-3 text-sm text-muted-foreground">{tier.description}</p>
                <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
                  {tier.highlights.map((highlight) => (
                    <li key={highlight}>→ {highlight}</li>
                  ))}
                </ul>
              </div>
              <Button variant="ghost" asChild>
                <Link href="/contact">{tier.ctaLabel}</Link>
              </Button>
            </div>
          ))}
        </Container>
      </section>
    </div>
  );
}
