const BASE_URL = "https://apiv2.lagrowthmachine.com/flow";

type LgmStatsResponse = {
  statusCode: number;
  engagementStats: {
    audienceSize?: number;
    completed?: number;
    replies: {
      linkedinContacted?: number;
      emailContacted?: number;
      replied?: number;
    };
    status: {
      won: { total?: number };
      lost: { total?: number };
    };
    channel: {
      linkedin: {
        contactRequest: { sent?: number; newRelations?: number };
        message: { sent?: number; replied?: number };
      };
      email: {
        sent?: number;
        received?: number;
        opened?: number;
        replied?: number;
        clicked?: number;
        bounced?: number;
      };
    };
    relations: { relations?: number; alreadyConnected?: number };
  };
};

type LgmCampaignResponse = {
  campaign: {
    name: string;
    identityFirstname?: string;
    identityLastname?: string;
  };
};

export type CampaignSnapshotData = {
  campaignName: string;
  sender: string;
  audienceSize: number;
  contacted: number;
  replies: number;
  won: number;
  lost: number;
  completed: number;
  contactedLinkedin: number;
  contactedEmail: number;
  connectionRequestsSent: number;
  relations: number;
  connectionRequestsAccepted: number;
  linkedinMessagesSent: number;
  linkedinReplies: number;
  alreadyConnected: number;
  emailsSent: number;
  emailsReceived: number;
  emailsOpened: number;
  emailReplies: number;
  emailClicks: number;
  emailBounced: number;
};

export type LgmLead = {
  id: string;
  firstname?: string;
  lastname?: string;
  companyName?: string;
  linkedinUrl?: string;
  email?: string;
  tag?: string;
  status?: string;
  linkedin_dm_sent?: number;
  email_sent?: number;
  email_opened?: number;
  replied?: number;
};

type LgmLeadsResponse = {
  leads: LgmLead[];
  hasMore: boolean;
};

async function lgmFetch(url: string) {
  const res = await fetch(url, { method: "GET", cache: "no-store" });
  return res.json();
}

export async function fetchCampaignSnapshot(
  apiKey: string,
  campaignId: string
): Promise<CampaignSnapshotData | null> {
  const statsUrl = `${BASE_URL}/campaigns/${campaignId}/stats?apikey=${apiKey}`;
  const campUrl = `${BASE_URL}/campaigns/${campaignId}?apikey=${apiKey}`;

  const [statsData, campData] = (await Promise.all([
    lgmFetch(statsUrl),
    lgmFetch(campUrl),
  ])) as [LgmStatsResponse, LgmCampaignResponse];

  if (!statsData || statsData.statusCode !== 200) return null;

  const stats = statsData.engagementStats;
  const camp = campData.campaign;

  const totalContactedCalc =
    (stats.replies.linkedinContacted || 0) + (stats.replies.emailContacted || 0);

  return {
    campaignName: camp?.name ?? "",
    sender: `${camp?.identityFirstname ?? ""} ${camp?.identityLastname ?? ""}`.trim(),
    audienceSize: stats.audienceSize || 0,
    contacted: totalContactedCalc,
    replies: stats.replies.replied || 0,
    won: stats.status.won.total || 0,
    lost: stats.status.lost.total || 0,
    completed: stats.completed || 0,
    contactedLinkedin: stats.replies.linkedinContacted || 0,
    contactedEmail: stats.replies.emailContacted || 0,
    connectionRequestsSent: stats.channel.linkedin.contactRequest.sent || 0,
    relations: stats.relations.relations || 0,
    connectionRequestsAccepted: stats.channel.linkedin.contactRequest.newRelations || 0,
    linkedinMessagesSent: stats.channel.linkedin.message.sent || 0,
    linkedinReplies: stats.channel.linkedin.message.replied || 0,
    alreadyConnected: stats.relations.alreadyConnected || 0,
    emailsSent: stats.channel.email.sent || 0,
    emailsReceived: stats.channel.email.received || 0,
    emailsOpened: stats.channel.email.opened || 0,
    emailReplies: stats.channel.email.replied || 0,
    emailClicks: stats.channel.email.clicked || 0,
    emailBounced: stats.channel.email.bounced || 0,
  };
}

export async function fetchCampaignLeads(
  apiKey: string,
  campaignId: string
): Promise<LgmLead[]> {
  let allLeads: LgmLead[] = [];
  let hasMore = true;
  let nextCursor = "";

  while (hasMore) {
    let url = `${BASE_URL}/campaigns/${campaignId}/statsleads?apikey=${apiKey}`;
    if (nextCursor) url += `&getLeadsAfter=${nextCursor}`;

    const data = (await lgmFetch(url)) as LgmLeadsResponse;

    if (data.leads && data.leads.length > 0) {
      allLeads = allLeads.concat(data.leads);
      nextCursor = data.leads[data.leads.length - 1].id;
      hasMore = data.hasMore;
    } else {
      hasMore = false;
    }
  }

  return allLeads;
}

export type LgmConversation = {
  id: string;
  leadId: string;
  identityId: string;
  lastMessageAt: number;
  lastMessageStatus: string;
  lastMessageType: string;
  status: string;
};

type LgmConversationsSearchResponse = {
  statusCode: number;
  data: LgmConversation[];
  total: number;
  hasMore: boolean;
  nextToken?: string;
};

export type LgmMessage = {
  id: string;
  channel: string;
  status: string;
  content: string;
  sender: string;
  createdAt: string;
  direction: "sent" | "received";
  attachments: unknown[];
};

type LgmMessagesResponse = {
  statusCode: number;
  data: LgmMessage[];
  total: number;
};

// Read-only: this app only ever displays LGM conversations, it never sends,
// archives, snoozes or edits them. Do not add calls to the write endpoints
// (POST /inbox/linkedin, /inbox/email, /inbox/conversations/*).
export async function fetchConversationsForCampaign(
  apiKey: string,
  campaignId: string,
  limit = 100
): Promise<LgmConversation[]> {
  let all: LgmConversation[] = [];
  let searchAfter = "";
  let hasMore = true;

  while (hasMore) {
    let url =
      `${BASE_URL}/conversations/search?campaignIds=${campaignId}` +
      `&limit=${limit}&sortField=lastMessageAt&sortDirection=-1&apikey=${apiKey}`;
    if (searchAfter) url += `&searchAfter=${searchAfter}`;

    const data = (await lgmFetch(url)) as LgmConversationsSearchResponse;
    if (!data || data.statusCode !== 200 || !data.data) break;

    all = all.concat(data.data);
    hasMore = !!data.hasMore && !!data.nextToken;
    searchAfter = data.nextToken ?? "";

    if (all.length >= 500) break; // safety cap
  }

  return all;
}

export async function fetchConversationMessages(
  apiKey: string,
  conversationId: string
): Promise<LgmMessage[]> {
  const url = `${BASE_URL}/conversations/${conversationId}/messages?apikey=${apiKey}`;
  const data = (await lgmFetch(url)) as LgmMessagesResponse;
  if (!data || data.statusCode !== 200 || !data.data) return [];
  return data.data;
}

export type LgmSequenceStep = {
  id: string;
  type: string;
  channel: string;
  order: number;
  active: boolean;
};

type LgmCampaignMessagesResponse = {
  statusCode: number;
  data: LgmSequenceStep[];
  total: number;
};

// The steps that make up a campaign's scenario (Add relation, Send Message,
// Wait, etc.), in order. LGM does not expose per-step lead counts via the
// public API, so this only reflects the scenario's shape, not live volumes.
export async function fetchCampaignSequence(
  apiKey: string,
  campaignId: string
): Promise<LgmSequenceStep[]> {
  const url = `${BASE_URL}/campaigns/${campaignId}/messages?apikey=${apiKey}`;
  const data = (await lgmFetch(url)) as LgmCampaignMessagesResponse;
  if (!data || data.statusCode !== 200 || !data.data) return [];
  return [...data.data].sort((a, b) => a.order - b.order);
}
