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
import { PageHero } from "../../../components/PageHero";
import { getCurrentLanguage } from "../../../lib/language";
import { getSpeckitMessages } from "../../../i18n/messages";

export const dynamic = "force-dynamic";

function isExternalLink(href: string | undefined): boolean {
  if (!href) {
    return false;
  }
  return href.startsWith("http");
}

export async function generateMetadata(): Promise<Metadata> {
  const language = await getCurrentLanguage();
  const quickstart = (await getSpeckitMessages(language)).quickstart;
  return {
    title: quickstart.hero.title,
    description: quickstart.hero.description,
  };
}

export default async function QuickstartPage() {
  const language = await getCurrentLanguage();
  const quickstart = (await getSpeckitMessages(language)).quickstart;

  return (
    <div className="space-y-16 pb-20">
      <PageHero
        eyebrow={quickstart.hero.eyebrow}
        title={quickstart.hero.title}
        description={quickstart.hero.description}
        actions={
          <>
            {quickstart.hero.actions.primaryLabel ? (
              <Button asChild>
                <Link
                  href={quickstart.hero.actions.primaryHref ?? "https://docs.speckit.dev"}
                  target={isExternalLink(quickstart.hero.actions.primaryHref) ? "_blank" : undefined}
                  rel={isExternalLink(quickstart.hero.actions.primaryHref) ? "noreferrer" : undefined}
                >
                  {quickstart.hero.actions.primaryLabel}
                </Link>
              </Button>
            ) : null}
            {quickstart.hero.actions.secondaryLabel ? (
              <Button asChild variant="secondary">
                <Link
                  href={quickstart.hero.actions.secondaryHref ?? "/template"}
                  target={isExternalLink(quickstart.hero.actions.secondaryHref) ? "_blank" : undefined}
                  rel={isExternalLink(quickstart.hero.actions.secondaryHref) ? "noreferrer" : undefined}
                >
                  {quickstart.hero.actions.secondaryLabel}
                </Link>
              </Button>
            ) : null}
            {quickstart.hero.actions.tertiaryLabel ? (
              <Button asChild variant="ghost">
                <Link
                  href={quickstart.hero.actions.tertiaryHref ?? "https://github.com/airnub/speckit"}
                  target={isExternalLink(quickstart.hero.actions.tertiaryHref) ? "_blank" : undefined}
                  rel={isExternalLink(quickstart.hero.actions.tertiaryHref) ? "noreferrer" : undefined}
                >
                  {quickstart.hero.actions.tertiaryLabel}
                </Link>
              </Button>
            ) : null}
          </>
        }
      />

      <section>
        <Container className="space-y-10">
          <div className="space-y-3">
            {quickstart.intro.eyebrow ? (
              <p className="text-sm font-semibold uppercase tracking-wide text-primary/80">
                {quickstart.intro.eyebrow}
              </p>
            ) : null}
            <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">{quickstart.intro.title}</h2>
            <p className="text-lg text-muted-foreground">{quickstart.intro.description}</p>
          </div>

          <div className="space-y-6">
            <div className="space-y-3">
              <h3 className="text-2xl font-semibold text-foreground">{quickstart.steps.heading}</h3>
              <p className="text-muted-foreground">{quickstart.steps.description}</p>
            </div>
            <ol className="grid gap-6 lg:grid-cols-2">
              {quickstart.steps.items.map((step, index) => (
                <li key={step.title} className="list-none">
                  <Card className="h-full">
                    <CardHeader className="space-y-4">
                      <div className="flex items-center gap-3 text-xs font-semibold uppercase tracking-wide text-primary/80">
                        <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-primary/10 text-base text-primary">
                          {index + 1}
                        </span>
                        <span>{quickstart.steps.label.replace("{count}", String(index + 1))}</span>
                      </div>
                      <CardTitle className="text-2xl">{step.title}</CardTitle>
                      <CardDescription>{step.description}</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4 text-sm text-muted-foreground">
                      {step.command ? (
                        <div>
                          {step.commandLabel ? (
                            <p className="text-xs font-semibold uppercase tracking-wide text-foreground">
                              {step.commandLabel}
                            </p>
                          ) : null}
                          <pre className="mt-2 overflow-x-auto rounded-lg bg-muted px-3 py-2 font-mono text-xs text-foreground">
                            <code>{step.command}</code>
                          </pre>
                        </div>
                      ) : null}
                      {step.links && step.links.length > 0 ? (
                        <div className="flex flex-wrap gap-3">
                          {step.links.map((link) => {
                            const external = isExternalLink(link.href);
                            return (
                              <Button key={link.label} asChild variant="ghost" className="px-4 py-2 text-sm font-semibold">
                                <Link href={link.href} target={external ? "_blank" : undefined} rel={external ? "noreferrer" : undefined}>
                                  {link.label}
                                </Link>
                              </Button>
                            );
                          })}
                        </div>
                      ) : null}
                    </CardContent>
                  </Card>
                </li>
              ))}
            </ol>
          </div>
        </Container>
      </section>

      <section>
        <Container>
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">{quickstart.resources.title}</CardTitle>
              <CardDescription>{quickstart.resources.description}</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-wrap gap-3">
              {quickstart.resources.items.map((item) => {
                const external = isExternalLink(item.href);
                return (
                  <Button key={item.label} asChild variant="secondary" className="px-5 py-2 text-sm font-semibold">
                    <Link href={item.href} target={external ? "_blank" : undefined} rel={external ? "noreferrer" : undefined}>
                      {item.label}
                    </Link>
                  </Button>
                );
              })}
            </CardContent>
          </Card>
        </Container>
      </section>
    </div>
  );
}
