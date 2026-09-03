import { prisma } from "@/lib/prisma";

export async function getClientBySlug(slug: string) {
  return prisma.client.findUnique({ where: { slug } });
}

export async function getClientOverview(clientId: string) {
  const campaigns = await prisma.campaign.findMany({
    where: { clientId },
    orderBy: { createdAt: "asc" },
    include: {
      snapshots: { orderBy: { capturedAt: "desc" }, take: 1 },
    },
  });

  const campaignsWithLatest = campaigns.map((c) => ({
    id: c.id,
    nameTag: c.nameTag,
    active: c.active,
    latest: c.snapshots[0] ?? null,
  }));

  const timeSeriesRaw = await prisma.campaignSnapshot.findMany({
    where: { campaign: { clientId } },
    orderBy: { capturedAt: "asc" },
    select: {
      capturedAt: true,
      contacted: true,
      replies: true,
      won: true,
      campaignId: true,
    },
  });

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

  return { campaigns: campaignsWithLatest, timeSeries };
}

export async function getClientLeads(clientId: string) {
  return prisma.lead.findMany({
    where: { campaign: { clientId } },
    include: { campaign: { select: { nameTag: true } } },
    orderBy: { updatedAt: "desc" },
  });
}
