import { notFound } from "next/navigation";
import { getClientBySlug, getClientOverview, getCampaignSequences } from "@/lib/dashboard";
import { StatCard } from "./stat-card";
import { ChannelStatsCard } from "./channel-stats-card";
import { TrendChart } from "./trend-chart";
import { CampaignChart } from "./campaign-chart";
import { SyncButton } from "./sync-button";
import { CampaignFilter } from "./campaign-filter";
import { SequenceFlow } from "./sequence-flow";

export const dynamic = "force-dynamic";

export default async function ClientDashboardPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ campaign?: string }>;
}) {
  const { slug } = await params;
  const { campaign: campaignId } = await searchParams;
  const client = await getClientBySlug(slug);
  if (!client) notFound();

  const { campaigns, allCampaigns, timeSeries } = await getClientOverview(
    client.id,
    campaignId
  );
  const exportSuffix = campaignId ? `?campaign=${campaignId}` : "";
  const sequences = await getCampaignSequences(client.id, campaignId);

  const totals = campaigns.reduce(
    (acc, c) => {
      const s = c.latest;
      if (!s) return acc;
      acc.audienceSize += s.audienceSize;
      acc.contacted += s.contacted;
      acc.replies += s.replies;
      acc.won += s.won;
      acc.lost += s.lost;
      acc.contactedLinkedin += s.contactedLinkedin;
      acc.alreadyConnected += s.alreadyConnected;
      acc.connectionRequestsSent += s.connectionRequestsSent;
      acc.connectionRequestsAccepted += s.connectionRequestsAccepted;
      acc.linkedinMessagesSent += s.linkedinMessagesSent;
      acc.linkedinReplies += s.linkedinReplies;
      acc.emailsSent += s.emailsSent;
      acc.emailsReceived += s.emailsReceived;
      acc.emailBounced += s.emailBounced;
      acc.emailsOpened += s.emailsOpened;
      acc.emailReplies += s.emailReplies;
      acc.emailClicks += s.emailClicks;
      return acc;
    },
    {
      audienceSize: 0,
      contacted: 0,
      replies: 0,
      won: 0,
      lost: 0,
      contactedLinkedin: 0,
      alreadyConnected: 0,
      connectionRequestsSent: 0,
      connectionRequestsAccepted: 0,
      linkedinMessagesSent: 0,
      linkedinReplies: 0,
      emailsSent: 0,
      emailsReceived: 0,
      emailBounced: 0,
      emailsOpened: 0,
      emailReplies: 0,
      emailClicks: 0,
    }
  );

  const ratio = (n: number, d: number) => (d > 0 ? Math.round((n / d) * 100) : 0);

  const chartData = campaigns
    .filter((c) => c.latest)
    .map((c) => ({
      nameTag: c.nameTag,
      contacted: c.latest!.contacted,
      replies: c.latest!.replies,
      won: c.latest!.won,
    }));

  const lastSync = campaigns
    .map((c) => c.latest?.capturedAt)
    .filter((d): d is Date => !!d)
    .sort((a, b) => b.getTime() - a.getTime())[0];

  return (
    <div className="mx-auto flex w-full max-w-5xl flex-col gap-7">
      <div>
        <h1 className="text-[22px] font-bold text-ink-cream">Vue d&apos;ensemble</h1>
        {lastSync && (
          <p className="mt-1 text-[13px] text-ink-muted">
            Dernière synchronisation :{" "}
            {lastSync.toLocaleString("fr-FR", {
              dateStyle: "long",
              timeStyle: "short",
              timeZone: "Europe/Paris",
            })}
          </p>
        )}
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <CampaignFilter slug={slug} campaigns={allCampaigns} />
        <SyncButton slug={slug} />
        <a
          href={`/api/export/${slug}/stats${exportSuffix}`}
          className="rounded-lg border border-ink-border-strong px-4 py-2 text-sm text-ink-cream transition hover:bg-ink-card"
        >
          Export CSV
        </a>
      </div>

      <section className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
        <StatCard label="Audience totale" value={totals.audienceSize} />
        <StatCard label="Contactés" value={totals.contacted} />
        <StatCard label="Réponses" value={totals.replies} />
        <StatCard label="Gagnés" value={totals.won} accent />
        <StatCard label="Perdus" value={totals.lost} />
      </section>

      <section className="grid gap-4 sm:grid-cols-2">
        <ChannelStatsCard
          title="LinkedIn"
          icon="💼"
          iconBg="#0A66C2"
          won={totals.won}
          rows={[
            {
              type: "bar",
              label: "Demandes de connexion",
              value: totals.connectionRequestsSent,
              pct: ratio(totals.connectionRequestsSent, totals.audienceSize),
            },
            {
              type: "bar",
              label: "Déjà en contact",
              value: totals.alreadyConnected,
              pct: ratio(totals.alreadyConnected, totals.audienceSize),
            },
            {
              type: "bar",
              label: "Nouvelles connexions",
              value: totals.connectionRequestsAccepted,
              pct: ratio(totals.connectionRequestsAccepted, totals.connectionRequestsSent),
            },
            {
              type: "bar",
              label: "Contactés",
              value: totals.contactedLinkedin,
              pct: ratio(totals.contactedLinkedin, totals.audienceSize),
            },
            {
              type: "bar",
              label: "Réponses",
              value: totals.linkedinReplies,
              pct: ratio(totals.linkedinReplies, totals.contactedLinkedin),
            },
          ]}
        />
        <ChannelStatsCard
          title="Email"
          icon="✉️"
          iconBg="#EA4335"
          won={totals.won}
          rows={[
            {
              type: "bar",
              label: "Emails envoyés",
              value: totals.emailsSent,
              pct: ratio(totals.emailsSent, totals.audienceSize),
            },
            {
              type: "badges",
              badges: [
                {
                  label: "Délivrés",
                  value: totals.emailsReceived,
                  pct: ratio(totals.emailsReceived, totals.emailsSent),
                  color: "#4caf7d",
                },
                {
                  label: "Rejetés",
                  value: totals.emailBounced,
                  pct: ratio(totals.emailBounced, totals.emailsSent),
                  color: "#e8571a",
                },
              ],
            },
            {
              type: "bar",
              label: "Ouverts",
              value: totals.emailsOpened,
              pct: ratio(totals.emailsOpened, totals.emailsSent),
            },
            {
              type: "bar",
              label: "Cliqués",
              value: totals.emailClicks,
              pct: ratio(totals.emailClicks, totals.emailsSent),
            },
            {
              type: "bar",
              label: "Réponses",
              value: totals.emailReplies,
              pct: ratio(totals.emailReplies, totals.emailsSent),
            },
          ]}
        />
      </section>

      <section className="flex flex-col gap-3">
        <h2 className="text-[13px] font-bold uppercase tracking-wide text-ink-muted-2">
          Évolution
        </h2>
        <TrendChart data={timeSeries} />
      </section>

      <section className="flex flex-col gap-5">
        <h2 className="text-[13px] font-bold uppercase tracking-wide text-ink-muted-2">
          Séquence
        </h2>
        {sequences.map((seq) => (
          <div key={seq.id} className="flex flex-col gap-2">
            {sequences.length > 1 && (
              <p className="text-sm font-semibold text-ink-cream">{seq.nameTag}</p>
            )}
            <SequenceFlow steps={seq.steps} />
          </div>
        ))}
      </section>

      <section className="flex flex-col gap-3">
        <h2 className="text-[13px] font-bold uppercase tracking-wide text-ink-muted-2">
          Par campagne
        </h2>
        <CampaignChart data={chartData} />

        <div className="flex flex-col gap-2">
          <div className="grid grid-cols-[1fr_90px_90px_90px_90px_90px] gap-3 px-4 py-1.5 text-[11px] font-bold uppercase tracking-wide text-ink-muted-2">
            <span>Campagne</span>
            <span>Audience</span>
            <span>Contactés</span>
            <span>Réponses</span>
            <span>Gagnés</span>
            <span>Statut</span>
          </div>
          {campaigns.map((c) => (
            <div
              key={c.id}
              className="grid grid-cols-[1fr_90px_90px_90px_90px_90px] items-center gap-3 rounded-lg bg-ink-card px-4 py-3 text-sm"
            >
              <span className="font-semibold text-ink-cream">{c.nameTag}</span>
              <span className="text-ink-muted">{c.latest?.audienceSize ?? "-"}</span>
              <span className="text-ink-muted">{c.latest?.contacted ?? "-"}</span>
              <span className="text-ink-muted">{c.latest?.replies ?? "-"}</span>
              <span className="font-semibold text-ink-orange">{c.latest?.won ?? "-"}</span>
              <span>
                <span
                  className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                    c.active
                      ? "border border-ink-positive/40 text-ink-positive"
                      : "border border-ink-border-strong text-ink-muted"
                  }`}
                >
                  {c.active ? "Active" : "En pause"}
                </span>
              </span>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
