import type { Metadata } from "next";
import Link from "next/link";
import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Hero,
  Section,
} from "@airnub/ui";
import { getAdfMessages } from "../../../messages";

const DOCS_URL = process.env.NEXT_PUBLIC_DOCS_URL ?? "https://airnub.github.io/agentic-delivery-framework/";
const REPO_URL = "https://github.com/airnub/agentic-delivery-framework";

export const dynamic = "force-static";

export function generateMetadata(): Metadata {
  const messages = getAdfMessages();
  const meta = messages.quickstart.metadata;

  return {
    title: meta.title,
    description: meta.description,
  };
}

export default function QuickstartPage() {
  const messages = getAdfMessages();
  const { intro, steps, templates, ci, cta } = messages.quickstart;

  return (
    <main className="flex flex-col">
      <Hero
        eyebrow={intro.eyebrow}
        title={intro.title}
        description={intro.description}
        variant="plain"
        actions={
          <>
            <Button asChild>
              <Link href={DOCS_URL} target="_blank" rel="noreferrer">
                {cta.primary}
              </Link>
            </Button>
            <Button variant="secondary" asChild>
              <Link href={REPO_URL} target="_blank" rel="noreferrer">
                {cta.secondary}
              </Link>
            </Button>
          </>
        }
      />

      <Section>
        <div className="space-y-8">
          <h2 className="text-2xl font-semibold tracking-tight text-foreground">Day 1 timeline</h2>
          <div className="grid gap-6 md:grid-cols-2">
            {steps.map((step) => (
              <Card key={step.title} className="h-full">
                <CardHeader>
                  <CardTitle className="text-lg">{step.title}</CardTitle>
                  <CardDescription>{step.description}</CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>
      </Section>

      <Section>
        <div className="grid gap-6 md:grid-cols-3">
          {templates.items.map((item) => (
            <Card key={item.name} className="h-full">
              <CardHeader>
                <CardTitle className="text-lg">{item.name}</CardTitle>
                <CardDescription>{item.description}</CardDescription>
              </CardHeader>
            </Card>
          ))}
        </div>
      </Section>

      <Section>
        <div className="space-y-6">
          <div>
            <h2 className="text-2xl font-semibold tracking-tight text-foreground">{ci.title}</h2>
            <p className="mt-2 max-w-3xl text-base text-muted-foreground">{ci.description}</p>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            {ci.gates.map((gate) => (
              <Card key={gate.name} className="h-full">
                <CardHeader>
                  <CardTitle className="text-lg">{gate.name}</CardTitle>
                  <CardDescription>{gate.detail}</CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>
      </Section>

      <Section>
        <Card className="mx-auto max-w-4xl border-dashed border-primary/40 bg-[var(--brand-surface-subtle)]">
          <CardHeader className="gap-6 text-center">
            <div className="space-y-3">
              <p className="text-sm font-semibold uppercase tracking-wide text-primary/80">Next steps</p>
              <CardTitle className="text-2xl sm:text-3xl">{cta.title}</CardTitle>
              <CardDescription className="text-base">{cta.description}</CardDescription>
            </div>
          </CardHeader>
          <CardContent className="flex flex-wrap justify-center gap-4">
            <Button asChild>
              <Link href={DOCS_URL} target="_blank" rel="noreferrer">
                {cta.primary}
              </Link>
            </Button>
            <Button variant="secondary" asChild>
              <Link href={REPO_URL} target="_blank" rel="noreferrer">
                {cta.secondary}
              </Link>
            </Button>
          </CardContent>
        </Card>
      </Section>
    </main>
  );
}
