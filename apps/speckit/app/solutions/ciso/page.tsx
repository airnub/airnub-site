import type { Metadata } from "next";
import { Container } from "@airnub/ui";
import { PageHero } from "../../../components/PageHero";
import { getCurrentLanguage } from "../../../lib/language";
import { getSpeckitMessages } from "../../../i18n/messages";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const language = await getCurrentLanguage();
  const messages = getSpeckitMessages(language).solutionsCiso;
  return {
    title: messages.hero.title,
    description: messages.hero.description,
  };
}

export default async function CisoSolutionsPage() {
  const language = await getCurrentLanguage();
  const messages = getSpeckitMessages(language).solutionsCiso;

  return (
    <div className="space-y-16 pb-20">
      <PageHero
        eyebrow={messages.hero.eyebrow}
        title={messages.hero.title}
        description={messages.hero.description}
      />

      <section>
        <Container className="rounded-3xl border border-white/10 bg-white/10 p-10 shadow-xl">
          <h2 className="text-2xl font-semibold text-white">{messages.outcomesTitle}</h2>
          <ul className="mt-6 space-y-3 text-sm text-slate-300">
            {messages.outcomes.map((outcome) => (
              <li key={outcome}>→ {outcome}</li>
            ))}
          </ul>
        </Container>
      </section>

      <section>
        <Container className="rounded-3xl border border-white/10 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 p-10 shadow-xl">
          <h2 className="text-2xl font-semibold text-white">{messages.deliverables.title}</h2>
          <div className="mt-6 grid gap-6 md:grid-cols-2 text-sm text-slate-300">
            {messages.deliverables.cards.map((card) => (
              <div key={card.title} className="rounded-2xl border border-white/10 bg-white/5 p-6">
                <h3 className="text-lg font-semibold text-white">{card.title}</h3>
                <p className="mt-2">{card.description}</p>
              </div>
            ))}
          </div>
        </Container>
      </section>
    </div>
  );
}
