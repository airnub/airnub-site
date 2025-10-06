import type { Metadata } from "next";
import Link from "next/link";
import { Button, Card, CardDescription, CardHeader, CardTitle, Container } from "@airnub/ui";
import { PageHero } from "../../components/PageHero";
import { getCurrentLanguage } from "../../lib/language";
import { getSpeckitMessages } from "../../i18n/messages";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const language = await getCurrentLanguage();
  const template = (await getSpeckitMessages(language)).template;
  return {
    title: template.hero.title,
    description: template.hero.description,
  };
}

export default async function TemplatePage() {
  const language = await getCurrentLanguage();
  const template = (await getSpeckitMessages(language)).template;

  return (
    <div className="space-y-16 pb-20">
      <PageHero
        eyebrow={template.hero.eyebrow}
        title={template.hero.title}
        description={template.hero.description}
        actions={
          template.hero.actions.primaryLabel ? (
            <Button asChild>
              <Link
                href={template.hero.actions.primaryHref ?? "https://github.com/airnub/speckit-templates"}
                target={template.hero.actions.primaryHref?.startsWith("http") ? "_blank" : undefined}
                rel={template.hero.actions.primaryHref?.startsWith("http") ? "noreferrer" : undefined}
              >
                {template.hero.actions.primaryLabel}
              </Link>
            </Button>
          ) : null
        }
      />

      <section>
        <Container className="grid gap-6 md:grid-cols-2">
          {template.steps.map((step) => (
            <Card key={step.title}>
              <CardHeader>
                <CardTitle className="text-xl">{step.title}</CardTitle>
                <CardDescription>{step.description}</CardDescription>
              </CardHeader>
            </Card>
          ))}
        </Container>
      </section>
    </div>
  );
}
