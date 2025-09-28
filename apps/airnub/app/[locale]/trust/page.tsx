import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@airnub/ui";
import { LocaleLink } from "../../../components/LocaleLink";
import { PageHero } from "../../../components/PageHero";

export const revalidate = 86_400;

export const metadata: Metadata = {
  title: "Trust",
  description: "Explore Airnub's approach to security, privacy, and responsible disclosure.",
};

const trustHighlights = [
  {
    title: "Trust Center",
    description: "Review certifications, policies, and live status updates for Airnub and Speckit services.",
    href: "https://trust.airnub.io",
  },
  {
    title: "Vulnerability Disclosure",
    description: "Coordinated security response with a 24-hour acknowledgement commitment and PGP details.",
    href: "https://trust.airnub.io/vdp",
  },
  {
    title: "security.txt",
    description: "Find our canonical security contact, encryption keys, and preferred disclosure channels.",
    href: "https://trust.airnub.io/.well-known/security.txt",
  },
];

export default function TrustPage() {
  return (
    <div className="space-y-16 pb-24 text-slate-300">
      <PageHero
        eyebrow="Trust"
        title="Transparency and assurance for every release"
        description="Our security, privacy, and reliability posture is documented in a single destination so your teams can evaluate Airnub quickly."
      />

      <section>
        <Container className="grid gap-8 lg:grid-cols-3">
          {trustHighlights.map((item) => (
            <Link
              key={item.title}
              href={item.href}
              className="rounded-3xl border border-slate-800 bg-slate-900/60 p-8 text-left shadow-lg shadow-slate-950/40 transition hover:border-sky-500/40"
              target="_blank"
              rel="noreferrer"
            >
              <h2 className="text-xl font-semibold text-white">{item.title}</h2>
              <p className="mt-3 text-sm text-slate-300">{item.description}</p>
              <span className="mt-4 inline-flex text-sm font-semibold text-sky-400">Visit resource →</span>
            </Link>
          ))}
        </Container>
      </section>

      <section>
        <Container className="rounded-3xl border border-slate-800 bg-slate-900/70 p-10 shadow-lg shadow-slate-950/40">
          <div className="grid gap-8 lg:grid-cols-2 lg:items-center">
            <div>
              <h2 className="text-2xl font-semibold text-white">Need something specific?</h2>
              <p className="mt-3 text-sm text-slate-300">
                Our team can provide tailored security questionnaires, architecture diagrams, and penetration testing summaries under NDA.
              </p>
            </div>
            <div>
              <LocaleLink
                href="/contact"
                className="inline-flex items-center rounded-full bg-sky-600 px-5 py-2 text-sm font-semibold text-white transition hover:bg-sky-500"
              >
                Request documents
              </LocaleLink>
            </div>
          </div>
        </Container>
      </section>
    </div>
  );
}
