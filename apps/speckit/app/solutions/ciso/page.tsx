import type { Metadata } from "next";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, Container } from "@airnub/ui";
import { PageHero } from "../../../components/PageHero";
import { getCurrentLanguage } from "../../../lib/language";
import { getSpeckitMessages } from "../../../i18n/messages";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const language = await getCurrentLanguage();
  const messages = (await getSpeckitMessages(language)).solutionsCiso;
  return {
    title: messages.hero.title,
    description: messages.hero.description,
  };
}

export default async function CisoSolutionsPage() {
  const language = await getCurrentLanguage();
  const messages = (await getSpeckitMessages(language)).solutionsCiso;

  return (
    <div className="space-y-16 pb-20">
      <PageHero
        eyebrow={messages.hero.eyebrow}
        title={messages.hero.title}
        description={messages.hero.description}
      />

      <section>
        <Container>
          <Card className="bg-card/10">
            <CardHeader>
              <CardTitle className="text-2xl">{messages.outcomesTitle}</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              <ul className="space-y-3">
                {messages.outcomes.map((outcome) => (
                  <li key={outcome}>→ {outcome}</li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </Container>
      </section>

      <section>
        <Container>
          <Card className="bg-gradient-to-br from-muted via-background to-muted">
            <CardHeader>
              <CardTitle className="text-2xl">{messages.deliverables.title}</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-6 text-sm text-muted-foreground md:grid-cols-2">
              {messages.deliverables.cards.map((card) => (
                <Card key={card.title} className="bg-card/5 shadow-none">
                  <CardHeader>
                    <CardTitle className="text-lg">{card.title}</CardTitle>
                    <CardDescription className="text-sm text-muted-foreground">
                      {card.description}
                    </CardDescription>
                  </CardHeader>
                </Card>
              ))}
            </CardContent>
          </Card>
        </Container>
      </section>
    </div>
  );
}
