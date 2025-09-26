import type { Metadata } from "next";
import { Button, Container } from "@airnub/ui";
import { PageHero } from "../../components/PageHero";
import Link from "next/link";

export const revalidate = 3_600;

export const metadata: Metadata = {
  title: "Pricing",
  description: "Transparent pricing aligned to platform maturity stages.",
};

const tiers = [
  {
    name: "Launch",
    price: "$1,250/mo",
    description: "For teams piloting governance across 3 services.",
    highlights: ["Up to 20 engineers", "Spec + policy orchestration", "Evidence dashboard"],
  },
  {
    name: "Scale",
    price: "$3,400/mo",
    description: "For organizations rolling Speckit out across multiple product lines.",
    highlights: ["Up to 75 engineers", "Multi-project Supabase tenancy", "Customer trust portal integration"],
  },
  {
    name: "Enterprise",
    price: "Custom",
    description: "Dedicated pods for regulated workloads and complex environments.",
    highlights: ["Unlimited engineers", "Private cloud deployment options", "Compliance automation services"],
  },
];

export default function PricingPage() {
  return (
    <div className="space-y-16 pb-20">
      <PageHero
        eyebrow="Pricing"
        title="Pick the plan that matches your governance journey"
        description="All plans include the shared Supabase data core, policy orchestration engine, and evidence APIs."
        actions={<Button asChild><Link href="/contact">Talk to sales</Link></Button>}
      />

      <section>
        <Container className="grid gap-8 lg:grid-cols-3">
          {tiers.map((tier) => (
            <div key={tier.name} className="flex h-full flex-col rounded-3xl border border-white/10 bg-white/10 p-8 shadow-lg">
              <div className="flex-1">
                <h2 className="text-2xl font-semibold text-white">{tier.name}</h2>
                <p className="mt-3 text-lg font-semibold text-indigo-300">{tier.price}</p>
                <p className="mt-3 text-sm text-slate-300">{tier.description}</p>
                <ul className="mt-4 space-y-2 text-sm text-slate-200">
                  {tier.highlights.map((highlight) => (
                    <li key={highlight}>→ {highlight}</li>
                  ))}
                </ul>
              </div>
              <Button variant="ghost" asChild>
                <Link href="/contact">Request quote</Link>
              </Button>
            </div>
          ))}
        </Container>
      </section>
    </div>
  );
}
