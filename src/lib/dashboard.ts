import { prisma } from "@/lib/prisma";

export async function getClientBySlug(slug: string) {
  return prisma.client.findUnique({ where: { slug } });
}

export async function getClientOverview(clientId: string, campaignId?: string) {
  const [campaigns, timeSeriesRaw] = await Promise.all([
    prisma.campaign.findMany({
      where: { clientId },
      orderBy: { createdAt: "asc" },
      include: {
        snapshots: { orderBy: { capturedAt: "desc" }, take: 1 },
      },
    }),
    prisma.campaignSnapshot.findMany({
      where: {
        campaign: { clientId, ...(campaignId ? { id: campaignId } : {}) },
      },
      orderBy: { capturedAt: "asc" },
      select: {
        capturedAt: true,
        contacted: true,
        replies: true,
        won: true,
        campaignId: true,
      },
    }),
  ]);

  const campaignsWithLatest = campaigns.map((c) => ({
    id: c.id,
    nameTag: c.nameTag,
    active: c.active,
    latest: c.snapshots[0] ?? null,
  }));

  const filteredCampaigns = campaignId
    ? campaignsWithLatest.filter((c) => c.id === campaignId)
    : campaignsWithLatest;

  const byDay = new Map<
    string,
    { date: string; contacted: number; replies: number; won: number }
  >();

  for (const row of timeSeriesRaw) {
    const day = row.capturedAt.toISOString().slice(0, 10);
    const existing = byDay.get(day) ?? { date: day, contacted: 0, replies: 0, won: 0 };
    existing.contacted += row.contacted;
    existing.replies += row.replies;
    existing.won += row.won;
    byDay.set(day, existing);
  }

  const timeSeries = Array.from(byDay.values()).sort((a, b) =>
    a.date.localeCompare(b.date)
  );

  return {
    campaigns: filteredCampaigns,
    allCampaigns: campaignsWithLatest,
    timeSeries,
  };
}

export async function getCampaignSequences(clientId: string, campaignId?: string) {
  const campaigns = await prisma.campaign.findMany({
    where: { clientId, ...(campaignId ? { id: campaignId } : {}) },
    orderBy: { createdAt: "asc" },
    select: { id: true, nameTag: true, sequenceImage: true },
  });

  return campaigns;
}

export async function getClientLeads(clientId: string, campaignId?: string) {
  return prisma.lead.findMany({
    where: { campaign: { clientId, ...(campaignId ? { id: campaignId } : {}) } },
    include: { campaign: { select: { nameTag: true } } },
    orderBy: { updatedAt: "desc" },
  });
}
