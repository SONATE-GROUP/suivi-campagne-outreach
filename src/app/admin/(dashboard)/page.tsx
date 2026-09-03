import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { AddClientForm } from "./add-client-form";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const clients = await prisma.client.findMany({
    include: { campaigns: { select: { id: true } } },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="mx-auto flex w-full max-w-4xl flex-col gap-7">
      <h1 className="text-[22px] font-bold text-ink-cream">Clients</h1>

      <div className="flex flex-col gap-2.5">
        {clients.map((client) => (
          <Link
            key={client.id}
            href={`/admin/clients/${client.id}`}
            className="flex items-center justify-between rounded-xl border border-ink-border bg-ink-card px-5 py-4 transition hover:border-ink-border-strong"
          >
            <div>
              <p className="font-semibold text-ink-cream">{client.name}</p>
              <p className="text-sm text-ink-muted">
                /{client.slug} · {client.campaigns.length} campagne
                {client.campaigns.length > 1 ? "s" : ""}
              </p>
            </div>
            <span className="text-ink-orange">→</span>
          </Link>
        ))}

        {clients.length === 0 && (
          <p className="text-sm text-ink-muted">Aucun client pour le moment.</p>
        )}
      </div>

      <AddClientForm />
    </div>
  );
}
