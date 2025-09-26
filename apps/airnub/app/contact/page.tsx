import type { Metadata } from "next";
import { Container } from "@airnub/ui";
import { PageHero } from "../../components/PageHero";
import { ContactForm, ContactShortcuts } from "../../components/ContactForm";
import { Suspense } from "react";

export const metadata: Metadata = {
  title: "Contact",
  description: "Get in touch with Airnub for product demos, partnerships, or media inquiries.",
};

export default function ContactPage() {
  return (
    <div className="space-y-16 pb-20">
      <PageHero
        eyebrow="Contact"
        title="Let’s build your trust-forward platform"
        description="Tell us about your goals and we will connect you with the right Airnub experts."
      />

      <section>
        <Container className="grid gap-12 lg:grid-cols-[2fr,1fr]">
          <div className="rounded-3xl border border-slate-200 bg-white p-10 shadow-sm">
            <h2 className="text-xl font-semibold text-slate-900">Send us a note</h2>
            <Suspense fallback={<p className="text-sm text-slate-500">Loading form…</p>}>
              <ContactForm />
            </Suspense>
          </div>
          <ContactShortcuts />
        </Container>
      </section>
    </div>
  );
}
