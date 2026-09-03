import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { LogoutButton } from "./logout-button";
import { AddClientForm } from "./add-client-form";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const clients = await prisma.client.findMany({
    include: { campaigns: { select: { id: true } } },
    orderBy: { createdAt: "desc" },
  });

  return (
    <main className="mx-auto flex w-full max-w-4xl flex-1 flex-col gap-8 px-6 py-10">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <img src="/logo/sonate-carre-01.png" alt="Sonate" className="h-9 w-9" />
          <h1 className="text-xl font-bold text-sonate-green">Administration</h1>
        </div>
        <LogoutButton />
      </div>

      <section className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <h2 className="font-semibold text-sonate-ink">Clients</h2>
        </div>

        <div className="flex flex-col gap-3">
          {clients.map((client) => (
            <Link
              key={client.id}
              href={`/admin/clients/${client.id}`}
              className="flex items-center justify-between rounded-xl border border-sonate-cream bg-white px-5 py-4 transition hover:border-sonate-green-border hover:shadow-sonate"
            >
              <div>
                <p className="font-semibold text-sonate-ink">{client.name}</p>
                <p className="text-sm text-sonate-muted">
                  /{client.slug} · {client.campaigns.length} campagne
                  {client.campaigns.length > 1 ? "s" : ""}
                </p>
              </div>
              <span className="text-sonate-orange-dark">→</span>
            </Link>
          ))}

          {clients.length === 0 && (
            <p className="text-sm text-sonate-muted">Aucun client pour le moment.</p>
          )}
        </div>

        <AddClientForm />
      </section>
    </main>
  );
}
