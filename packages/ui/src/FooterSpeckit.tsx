import Link from "next/link";
import { SpeckitWordmark } from "@airnub/brand";
import { Footer, type FooterProps, type FooterColumn } from "./Footer";

type FooterSpeckitProps = Omit<FooterProps, "logo" | "columns" | "bottomSlot" | "copyright"> & {
  columns?: FooterColumn[];
  contactHref?: string;
  contactLabel?: string;
  pricingHref?: string;
  pricingLabel?: string;
};

export function FooterSpeckit({
  columns = [],
  contactHref = "mailto:speckit@airnub.io",
  contactLabel = "speckit@airnub.io",
  pricingHref = "/pricing",
  pricingLabel = "Pricing",
  description,
  ...props
}: FooterSpeckitProps) {
  const year = new Date().getFullYear();
  return (
    <Footer
      logo={<SpeckitWordmark className="h-6" />}
      columns={columns}
      description={description}
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
