import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@airnub/ui";
import { PageHero } from "../../components/PageHero";

export const revalidate = 604_800;

export const metadata: Metadata = {
  title: "Company",
  description: "Meet Airnub — the team helping enterprises operationalize trust across software delivery.",
};

const values = [
  {
    name: "Trust by design",
    description: "Every workflow we design must protect end-users, developers, and auditors alike.",
  },
  {
    name: "Craft with empathy",
    description: "We build for platform teams and developers because we are platform teams and developers.",
  },
  {
    name: "Evidence over opinion",
    description: "We ground decisions in measurable outcomes and transparent data.",
  },
];

export default function CompanyPage() {
  return (
    <div className="space-y-16 pb-20">
      <PageHero
        eyebrow="Company"
        title="We help platform leaders turn trust into a competitive advantage"
        description="Airnub unites platform engineering, security, and compliance to deliver governed developer experiences."
      />

      <section>
        <Container className="grid gap-8 lg:grid-cols-3">
          {values.map((value) => (
            <div key={value.name} className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
              <h2 className="text-xl font-semibold text-slate-900">{value.name}</h2>
              <p className="mt-3 text-sm text-slate-600">{value.description}</p>
            </div>
          ))}
        </Container>
      </section>

      <section id="careers">
        <Container className="rounded-3xl border border-slate-200 bg-slate-900 p-10 text-slate-100">
          <div className="grid gap-8 lg:grid-cols-2 lg:items-center">
            <div>
              <h2 className="text-3xl font-semibold tracking-tight">Careers</h2>
              <p className="mt-4 text-sm text-slate-300">
                We are a remote-first team across North America and Europe. If you are excited about developer platforms, compliance automation, and building delightful experiences, we would love to chat.
              </p>
            </div>
            <div>
              <Link
                href="mailto:careers@airnub.io"
                className="inline-flex items-center rounded-full bg-white px-5 py-2 text-sm font-semibold text-slate-900 transition hover:bg-slate-100"
              >
                careers@airnub.io
              </Link>
            </div>
          </div>
        </Container>
      </section>

      <section id="press">
        <Container className="grid gap-6 md:grid-cols-2">
          <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
            <h2 className="text-xl font-semibold text-slate-900">Press kit</h2>
            <p className="mt-3 text-sm text-slate-600">
              Logos, product screenshots, and leadership bios ready for publication.
            </p>
            <Link href="mailto:press@airnub.io" className="mt-4 inline-flex text-sm font-semibold text-sky-600">
              press@airnub.io →
            </Link>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
            <h2 className="text-xl font-semibold text-slate-900">Media inquiries</h2>
            <p className="mt-3 text-sm text-slate-600">Reach out for commentary on platform governance, DevSecOps, and compliance automation trends.</p>
            <Link href="https://cal.com/airnub/briefing" className="mt-4 inline-flex text-sm font-semibold text-sky-600" target="_blank" rel="noreferrer">
              Book a briefing →
            </Link>
          </div>
        </Container>
      </section>

      <section id="legal">
        <Container className="rounded-3xl border border-slate-200 bg-white p-10 shadow-sm">
          <h2 className="text-2xl font-semibold text-slate-900">Legal</h2>
          <div className="mt-6 grid gap-6 md:grid-cols-2">
            <div>
              <h3 className="text-lg font-semibold text-slate-900">Privacy Notice</h3>
              <p className="mt-2 text-sm text-slate-600">We collect only the information required to respond to inquiries and improve our services.</p>
              <Link href="/resources#privacy" className="mt-3 inline-flex text-sm font-semibold text-sky-600">
                Read more →
              </Link>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-slate-900">Terms of Service</h3>
              <p className="mt-2 text-sm text-slate-600">Our terms set expectations for customers, partners, and community contributors.</p>
              <Link href="/resources#terms" className="mt-3 inline-flex text-sm font-semibold text-sky-600">
                View terms →
              </Link>
            </div>
          </div>
        </Container>
      </section>
    </div>
  );
}
