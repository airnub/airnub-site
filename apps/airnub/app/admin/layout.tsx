import "../globals.css";
import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  title: "Airnub admin",
  description: "Remote operations for marketing leads and runtime controls.",
};

export default function AdminRootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-slate-100">
        {children}
      </body>
    </html>
  );
}
