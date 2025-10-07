import speckitBrand from "../../brand.config";

export const metadata = { title: "Privacy" };

export default function PrivacyPage() {
  const contactEmail =
    speckitBrand.contact.security ??
    speckitBrand.contact.support ??
    speckitBrand.contact.general ??
    "hello@airnub.io";

  return (
    <article className="prose mx-auto p-8">
      <h1>Privacy</h1>
      <p>
        We collect only the data required to operate Speckit. Analytics are disabled by default and are
        only enabled when explicitly configured in the deployment environment. We never sell or share
        personal data.
      </p>
      <h2>Contact</h2>
      <p>
        Questions? Email <a href={`mailto:${contactEmail}`}>{contactEmail}</a>.
      </p>
    </article>
  );
}
