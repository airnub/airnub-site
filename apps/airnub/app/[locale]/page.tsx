import type { Metadata } from "next";
import Image from "next/image";
import { Button, Container } from "@airnub/ui";
import { serverFetch } from "@airnub/seo";
import { PageHero } from "../../components/PageHero";
import { LocaleLink } from "../../components/LocaleLink";
import Link from "next/link";

export const revalidate = 86_400;

export const metadata: Metadata = {
  title: "Airnub builds governed, enterprise-ready developer platforms",
};

const airnubHomeContent = {
  highlights: [
    {
      title: "Unified governance",
      description: "Automate policy checks across SDLC gates with contextual guardrails for every team.",
    },
    {
      title: "Evidence on demand",
      description: "Capture SBOMs, attestations, and traceability artifacts as part of your delivery workflow.",
    },
    {
      title: "Platform accelerators",
      description: "Blueprints for platform teams to onboard products faster without sacrificing trust or velocity.",
    },
  ],
  customers: [
    { name: "Forge Labs", logo: "/logos/forge.svg" },
    { name: "Cloudyard", logo: "/logos/cloudyard.svg" },
    { name: "Northbeam", logo: "/logos/northbeam.svg" },
  ],
} as const;

const airnubHomeContentUrl = `data:application/json,${encodeURIComponent(JSON.stringify(airnubHomeContent))}`;

type AirnubHomeContent = typeof airnubHomeContent;

export default async function HomePage() {
  const { highlights, customers } = await serverFetch<AirnubHomeContent>(airnubHomeContentUrl, {
    revalidate,
  });

  return (
    <div className="space-y-24 pb-24 text-slate-300">
      <PageHero
        eyebrow="Airnub builds governed, enterprise-ready developer platforms."
        title="Operationalize trust across every release pipeline"
        description="We help platform and security teams replace spreadsheets with codified guardrails, evidence automation, and developer-native workflows."
        actions={
          <>
            <Button asChild>
              <LocaleLink href="/contact">Talk to our team</LocaleLink>
            </Button>
            <Button variant="ghost" asChild>
              <LocaleLink href="/products">Explore products</LocaleLink>
            </Button>
          </>
        }
      />

      <section>
        <Container className="grid gap-10 lg:grid-cols-3">
          {highlights.map((item) => (
            <div
              key={item.title}
              className="rounded-3xl border border-slate-800 bg-slate-900/60 p-8 shadow-lg shadow-slate-950/40 backdrop-blur"
            >
              <h3 className="text-xl font-semibold text-white">{item.title}</h3>
              <p className="mt-3 text-sm text-slate-300">{item.description}</p>
            </div>
          ))}
        </Container>
      </section>

      <section>
        <Container className="text-center">
          <p className="text-sm font-semibold uppercase tracking-wide text-slate-400">Trusted by platform leaders</p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-8">
            {customers.map((customer) => (
              <div
                key={customer.name}
                className="flex h-16 w-40 items-center justify-center rounded-xl border border-slate-800 bg-slate-900/70 shadow-inner shadow-slate-950/40"
              >
                <Image src={customer.logo} alt={customer.name} width={120} height={40} className="object-contain" />
              </div>
            ))}
          </div>
        </Container>
      </section>

      <section>
        <Container className="grid gap-12 rounded-3xl border border-slate-800 bg-slate-900/80 p-12 shadow-xl shadow-slate-950/40 lg:grid-cols-2 lg:items-center">
          <div>
            <h2 className="text-3xl font-semibold tracking-tight text-white sm:text-4xl">Secure the spec loop with Speckit</h2>
            <p className="mt-4 text-base text-slate-300">
              Speckit brings change management, supply-chain controls, and runtime attestations together. Govern policy gates with programmable workflows and surface the right signals to auditors and stakeholders instantly.
            </p>
            <div className="mt-6 flex flex-wrap gap-4">
              <Button asChild>
                <Link href="https://speckit.airnub.io" target="_blank" rel="noreferrer">
                  Visit Speckit
                </Link>
              </Button>
              <Button variant="ghost" asChild>
                <LocaleLink href="/products">See product lineup</LocaleLink>
              </Button>
            </div>
          </div>
          <div className="rounded-3xl border border-white/10 bg-white/5 p-8">
            <h3 className="text-lg font-semibold text-white">Outcomes</h3>
            <ul className="mt-4 space-y-3 text-sm text-slate-200">
              <li className="flex gap-3">
                <span className="mt-1 inline-flex h-2.5 w-2.5 rounded-full bg-sky-400" aria-hidden="true" />
                Governed spec loop keeps architecture, security, and compliance in sync.
              </li>
              <li className="flex gap-3">
                <span className="mt-1 inline-flex h-2.5 w-2.5 rounded-full bg-violet-400" aria-hidden="true" />
                Policy gates codify approvals across CI/CD, cloud, and service catalogs.
              </li>
              <li className="flex gap-3">
                <span className="mt-1 inline-flex h-2.5 w-2.5 rounded-full bg-emerald-400" aria-hidden="true" />
                Evidence captured automatically: SBOMs, attestations, and traceability.
              </li>
            </ul>
          </div>
        </Container>
      </section>

      <section>
        <Container className="grid gap-12 lg:grid-cols-[2fr,3fr] lg:items-center">
          <div className="space-y-6">
            <div>
              <h2 className="text-3xl font-semibold text-white">Services aligned to your platform journey</h2>
              <p className="mt-4 text-base text-slate-300">
                From first landing zones to regulated scale, our services team embeds with platform, security, and compliance leaders to deliver quick wins and long-term maturity.
              </p>
            </div>
            <ul className="space-y-3 text-sm text-slate-300">
              <li>
                <strong className="font-semibold text-white">Assessment:</strong> map current controls to regulatory expectations.
              </li>
              <li>
                <strong className="font-semibold text-white">Blueprint:</strong> reference architectures with guardrails for teams and services.
              </li>
              <li>
                <strong className="font-semibold text-white">Adoption:</strong> playbooks to scale platform operations with confidence.
              </li>
            </ul>
          </div>
          <div className="grid gap-6 md:grid-cols-2">
            <div className="rounded-3xl border border-slate-800 bg-slate-900/60 p-6 shadow-lg shadow-slate-950/40">
              <h3 className="text-lg font-semibold text-white">Platform operating model</h3>
              <p className="mt-2 text-sm text-slate-300">Team structures, KPIs, and governance rituals to align craft and compliance.</p>
            </div>
            <div className="rounded-3xl border border-slate-800 bg-slate-900/60 p-6 shadow-lg shadow-slate-950/40">
              <h3 className="text-lg font-semibold text-white">Regulated cloud acceleration</h3>
              <p className="mt-2 text-sm text-slate-300">Deploy secure baselines for FedRAMP, SOC 2, and ISO 27001 without slowing delivery.</p>
            </div>
            <div className="rounded-3xl border border-slate-800 bg-slate-900/60 p-6 shadow-lg shadow-slate-950/40">
              <h3 className="text-lg font-semibold text-white">InnerSource enablement</h3>
              <p className="mt-2 text-sm text-slate-300">Empower product teams with paved roads, golden paths, and clear guardrails.</p>
            </div>
            <div className="rounded-3xl border border-slate-800 bg-slate-900/60 p-6 shadow-lg shadow-slate-950/40">
              <h3 className="text-lg font-semibold text-white">Trust & assurance readiness</h3>
              <p className="mt-2 text-sm text-slate-300">Prepare evidence for auditors, partners, and leadership with zero scramble.</p>
            </div>
          </div>
        </Container>
      </section>
    </div>
  );
}
