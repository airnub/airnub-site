import type { Metadata } from "next";
import Link from "next/link";
import { getMessages, getTranslations } from "next-intl/server";
import { Button, Card, CardDescription, CardHeader, CardTitle, Hero, Section } from "@airnub/ui";
import { assertLocale, locales } from "../../i18n/routing";
import type { AdfMessages } from "@adf/messages/types";

const DOCS_URL = process.env.NEXT_PUBLIC_DOCS_URL ?? "https://airnub.github.io/agentic-delivery-framework/";
const REPO_URL = "https://github.com/airnub/agentic-delivery-framework";

export const dynamic = "force-static";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale: localeParam } = await params;
  const locale = assertLocale(localeParam);
  const hero = await getTranslations({ locale, namespace: "home.hero" });

  return {
    title: hero("title"),
    description: hero("description"),
    alternates: {
      canonical: `/${locale}`,
      languages: Object.fromEntries(locales.map((code) => [code, `/${code}`])),
    },
  };
}

export default async function MarketingHome({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: localeParam } = await params;
  const locale = assertLocale(localeParam);
  const withLocale = (path: string) => {
    const normalized = path.startsWith("/") ? path : `/${path}`;
    return `/${locale}${normalized}`;
  };
  const messages = (await getMessages({ locale })) as unknown as AdfMessages;
  const hero = messages.home.hero;
  const highlights = messages.home.highlights;

  return (
    <main className="flex flex-col">
      <Hero
        eyebrow={hero.eyebrow}
        title={hero.title}
        description={hero.description}
        variant="gradient"
        actions={
          <>
            <Button asChild>
              <Link href={DOCS_URL} target="_blank" rel="noreferrer">
                {hero.actions.docs}
              </Link>
            </Button>
            <Button variant="secondary" asChild>
              <Link href={withLocale("/quickstart")}>
                {hero.actions.quickstart}
              </Link>
            </Button>
            <Button variant="ghost" asChild>
              <Link href={REPO_URL} target="_blank" rel="noreferrer">
                {hero.actions.github}
              </Link>
            </Button>
          </>
        }
      />

      <Section stack={false}>
        <div className="grid gap-6 md:grid-cols-3">
          {highlights.map((item) => (
            <Card key={item.title} className="h-full">
              <CardHeader>
                <CardTitle className="text-xl">{item.title}</CardTitle>
                <CardDescription>{item.description}</CardDescription>
              </CardHeader>
            </Card>
          ))}
        </div>
      </Section>
    </main>
  );
}
