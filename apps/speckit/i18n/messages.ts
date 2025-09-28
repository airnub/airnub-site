import enUS from "../messages/en-US.json";
import enGB from "../messages/en-GB.json";
import fr from "../messages/fr.json";
import es from "../messages/es.json";
import de from "../messages/de.json";
import pt from "../messages/pt.json";
import it from "../messages/it.json";
import ga from "../messages/ga.json";
import { defaultLanguage, supportedLanguages, type SupportedLanguage } from "./config";

type HeroMessages = {
  eyebrow: string;
  title: string;
  description: string;
  actions: {
    requestDemo: string;
    exploreDocs: string;
  };
};

type FeatureMessages = {
  title: string;
  description: string;
};

type WorkflowMessages = {
  title: string;
  description: string;
  items: {
    name: string;
    description: string;
  }[];
};

type GuardrailMessages = {
  cardTitle: string;
  specTitle: string;
  checklist: string[];
  evidenceTitle: string;
  evidence: {
    label: string;
    status: string;
  }[];
};

type AlignmentMessages = {
  title: string;
  description: string;
  actions: {
    howItWorks: string;
    template: string;
  };
  cards: FeatureMessages[];
};

type HomeMessages = {
  hero: HeroMessages;
  features: FeatureMessages[];
  workflows: WorkflowMessages;
  guardrails: GuardrailMessages;
  alignment: AlignmentMessages;
  integrations: {
    eyebrow: string;
    items: string[];
  };
};

type LayoutMessages = {
  skipToContent: string;
  themeToggle: string;
  starLabel: string;
  languageLabel: string;
};

export type SpeckitMessages = {
  layout: LayoutMessages;
  home: HomeMessages;
};

const registry: Record<SupportedLanguage, SpeckitMessages> = {
  "en-US": enUS,
  "en-GB": enGB,
  fr,
  es,
  de,
  pt,
  it,
  ga,
};

export function getSpeckitMessages(language: SupportedLanguage): SpeckitMessages {
  if (!supportedLanguages.includes(language)) {
    return registry[defaultLanguage];
  }
  return registry[language] ?? registry[defaultLanguage];
}
