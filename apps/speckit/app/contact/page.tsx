import type { Metadata } from "next";
import { Container } from "@airnub/ui";
import { PageHero } from "../../components/PageHero";
import { SpeckitContactForm, SpeckitContactShortcuts } from "../../components/ContactForm";
import { Suspense } from "react";

export const metadata: Metadata = {
  title: "Contact",
  description: "Request a Speckit demo or talk to our product specialists.",
};

export default function ContactPage() {
  return (
    <div className="space-y-16 pb-20">
      <PageHero
        eyebrow="Contact"
        title="See Speckit in action"
        description="Share a bit about your platform program and we will tailor a walkthrough to your goals."
      />

      <section>
        <Container className="grid gap-12 lg:grid-cols-[2fr,1fr]">
          <div className="rounded-3xl border border-white/10 bg-white/10 p-10 shadow-xl">
            <h2 className="text-xl font-semibold text-white">Request a demo</h2>
            <Suspense fallback={<p className="text-sm text-slate-300">Loading form…</p>}>
              <SpeckitContactForm />
            </Suspense>
          </div>
          <SpeckitContactShortcuts />
        </Container>
      </section>
    </div>
  );
}
