import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { Button, Container } from "@airnub/ui";
import { PageHero } from "../components/PageHero";

export const revalidate = 86_400;

export const metadata: Metadata = {
  title: "Airnub builds governed, enterprise-ready developer platforms",
};

const highlights = [
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
];

const customers = [
  { name: "Forge Labs", logo: "/logos/forge.svg" },
  { name: "Cloudyard", logo: "/logos/cloudyard.svg" },
  { name: "Northbeam", logo: "/logos/northbeam.svg" },
];

export default function HomePage() {
  return (
    <div className="space-y-24 pb-20">
      <PageHero
        eyebrow="Airnub builds governed, enterprise-ready developer platforms."
        title="Operationalize trust across every release pipeline"
        description="We help platform and security teams replace spreadsheets with codified guardrails, evidence automation, and developer-native workflows."
        actions={
          <>
            <Button asChild>
              <Link href="/contact">Talk to our team</Link>
            </Button>
            <Button variant="ghost" asChild>
              <Link href="/products">Explore products</Link>
            </Button>
          </>
        }
      />

      <section>
        <Container className="grid gap-10 lg:grid-cols-3">
          {highlights.map((item) => (
            <div key={item.title} className="rounded-2xl bg-white p-8 shadow-sm ring-1 ring-slate-200">
              <h3 className="text-xl font-semibold text-slate-900">{item.title}</h3>
              <p className="mt-3 text-sm text-slate-600">{item.description}</p>
            </div>
          ))}
        </Container>
      </section>

      <section>
        <Container className="text-center">
          <p className="text-sm font-semibold uppercase tracking-wide text-slate-500">Trusted by platform leaders</p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-8">
            {customers.map((customer) => (
              <div key={customer.name} className="flex h-16 w-40 items-center justify-center rounded-xl border border-slate-200 bg-white">
                <Image src={customer.logo} alt={customer.name} width={120} height={40} className="object-contain" />
              </div>
            ))}
          </div>
        </Container>
      </section>

      <section className="bg-slate-900 py-20 text-slate-100">
        <Container className="grid gap-12 lg:grid-cols-2 lg:items-center">
          <div>
            <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">Secure the spec loop with Speckit</h2>
            <p className="mt-4 text-base text-slate-300">
              Speckit brings change management, supply-chain controls, and runtime attestations together. Govern policy gates
              with programmable workflows and surface the right signals to auditors and stakeholders instantly.
            </p>
            <div className="mt-6 flex flex-wrap gap-4">
              <Button asChild>
                <Link href="https://speckit.airnub.io" target="_blank" rel="noreferrer">
                  Visit Speckit
                </Link>
              </Button>
              <Button variant="ghost" asChild>
                <Link href="/products">See product lineup</Link>
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
          <div>
            <h2 className="text-3xl font-semibold text-slate-900">Services aligned to your platform journey</h2>
            <p className="mt-4 text-base text-slate-600">
              From first landing zones to regulated scale, our services team embeds with platform, security, and compliance leaders to deliver quick wins and long-term maturity.
            </p>
            <ul className="mt-6 space-y-3 text-sm text-slate-600">
              <li><strong className="font-semibold text-slate-900">Assessment:</strong> map current controls to regulatory expectations.</li>
              <li><strong className="font-semibold text-slate-900">Blueprint:</strong> reference architectures with guardrails for teams and services.</li>
              <li><strong className="font-semibold text-slate-900">Adoption:</strong> playbooks to scale platform operations with confidence.</li>
            </ul>
          </div>
          <div className="grid gap-6 md:grid-cols-2">
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-slate-900">Platform operating model</h3>
              <p className="mt-2 text-sm text-slate-600">Team structures, KPIs, and governance rituals to align craft and compliance.</p>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-slate-900">Regulated cloud acceleration</h3>
              <p className="mt-2 text-sm text-slate-600">Deploy secure baselines for FedRAMP, SOC 2, and ISO 27001 without slowing delivery.</p>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-slate-900">InnerSource enablement</h3>
              <p className="mt-2 text-sm text-slate-600">Empower product teams with paved roads, golden paths, and clear guardrails.</p>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-slate-900">Trust & assurance readiness</h3>
              <p className="mt-2 text-sm text-slate-600">Prepare evidence for auditors, partners, and leadership with zero scramble.</p>
            </div>
          </div>
        </Container>
      </section>
    </div>
  );
}
