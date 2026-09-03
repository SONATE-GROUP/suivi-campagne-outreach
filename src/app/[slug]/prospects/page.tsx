import { notFound } from "next/navigation";
import { getClientBySlug, getClientLeads } from "@/lib/dashboard";
import { DashboardHeader } from "../header";
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
    <main className="mx-auto flex w-full max-w-5xl flex-1 flex-col gap-8 px-6 py-10">
      <DashboardHeader slug={slug} clientName={client.name} active="prospects" />
      <ProspectsTable leads={leads} campaignTags={campaignTags} />
    </main>
  );
}
