export type NavigationLinkMessage = {
  id: string;
  label: string;
  href?: string;
  external?: boolean;
  description?: string;
};

export type AdfMessages = typeof adfMessages;

const REPO_URL = "https://github.com/airnub/agentic-delivery-framework";
const TRUST_CENTER_URL = "https://trust.airnub.io";
const TEMPLATES_URL =
  "https://github.com/airnub/agentic-delivery-framework/tree/main/templates";
const CI_URL =
  "https://github.com/airnub/agentic-delivery-framework/tree/main/ci";

const adfMessages = {
  layout: {
    skipToContent: "Skip to main content",
    githubLabel: "View the Agentic Delivery Framework repository on GitHub",
    themeToggle: "Toggle theme",
    nav: {
      items: [
        { id: "docs", label: "Docs", external: true },
        { id: "quickstart", label: "Quickstart", href: "/quickstart" },
        { id: "trust", label: "Trust Center", href: TRUST_CENTER_URL, external: true },
      ] satisfies NavigationLinkMessage[],
    },
    footer: {
      description:
        "ADF gives delivery, security, and compliance teams a shared blueprint for supervising agent-assisted releases.",
      columns: [
        {
          heading: "Get started",
          links: [
            { id: "docs", label: "Documentation", external: true },
            { id: "quickstart", label: "One-day L1 quickstart", href: "/quickstart" },
          ],
        },
        {
          heading: "Templates",
          links: [
            {
              id: "templates",
              label: "Workflow templates",
              href: TEMPLATES_URL,
              external: true,
            },
            {
              id: "ci",
              label: "CI gates",
              href: CI_URL,
              external: true,
            },
          ],
        },
        {
          heading: "Trust & community",
          links: [
            {
              id: "github",
              label: "GitHub repository",
              href: REPO_URL,
              external: true,
            },
            {
              id: "trust",
              label: "Airnub Trust Center",
              href: TRUST_CENTER_URL,
              external: true,
            },
          ],
        },
      ] satisfies { heading: string; links: NavigationLinkMessage[] }[],
      bottomLinks: [
        { id: "github", label: "GitHub", href: REPO_URL, external: true },
        { id: "trust", label: "Trust Center", href: TRUST_CENTER_URL, external: true },
        { id: "docs", label: "Docs", external: true },
      ] satisfies NavigationLinkMessage[],
    },
  },
  home: {
    hero: {
      eyebrow: "Open, supervised agent delivery",
      title: "Agentic Delivery Framework spec",
      description:
        "The ADF spec gives Critical Review (CR) leads a single playbook for orchestrating supervised releases. Align policy, reviews, and agent controls across teams while keeping audit trails, evidence capture, and recovery paths built-in from the start.",
      actions: {
        docs: "Read the spec (docs)",
        quickstart: "Quickstart",
        github: "GitHub repo",
      },
    },
    highlights: [
      {
        title: "CR-first governance",
        description:
          "Critical Review leads own staffing, escalation paths, and policy updates so human accountability anchors every agent workflow.",
      },
      {
        title: "Sequential Subtask Pipeline",
        description:
          "Break delivery into ordered CR checkpoints with required evidence before agents or automations advance to the next stage.",
      },
      {
        title: "Daily Pulse",
        description:
          "Run a standing ritual that surfaces blocked work, approval load, and risk signals so CRs can rebalance quickly.",
      },
      {
        title: "Evidence Bundles",
        description:
          "Bundle prompts, model outputs, reviewer notes, and test results into immutable packets ready for audits or postmortems.",
      },
      {
        title: "CR gates",
        description:
          "Codify human hold points inside CI/CD so releases only proceed once the assigned CR signs off on policy and risk checks.",
      },
    ],
  },
  quickstart: {
    metadata: {
      title: "L1 (Supervised) quickstart",
      description:
        "Stand up the Agentic Delivery Framework L1 path in a single day with templates, review rituals, and CI guardrails.",
    },
    intro: {
      eyebrow: "Day 0 to day 1",
      title: "One-day L1 quickstart",
      description:
        "Run this playbook to pilot ADF with a supervised, human-in-the-loop workflow. Each checkpoint is mapped to evidence templates and CI gates so your team can go live with confidence.",
    },
    steps: [
      {
        title: "08:30 — Kickoff & scope",
        description:
          "Agree on the agent use-case, define success metrics, and assign the supervising engineer and reviewer roles.",
      },
      {
        title: "10:00 — Policy & guardrails",
        description:
          "Customize the L1 policy template: approval matrix, model boundaries, rollback criteria, and security sign-offs.",
      },
      {
        title: "12:00 — Workflow instrumentation",
        description:
          "Connect the CLI or SDK, enable prompt capture, and wire automated tests into the baseline GitHub Actions pipeline.",
      },
      {
        title: "14:00 — Dry run & evidence capture",
        description:
          "Walk through the workflow end-to-end, recording prompts, outputs, and reviewer notes in the run log template.",
      },
      {
        title: "16:00 — CI gate rehearsal",
        description:
          "Trigger the supervised release job, resolve any failing checks, and practice the human approval hold point.",
      },
      {
        title: "17:30 — Go/no-go & retrospectives",
        description:
          "Review the collected evidence, log follow-ups, and confirm criteria for expanding beyond the pilot cohort.",
      },
    ],
    templates: {
      title: "Templates included in the repo",
      items: [
        {
          name: "L1 policy baseline",
          description:
            "Editable doc covering scope, allowed models, redline scenarios, and approval routing.",
        },
        {
          name: "Run log & evidence pack",
          description:
            "Notion/Markdown template capturing prompts, outputs, and reviewer attestations for every run.",
        },
        {
          name: "Operational playbook",
          description:
            "Checklist for on-call supervisors covering escalation paths, rollback triggers, and stakeholder comms.",
        },
      ],
    },
    ci: {
      title: "CI gate summary",
      description:
        "ADF ships with GitHub Actions checks you can drop into existing pipelines. Each gate maps to a control owner and required evidence.",
      gates: [
        {
          name: "Policy lint",
          detail:
            "Validates the L1 policy file is signed off and in force for the branch.",
        },
        {
          name: "Prompt & output capture",
          detail:
            "Ensures artifacts from supervised runs are attached before merge.",
        },
        {
          name: "Human approval hold",
          detail:
            "Requires supervising engineer and reviewer approvals prior to release jobs.",
        },
      ],
    },
    cta: {
      title: "Ready to operationalize agents?",
      description:
        "Follow the quickstart, then extend with L2 autonomous workflows once your supervising metrics stay green.",
      primary: "Explore the docs",
      secondary: "Clone the GitHub repo",
    },
  },
} as const satisfies Record<string, unknown>;

export function getAdfMessages(): AdfMessages {
  return adfMessages;
}
