import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Suivi Campagnes Outreach | Sonate",
  description: "Tableau de bord des campagnes LaGrowthMachine",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="fr" className="h-full antialiased">
      <body className="min-h-full flex flex-col bg-sonate-ivory text-sonate-ink">
        {children}
      </body>
    </html>
  );
}
