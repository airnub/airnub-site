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
import { PageHero } from "../../components/PageHero";
import { getCurrentLanguage } from "../../lib/language";
import { getSpeckitMessages } from "../../i18n/messages";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const language = await getCurrentLanguage();
  const product = getSpeckitMessages(language).product;
  return {
    title: product.hero.title,
    description: product.hero.description,
  };
}

export default async function ProductPage() {
  const language = await getCurrentLanguage();
  const product = getSpeckitMessages(language).product;

  return (
    <div className="space-y-20 pb-20">
      <PageHero
        eyebrow={product.hero.eyebrow}
        title={product.hero.title}
        description={product.hero.description}
        actions={
          product.hero.actions.primaryLabel ? (
            <Button asChild>
              <Link href={product.hero.actions.primaryHref ?? "/pricing"}>{product.hero.actions.primaryLabel}</Link>
            </Button>
          ) : null
        }
      />

      <section>
        <Container className="grid gap-8 lg:grid-cols-3">
          {product.pillars.map((pillar) => (
            <Card key={pillar.title} className="h-full">
              <CardHeader className="h-full">
                <CardTitle className="text-2xl">{pillar.title}</CardTitle>
                <CardDescription>{pillar.description}</CardDescription>
              </CardHeader>
            </Card>
          ))}
        </Container>
      </section>

      <section>
        <Container className="grid gap-12 lg:grid-cols-[2fr,3fr] lg:items-start">
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">{product.timeline.title}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6 text-sm text-muted-foreground">
              {product.timeline.steps.map((step, index) => (
                <div key={step.name}>
                  <div className="font-semibold text-foreground">{`${index + 1}. ${step.name}`}</div>
                  <p className="mt-1">{step.description}</p>
                </div>
              ))}
            </CardContent>
          </Card>
          <div className="space-y-8">
            <Card>
              <CardHeader>
                <CardTitle className="text-xl">{product.integrationsCard.title}</CardTitle>
                <CardDescription>{product.integrationsCard.description}</CardDescription>
              </CardHeader>
              <CardContent className="flex flex-wrap gap-3 text-xs text-muted-foreground">
                {product.integrationsCard.items.map((integration) => (
                  <Card key={integration} className="rounded-full shadow-none">
                    <CardContent className="px-4 py-2 text-xs text-muted-foreground">
                      {integration}
                    </CardContent>
                  </Card>
                ))}
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-xl">{product.supabaseCard.title}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm text-muted-foreground">
                {product.supabaseCard.paragraphs.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
              </CardContent>
            </Card>
          </div>
        </Container>
      </section>
    </div>
  );
}
