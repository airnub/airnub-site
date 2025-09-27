import Link from "next/link";
import { AirnubWordmark } from "@airnub/brand";
import { Footer, type FooterProps, type FooterColumn } from "./Footer";
import type { ReactNode } from "react";

const footerColumns: FooterColumn[] = [
  {
    heading: "Products",
    links: [{ label: "Speckit", href: "https://speckit.airnub.io", external: true }],
  },
  {
    heading: "Resources",
    links: [
      { label: "Docs", href: "https://docs.speckit.dev", external: true },
      { label: "Blog", href: "/resources#blog" },
      { label: "Changelog", href: "/resources#changelog" },
    ],
  },
  {
    heading: "Open Source",
    links: [
      { label: "GitHub org", href: "https://github.com/airnub", external: true },
      { label: "Speckit", href: "https://github.com/airnub/speckit", external: true },
      { label: "Infrastructure templates", href: "https://github.com/airnub/landing-zones", external: true },
    ],
  },
  {
    heading: "Trust",
    links: [
      { label: "Trust Center", href: "https://trust.airnub.io", external: true },
      { label: "VDP", href: "https://trust.airnub.io/vdp", external: true },
      { label: "security.txt", href: "https://trust.airnub.io/.well-known/security.txt", external: true },
    ],
  },
  {
    heading: "Company",
    links: [
      { label: "About", href: "/company" },
      { label: "Careers", href: "/company#careers" },
      { label: "Press", href: "/company#press" },
      { label: "Legal", href: "/company#legal" },
    ],
  },
];

type FooterAirnubProps = Omit<FooterProps, "logo" | "columns" | "bottomSlot" | "copyright"> & {
  bottomSlot?: ReactNode;
  copyrightPrefix?: string;
};

export function FooterAirnub({ bottomSlot, copyrightPrefix = "Airnub", ...props }: FooterAirnubProps) {
  const year = new Date().getFullYear();
  return (
    <Footer
      logo={<AirnubWordmark className="h-6" />}
      columns={footerColumns}
      bottomSlot={
        bottomSlot ?? (
          <div className="flex items-center gap-3">
            <Link href="/company#privacy">Privacy</Link>
            <Link href="/company#terms">Terms</Link>
            <Link href="mailto:hello@airnub.io">hello@airnub.io</Link>
          </div>
        )
      }
      copyright={`© ${year} ${copyrightPrefix}. All rights reserved.`}
      {...props}
    />
  );
}
