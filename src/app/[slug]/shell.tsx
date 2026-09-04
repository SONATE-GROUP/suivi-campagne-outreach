"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

export function DashboardShell({
  slug,
  clientName,
  children,
}: {
  slug: string;
  clientName: string;
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();

  const navItems = [
    { href: `/${slug}`, label: "Vue d'ensemble", icon: "📊" },
    { href: `/${slug}/prospects`, label: "Prospects", icon: "👥" },
    { href: `/${slug}/inbox`, label: "Inbox", icon: "💬" },
  ];

  async function handleLogout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/");
    router.refresh();
  }

  return (
    <div className="flex h-screen flex-col bg-ink-bg">
      <header className="flex flex-shrink-0 items-center justify-between border-b border-ink-sidebar-beige-border bg-ink-sidebar-beige px-7 py-4">
        <img src="/logo/sonate-logo-vert.png" alt="Sonate" className="h-11 w-auto" />
        <div className="text-right">
          <p className="text-[11px] font-extrabold uppercase tracking-widest text-ink-orange">
            Suivi des campagnes
          </p>
          <p className="mt-0.5 text-base font-bold text-ink-sidebar-beige-text">{clientName}</p>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        <aside className="flex w-56 flex-shrink-0 flex-col border-r border-ink-sidebar-beige-border bg-ink-sidebar-beige">
          <nav className="flex flex-1 flex-col gap-0.5 p-2.5 pt-4">
            {navItems.map(({ href, label, icon }) => {
              const active = pathname === href;
              return (
                <Link
                  key={href}
                  href={href}
                  className={`flex items-center gap-2.5 rounded-lg border-l-[3px] px-3 py-2.5 text-[13px] transition ${
                    active
                      ? "border-ink-orange bg-ink-sidebar-beige-active font-bold text-ink-sidebar-beige-text"
                      : "border-transparent font-medium text-ink-sidebar-beige-muted hover:text-ink-sidebar-beige-text"
                  }`}
                >
                  <span className="text-[15px] leading-none">{icon}</span>
                  {label}
                </Link>
              );
            })}
          </nav>

          <div className="border-t border-ink-sidebar-beige-border p-2.5 pb-5">
            <button
              onClick={handleLogout}
              className="w-full rounded-lg px-3 py-2 text-left text-[13px] font-medium text-ink-sidebar-beige-muted transition hover:text-ink-sidebar-beige-text"
            >
              ← Déconnexion
            </button>
          </div>
        </aside>

        <div className="flex-1 overflow-y-auto p-10">{children}</div>
      </div>
    </div>
  );
}
