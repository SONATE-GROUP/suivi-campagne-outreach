import { prisma } from "@/lib/prisma";
import { fetchCampaignSnapshot, fetchCampaignLeads, fetchCampaignSequence } from "@/lib/lgm";

export async function syncCampaign(campaignId: string) {
  const campaign = await prisma.campaign.findUniqueOrThrow({
    where: { id: campaignId },
    include: { client: true },
  });

  const snapshot = await fetchCampaignSnapshot(
    campaign.client.lgmApiKey,
    campaign.lgmCampaignId
  );

  if (snapshot) {
    await prisma.campaignSnapshot.create({
      data: { campaignId: campaign.id, ...snapshot },
    });
  }

  const leads = await fetchCampaignLeads(
    campaign.client.lgmApiKey,
    campaign.lgmCampaignId
  );

  for (const lead of leads) {
    const messagesSent = (lead.linkedin_dm_sent || 0) + (lead.email_sent || 0);
    const replied = (lead.replied || 0) > 0;

    await prisma.lead.upsert({
      where: {
        campaignId_lgmLeadId: { campaignId: campaign.id, lgmLeadId: lead.id },
      },
      create: {
        campaignId: campaign.id,
        lgmLeadId: lead.id,
        firstname: lead.firstname || "",
        lastname: lead.lastname || "",
        companyName: lead.companyName || "N/A",
        linkedinUrl: lead.linkedinUrl || "",
        email: lead.email || "",
        status: lead.tag || lead.status || "",
        messagesSent,
        messagesOpened: lead.email_opened || 0,
        replied,
      },
      update: {
        firstname: lead.firstname || "",
        lastname: lead.lastname || "",
        companyName: lead.companyName || "N/A",
        linkedinUrl: lead.linkedinUrl || "",
        email: lead.email || "",
        status: lead.tag || lead.status || "",
        messagesSent,
        messagesOpened: lead.email_opened || 0,
        replied,
      },
    });
  }

  const sequence = await fetchCampaignSequence(
    campaign.client.lgmApiKey,
    campaign.lgmCampaignId
  );

  if (sequence.length > 0) {
    await prisma.$transaction([
      prisma.campaignSequenceStep.deleteMany({ where: { campaignId: campaign.id } }),
      prisma.campaignSequenceStep.createMany({
        data: sequence.map((step) => ({
          campaignId: campaign.id,
          lgmMessageId: step.id,
          type: step.type,
          channel: step.channel,
          order: step.order,
          active: step.active,
          content: step.contentHtml || null,
          subject: step.subjectHtml || null,
        })),
      }),
    ]);
  }

  return { snapshotSaved: !!snapshot, leadsSynced: leads.length };
}

export async function syncClient(clientId: string) {
  const campaigns = await prisma.campaign.findMany({
    where: { clientId, active: true },
  });

  const results = [];
  for (const campaign of campaigns) {
    try {
      const result = await syncCampaign(campaign.id);
      results.push({ campaignId: campaign.id, ...result });
    } catch (e) {
      results.push({ campaignId: campaign.id, error: (e as Error).message });
    }
  }
  return results;
}

export async function syncAllClients() {
  const clients = await prisma.client.findMany({ select: { id: true } });
  const results = [];
  for (const client of clients) {
    results.push({ clientId: client.id, campaigns: await syncClient(client.id) });
  }
  return results;
}
