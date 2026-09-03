import { notFound } from "next/navigation";
import { getClientBySlug, getClientLeads } from "@/lib/dashboard";
import { ProspectsTable } from "./prospects-table";

export const dynamic = "force-dynamic";

export default async function ProspectsPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const client = await getClientBySlug(slug);
  if (!client) notFound();

  const leads = await getClientLeads(client.id);
  const campaignTags = Array.from(new Set(leads.map((l) => l.campaign.nameTag)));

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-[22px] font-bold text-ink-cream">Prospects</h1>
        <a
          href={`/api/export/${slug}/prospects`}
          className="rounded-lg border border-ink-border-strong px-4 py-2 text-sm text-ink-cream transition hover:bg-ink-card"
        >
          Export CSV
        </a>
      </div>
      <ProspectsTable leads={leads} campaignTags={campaignTags} />
    </div>
  );
}
