import type { Metadata } from "next";
import Link from "next/link";
import { Button, Card, CardDescription, CardHeader, CardTitle, Hero, Section } from "@airnub/ui";
import { getAdfMessages } from "../../messages";

const DOCS_URL = process.env.NEXT_PUBLIC_DOCS_URL ?? "https://airnub.github.io/agentic-delivery-framework/";
const REPO_URL = "https://github.com/airnub/agentic-delivery-framework";

export const dynamic = "force-static";

export async function generateMetadata(): Promise<Metadata> {
  const messages = await getAdfMessages();
  const hero = messages.home.hero;

  return {
    title: hero.title,
    description: hero.description,
  };
}

export default async function MarketingHome() {
  const messages = await getAdfMessages();
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
              <Link href="/quickstart">{hero.actions.quickstart}</Link>
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
