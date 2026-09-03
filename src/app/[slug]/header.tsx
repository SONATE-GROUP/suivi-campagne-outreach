import Link from "next/link";
import { LogoutButton } from "./logout-button";

export function DashboardHeader({
  slug,
  clientName,
  active,
}: {
  slug: string;
  clientName: string;
  active: "overview" | "prospects";
}) {
  return (
    <header className="flex flex-wrap items-center justify-between gap-4 border-b border-sonate-cream pb-6">
      <div className="flex items-center gap-3">
        <img src="/logo/sonate-carre-01.png" alt="Sonate" className="h-14 w-14" />
        <div>
          <p className="text-xs uppercase tracking-wide text-sonate-orange-dark">
            Suivi outreach
          </p>
          <h1 className="text-xl font-bold text-sonate-green">{clientName}</h1>
        </div>
      </div>

      <nav className="flex items-center gap-6">
        <Link
          href={`/${slug}`}
          className={`text-sm font-medium ${
            active === "overview"
              ? "text-sonate-green"
              : "text-sonate-muted hover:text-sonate-ink"
          }`}
        >
          Vue d&apos;ensemble
        </Link>
        <Link
          href={`/${slug}/prospects`}
          className={`text-sm font-medium ${
            active === "prospects"
              ? "text-sonate-green"
              : "text-sonate-muted hover:text-sonate-ink"
          }`}
        >
          Prospects
        </Link>
        <LogoutButton />
      </nav>
    </header>
  );
}
