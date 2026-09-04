import { prisma } from "@/lib/prisma";
import { fetchConversationsForCampaign, LgmConversation } from "@/lib/lgm";

export type InboxConversation = LgmConversation & {
  campaignId: string;
  campaignNameTag: string;
  leadName: string;
  companyName: string | null;
  linkedinUrl: string | null;
  hasReplied: boolean;
  hidden: boolean;
};

export async function getInboxConversations(clientId: string): Promise<InboxConversation[]> {
  const client = await prisma.client.findUniqueOrThrow({
    where: { id: clientId },
    include: { campaigns: { where: { active: true } } },
  });

  const hidden = await prisma.hiddenConversation.findMany({
    where: { clientId },
    select: { conversationId: true },
  });
  const hiddenIds = new Set(hidden.map((h) => h.conversationId));

  const results = await Promise.all(
    client.campaigns.map(async (campaign) => {
      const conversations = await fetchConversationsForCampaign(
        client.lgmApiKey,
        campaign.lgmCampaignId
      );

      const leads = await prisma.lead.findMany({
        where: {
          campaignId: campaign.id,
          lgmLeadId: { in: conversations.map((c) => c.leadId) },
        },
      });
      const leadByLgmId = new Map(leads.map((l) => [l.lgmLeadId, l]));

      return conversations.map((c) => {
        const lead = leadByLgmId.get(c.leadId);
        const name = [lead?.firstname, lead?.lastname].filter(Boolean).join(" ");
        return {
          ...c,
          campaignId: campaign.id,
          campaignNameTag: campaign.nameTag,
          leadName: name || "Prospect inconnu",
          companyName: lead?.companyName ?? null,
          linkedinUrl: lead?.linkedinUrl ?? null,
          hasReplied: lead?.replied ?? false,
          hidden: hiddenIds.has(c.id),
        };
      });
    })
  );

  return results.flat().sort((a, b) => b.lastMessageAt - a.lastMessageAt);
}

export async function getClientLgmApiKey(clientId: string): Promise<string> {
  const client = await prisma.client.findUniqueOrThrow({
    where: { id: clientId },
    select: { lgmApiKey: true },
  });
  return client.lgmApiKey;
}
