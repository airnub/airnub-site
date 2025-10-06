import type { Metadata } from "next";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, Container } from "@airnub/ui";
import { PageHero } from "../../components/PageHero";
import { getCurrentLanguage } from "../../lib/language";
import { getSpeckitMessages } from "../../i18n/messages";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const language = await getCurrentLanguage();
  const messages = (await getSpeckitMessages(language)).howItWorks;
  return {
    title: messages.hero.title,
    description: messages.hero.description,
  };
}

export default async function HowItWorksPage() {
  const language = await getCurrentLanguage();
  const messages = (await getSpeckitMessages(language)).howItWorks;

  return (
    <div className="space-y-16 pb-20">
      <PageHero
        eyebrow={messages.hero.eyebrow}
        title={messages.hero.title}
        description={messages.hero.description}
      />

      <section>
        <Container className="grid gap-8 lg:grid-cols-3">
          {messages.stages.map((stage, index) => (
            <Card key={stage.name}>
              <CardHeader className="gap-3">
                <span className="text-xs font-semibold uppercase tracking-wide text-primary/80">
                  {messages.stageLabel.replace(/\{[^}]+\}/g, String(index + 1))}
                </span>
                <CardTitle className="text-xl">{stage.name}</CardTitle>
                <CardDescription>{stage.description}</CardDescription>
              </CardHeader>
            </Card>
          ))}
        </Container>
      </section>

      <section>
        <Container>
          <Card>
            <CardContent className="grid gap-8 pt-5 lg:grid-cols-3">
              {messages.audiences.map((audience) => (
                <Card key={audience.role} className="bg-muted shadow-none">
                  <CardHeader>
                    <CardTitle className="text-lg">{audience.role}</CardTitle>
                    <CardDescription>{audience.value}</CardDescription>
                  </CardHeader>
                </Card>
              ))}
            </CardContent>
          </Card>
        </Container>
      </section>

      <section>
        <Container>
          <Card className="bg-gradient-to-br from-muted via-background to-muted">
            <CardHeader className="gap-4">
              <CardTitle className="text-3xl text-foreground">{messages.tooling.title}</CardTitle>
              <CardDescription className="text-sm text-muted-foreground">
                {messages.tooling.description}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="grid gap-4 text-sm text-muted-foreground md:grid-cols-2">
                {messages.tooling.items.map((item) => (
                  <li key={item}>→ {item}</li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </Container>
      </section>
    </div>
  );
}
