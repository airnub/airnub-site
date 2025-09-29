import type { Metadata } from "next";
import { Card, Container } from "@airnub/ui";
import { PageHero } from "../../../components/PageHero";
import { getCurrentLanguage } from "../../../lib/language";
import { getSpeckitMessages } from "../../../i18n/messages";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const language = await getCurrentLanguage();
  const messages = getSpeckitMessages(language).solutionsDevSecOps;
  return {
    title: messages.hero.title,
    description: messages.hero.description,
  };
}

export default async function DevSecOpsSolutionsPage() {
  const language = await getCurrentLanguage();
  const messages = getSpeckitMessages(language).solutionsDevSecOps;

  return (
    <div className="space-y-16 pb-20">
      <PageHero
        eyebrow={messages.hero.eyebrow}
        title={messages.hero.title}
        description={messages.hero.description}
      />

      <section>
        <Container>
          <Card className="bg-card/10 p-10">
            <h2 className="text-2xl font-semibold text-foreground">{messages.benefitsTitle}</h2>
            <ul className="mt-6 space-y-3 text-sm text-muted-foreground">
              {messages.benefits.map((benefit) => (
                <li key={benefit}>→ {benefit}</li>
              ))}
            </ul>
          </Card>
        </Container>
      </section>

      <section>
        <Container>
          <Card className="bg-gradient-to-br from-muted via-background to-muted p-10">
            <h2 className="text-2xl font-semibold text-foreground">{messages.capabilities.title}</h2>
            <div className="mt-6 grid gap-6 text-sm text-muted-foreground md:grid-cols-2">
              {messages.capabilities.cards.map((card) => (
                <Card key={card.title} className="bg-card/5 shadow-none">
                  <h3 className="text-lg font-semibold text-foreground">{card.title}</h3>
                  <p className="mt-2">{card.description}</p>
                </Card>
              ))}
            </div>
          </Card>
        </Container>
      </section>
    </div>
  );
}
