import Link from "next/link";
import { SpeckitWordmark } from "@airnub/brand";
import { Footer, type FooterProps, type FooterColumn } from "./Footer";

const defaultFooterColumns: FooterColumn[] = [
  {
    heading: "Product",
    links: [
      { label: "Overview", href: "/" },
      { label: "How it works", href: "/how-it-works" },
      { label: "Integrations", href: "/product#integrations" },
    ],
  },
  {
    heading: "Resources",
    links: [
      { label: "Docs", href: "https://docs.speckit.dev", external: true },
      { label: "API reference", href: "https://docs.speckit.dev/api", external: true },
      { label: "Community", href: "https://github.com/airnub/speckit/discussions", external: true },
    ],
  },
  {
    heading: "Open Source",
    links: [
      { label: "Repo", href: "https://github.com/airnub/speckit", external: true },
      { label: "Templates", href: "https://github.com/airnub/speckit-templates", external: true },
      { label: "Issues", href: "https://github.com/airnub/speckit/issues", external: true },
      { label: "License", href: "https://github.com/airnub/speckit/blob/main/LICENSE", external: true },
    ],
  },
  {
    heading: "Trust",
    links: [
      { label: "Trust Center", href: "https://trust.airnub.io", external: true },
      { label: "Status", href: "https://status.airnub.io", external: true },
      { label: "security.txt", href: "https://trust.airnub.io/.well-known/security.txt", external: true },
    ],
  },
];

type FooterSpeckitProps = Omit<FooterProps, "logo" | "columns" | "bottomSlot" | "copyright"> & {
  columns?: FooterColumn[];
  contactHref?: string;
  contactLabel?: string;
  pricingHref?: string;
  pricingLabel?: string;
};

export function FooterSpeckit({
  columns = defaultFooterColumns,
  contactHref = "mailto:speckit@airnub.io",
  contactLabel = "speckit@airnub.io",
  pricingHref = "/pricing",
  pricingLabel = "Pricing",
  ...props
}: FooterSpeckitProps) {
  const year = new Date().getFullYear();
  return (
    <Footer
      logo={<SpeckitWordmark className="h-6" />}
      columns={columns}
      bottomSlot={
        <div className="flex items-center gap-3 text-slate-500 dark:text-slate-400">
          <Link href={contactHref}>{contactLabel}</Link>
          <span aria-hidden="true">•</span>
          <Link href={pricingHref}>{pricingLabel}</Link>
        </div>
      }
      copyright={`© ${year} Airnub. All rights reserved.`}
      {...props}
    />
  );
}
