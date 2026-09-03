"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

export function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();

  async function handleLogout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/admin/login");
    router.refresh();
  }

  const active = pathname === "/admin" || pathname.startsWith("/admin/clients");

  return (
    <div className="flex h-screen bg-ink-bg">
      <aside className="flex w-56 flex-shrink-0 flex-col border-r border-ink-border bg-ink-sidebar">
        <div className="border-b border-ink-border px-5 pb-5 pt-6">
          <p className="text-[17px] font-extrabold tracking-tight text-ink-cream">Sonate</p>
          <p className="mt-0.5 text-[11px] font-semibold uppercase tracking-widest text-ink-muted">
            Back-office
          </p>
        </div>

        <nav className="flex flex-1 flex-col gap-0.5 p-2.5">
          <Link
            href="/admin"
            className={`flex items-center gap-2.5 rounded-lg border-l-[3px] px-3 py-2.5 text-[13px] transition ${
              active
                ? "border-ink-orange bg-ink-border-strong font-bold text-ink-cream"
                : "border-transparent font-medium text-ink-muted hover:text-ink-cream"
            }`}
          >
            <span className="text-[15px] leading-none">👥</span>
            Clients
          </Link>
        </nav>

        <div className="border-t border-ink-border p-2.5 pb-5">
          <img src="/logo/sonate-logo-beige.png" alt="Sonate" className="mb-3 h-6 w-auto px-2.5" />
          <button
            onClick={handleLogout}
            className="w-full rounded-lg px-3 py-2 text-left text-[13px] font-medium text-ink-muted transition hover:text-ink-cream"
          >
            ← Déconnexion
          </button>
        </div>
      </aside>

      <div className="flex-1 overflow-y-auto p-10">{children}</div>
    </div>
  );
}
