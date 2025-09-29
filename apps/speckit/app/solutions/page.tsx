import type { Metadata } from "next";
import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, Container } from "@airnub/ui";
import { PageHero } from "../../components/PageHero";
import { getCurrentLanguage } from "../../lib/language";
import { getSpeckitMessages } from "../../i18n/messages";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const language = await getCurrentLanguage();
  const solutions = getSpeckitMessages(language).solutions;
  return {
    title: solutions.hero.title,
    description: solutions.hero.description,
  };
}

export default async function SolutionsOverviewPage() {
  const language = await getCurrentLanguage();
  const solutions = getSpeckitMessages(language).solutions;

  return (
    <div className="space-y-16 pb-20">
      <PageHero
        eyebrow={solutions.hero.eyebrow}
        title={solutions.hero.title}
        description={solutions.hero.description}
      />

      <section>
        <Container className="grid gap-8 lg:grid-cols-2">
          {solutions.personas.map((persona) => (
            <Link key={persona.title} href={persona.href} className="group block text-left">
              <Card className="h-full transition hover:border-ring">
                <CardHeader className="p-6">
                  <CardTitle className="text-2xl">{persona.title}</CardTitle>
                  <CardDescription>{persona.description}</CardDescription>
                </CardHeader>
                <CardContent className="p-6 pt-0">
                  <span className="inline-flex text-sm font-semibold text-indigo-600 transition group-hover:text-indigo-700 dark:text-indigo-300 dark:group-hover:text-indigo-200">
                    {persona.ctaLabel}
                  </span>
                </CardContent>
              </Card>
            </Link>
          ))}
        </Container>
      </section>
    </div>
  );
}
