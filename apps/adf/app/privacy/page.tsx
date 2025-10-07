import adfBrand from "../../brand.config";

export const metadata = { title: "Privacy" };

export default function PrivacyPage() {
  const contactEmail =
    adfBrand.contact.security ?? adfBrand.contact.support ?? adfBrand.contact.general ?? "hello@airnub.io";

  return (
    <main className="prose mx-auto p-8">
      <h1>Privacy</h1>
      <p>
        The Agentic Delivery Framework site only stores information needed to provide documentation and community
        resources. Analytics tooling is disabled unless explicitly configured at deploy time. We never sell or share
        personal data.
      </p>
      <h2>Contact</h2>
      <p>
        Questions? Email <a href={`mailto:${contactEmail}`}>{contactEmail}</a>.
      </p>
    </main>
  );
}
