import type { Metadata } from "next";
import { Button, Card, CardContent, CardDescription, CardHeader, CardTitle, Container } from "@airnub/ui";
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
            <Card key={tier.name} className="flex h-full flex-col">
              <CardHeader className="p-8 pb-0">
                <CardTitle className="text-2xl">{tier.name}</CardTitle>
                <p className="text-lg font-semibold text-indigo-600 dark:text-indigo-300">{tier.price}</p>
                <CardDescription>{tier.description}</CardDescription>
              </CardHeader>
              <CardContent className="flex flex-1 flex-col justify-between gap-6 p-8 pt-4 text-sm text-muted-foreground">
                <ul className="space-y-2">
                  {tier.highlights.map((highlight) => (
                    <li key={highlight}>→ {highlight}</li>
                  ))}
                </ul>
                <Button variant="ghost" asChild>
                  <Link href="/contact">{tier.ctaLabel}</Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </Container>
      </section>
    </div>
  );
}
