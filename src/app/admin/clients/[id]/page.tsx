import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { AddCampaignForm } from "./add-campaign-form";
import { CampaignRow } from "./campaign-row";
import { SyncButton } from "./sync-button";
import { CopyLink } from "./copy-link";

export const dynamic = "force-dynamic";

export default async function ClientAdminPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const client = await prisma.client.findUnique({
    where: { id },
    include: { campaigns: { orderBy: { createdAt: "asc" } } },
  });

  if (!client) notFound();

  return (
    <main className="mx-auto flex w-full max-w-4xl flex-1 flex-col gap-8 px-6 py-10">
      <Link href="/admin" className="text-sm text-sonate-muted hover:text-sonate-ink">
        ← Tous les clients
      </Link>

      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-sonate-green">{client.name}</h1>
          <p className="text-sm text-sonate-muted">/{client.slug}</p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <CopyLink slug={client.slug} />
          <SyncButton clientId={client.id} />
        </div>
      </div>

      <section className="flex flex-col gap-4">
        <h2 className="font-semibold text-sonate-ink">Campagnes</h2>

        <div className="flex flex-col gap-3">
          {client.campaigns.map((c) => (
            <CampaignRow
              key={c.id}
              id={c.id}
              nameTag={c.nameTag}
              lgmCampaignId={c.lgmCampaignId}
              active={c.active}
            />
          ))}

          {client.campaigns.length === 0 && (
            <p className="text-sm text-sonate-muted">Aucune campagne pour le moment.</p>
          )}
        </div>

        <AddCampaignForm clientId={client.id} />
      </section>
    </main>
  );
}
