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
};

type DualActionHeroMessages = HeroMessages & {
  actions: {
    primaryLabel: string;
    primaryHref?: string;
    secondaryLabel?: string;
    secondaryHref?: string;
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
    primaryLabel: string;
    primaryHref: string;
    secondaryLabel: string;
    secondaryHref: string;
  };
  cards: FeatureMessages[];
};

type HomeMessages = {
  hero: DualActionHeroMessages;
  features: FeatureMessages[];
  workflows: WorkflowMessages;
  guardrails: GuardrailMessages;
  alignment: AlignmentMessages;
  integrations: {
    eyebrow: string;
    items: string[];
  };
};

type PricingMessages = {
  hero: DualActionHeroMessages;
  tiers: {
    name: string;
    price: string;
    description: string;
    highlights: string[];
    ctaLabel: string;
  }[];
};

type ProductMessages = {
  hero: DualActionHeroMessages;
  pillars: FeatureMessages[];
  timeline: {
    title: string;
    steps: {
      name: string;
      description: string;
    }[];
  };
  integrationsCard: {
    title: string;
    description: string;
    items: string[];
  };
  supabaseCard: {
    title: string;
    paragraphs: string[];
  };
};

type HowItWorksMessages = {
  hero: HeroMessages;
  stages: {
    name: string;
    description: string;
  }[];
  stageLabel: string;
  audiences: {
    role: string;
    value: string;
  }[];
  tooling: {
    title: string;
    description: string;
    items: string[];
  };
};

type TemplateMessages = {
  hero: DualActionHeroMessages;
  steps: FeatureMessages[];
};

type ContactMessages = {
  hero: HeroMessages;
  form: {
    title: string;
    description: string;
    submitLabel: string;
    fields: {
      nameLabel: string;
      emailLabel: string;
      emailRequiredSuffix: string;
      companyLabel: string;
      focusLabel: string;
    };
  };
  shortcuts: {
    emailHeading: string;
    productQuestions: string;
    security: string;
    docsHeading: string;
    docsDescription: string;
    docsCtaLabel: string;
  };
};

type SolutionsOverviewMessages = {
  hero: HeroMessages;
  personas: {
    title: string;
    description: string;
    href: string;
    ctaLabel: string;
  }[];
};

type CisoSolutionsMessages = {
  hero: HeroMessages;
  outcomes: string[];
  outcomesTitle: string;
  deliverables: {
    title: string;
    cards: FeatureMessages[];
  };
};

type DevSecOpsSolutionsMessages = {
  hero: HeroMessages;
  benefits: string[];
  benefitsTitle: string;
  capabilities: {
    title: string;
    cards: FeatureMessages[];
  };
};

type LayoutMessages = {
  skipToContent: string;
  themeToggle: string;
  languageLabel: string;
  githubLabel: string;
  locale: {
    options: Record<SupportedLanguage, string>;
  };
  metadata: {
    titleDefault: string;
    titleTemplate: string;
    description: string;
    siteName: string;
    ogDescription: string;
    ogImageAlt: string;
    openGraphLocale: string;
    twitterDescription: string;
  };
  nav: {
    product: string;
    howItWorks: string;
    solutions: string;
    docs: string;
    pricing: string;
    trust: string;
    contact: string;
  };
  footer: {
    description: string;
    columns: {
      product: {
        heading: string;
        overview: string;
        howItWorks: string;
        integrations: string;
      };
      resources: {
        heading: string;
        docs: string;
        apiReference: string;
        community: string;
      };
      openSource: {
        heading: string;
        repo: string;
        templates: string;
        issues: string;
        license: string;
      };
      trust: {
        heading: string;
        trustCenter: string;
        status: string;
        securityTxt: string;
      };
    };
    contact: {
      label: string;
      pricing: string;
    };
  };
};

export type SpeckitMessages = {
  layout: LayoutMessages;
  home: HomeMessages;
  pricing: PricingMessages;
  product: ProductMessages;
  howItWorks: HowItWorksMessages;
  template: TemplateMessages;
  contact: ContactMessages;
  solutions: SolutionsOverviewMessages;
  solutionsCiso: CisoSolutionsMessages;
  solutionsDevSecOps: DevSecOpsSolutionsMessages;
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
