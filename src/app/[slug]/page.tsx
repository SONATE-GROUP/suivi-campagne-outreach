import { notFound } from "next/navigation";
import { getClientBySlug, getClientOverview } from "@/lib/dashboard";
import { DashboardHeader } from "./header";
import { StatCard, RateBar } from "./stat-card";
import { TrendChart } from "./trend-chart";
import { CampaignChart } from "./campaign-chart";
import { SyncButton } from "./sync-button";

export const dynamic = "force-dynamic";

export default async function ClientDashboardPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const client = await getClientBySlug(slug);
  if (!client) notFound();

  const { campaigns, timeSeries } = await getClientOverview(client.id);

  const totals = campaigns.reduce(
    (acc, c) => {
      const s = c.latest;
      if (!s) return acc;
      acc.audienceSize += s.audienceSize;
      acc.contacted += s.contacted;
      acc.replies += s.replies;
      acc.won += s.won;
      acc.lost += s.lost;
      acc.connectionRequestsSent += s.connectionRequestsSent;
      acc.connectionRequestsAccepted += s.connectionRequestsAccepted;
      acc.linkedinMessagesSent += s.linkedinMessagesSent;
      acc.linkedinReplies += s.linkedinReplies;
      acc.emailsSent += s.emailsSent;
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
      connectionRequestsSent: 0,
      connectionRequestsAccepted: 0,
      linkedinMessagesSent: 0,
      linkedinReplies: 0,
      emailsSent: 0,
      emailsOpened: 0,
      emailReplies: 0,
      emailClicks: 0,
    }
  );

  const ratio = (n: number, d: number) => (d > 0 ? n / d : 0);

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
    <main className="mx-auto flex w-full max-w-5xl flex-1 flex-col gap-8 px-6 py-10">
      <DashboardHeader slug={slug} clientName={client.name} active="overview" />

      <div className="-mb-4 flex flex-wrap items-center justify-between gap-2">
        {lastSync ? (
          <p className="text-xs text-sonate-muted">
            Dernière synchronisation :{" "}
            {lastSync.toLocaleString("fr-FR", { dateStyle: "long", timeStyle: "short" })}
          </p>
        ) : (
          <span />
        )}
        <div className="flex flex-wrap items-center gap-3">
          <SyncButton slug={slug} />
          <a
            href={`/api/export/${slug}/stats`}
            className="rounded-lg border border-sonate-cream bg-white px-4 py-2 text-sm text-sonate-ink transition hover:border-sonate-green-border"
          >
            Export CSV
          </a>
        </div>
      </div>

      <section className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
        <StatCard label="Audience totale" value={totals.audienceSize} />
        <StatCard label="Contactés" value={totals.contacted} />
        <StatCard label="Réponses" value={totals.replies} />
        <StatCard label="Gagnés" value={totals.won} accent />
        <StatCard label="Perdus" value={totals.lost} />
      </section>

      <section className="grid gap-4 sm:grid-cols-2">
        <div className="flex flex-col gap-4 rounded-2xl border border-sonate-cream bg-white p-5">
          <RateBar
            label="Taux d'acceptation LinkedIn"
            value={ratio(totals.connectionRequestsAccepted, totals.connectionRequestsSent)}
          />
          <RateBar
            label="Taux de réponse LinkedIn"
            value={ratio(totals.linkedinReplies, totals.linkedinMessagesSent)}
          />
        </div>
        <div className="flex flex-col gap-4 rounded-2xl border border-sonate-cream bg-white p-5">
          <RateBar
            label="Taux d'ouverture emails"
            value={ratio(totals.emailsOpened, totals.emailsSent)}
          />
          <RateBar
            label="Taux de réponse emails"
            value={ratio(totals.emailReplies, totals.emailsSent)}
          />
          <RateBar
            label="Taux de clic emails"
            value={ratio(totals.emailClicks, totals.emailsSent)}
          />
        </div>
      </section>

      <section className="flex flex-col gap-3">
        <h2 className="font-semibold text-sonate-ink">Évolution</h2>
        <TrendChart data={timeSeries} />
      </section>

      <section className="flex flex-col gap-3">
        <h2 className="font-semibold text-sonate-ink">Par campagne</h2>
        <CampaignChart data={chartData} />

        <div className="overflow-x-auto rounded-2xl border border-sonate-cream bg-white">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-sonate-cream text-left text-xs uppercase tracking-wide text-sonate-muted">
                <th className="px-4 py-3">Campagne</th>
                <th className="px-4 py-3">Audience</th>
                <th className="px-4 py-3">Contactés</th>
                <th className="px-4 py-3">Réponses</th>
                <th className="px-4 py-3">Gagnés</th>
                <th className="px-4 py-3">Statut</th>
              </tr>
            </thead>
            <tbody>
              {campaigns.map((c) => (
                <tr key={c.id} className="border-b border-sonate-cream last:border-0">
                  <td className="px-4 py-3 font-medium text-sonate-ink">{c.nameTag}</td>
                  <td className="px-4 py-3">{c.latest?.audienceSize ?? "-"}</td>
                  <td className="px-4 py-3">{c.latest?.contacted ?? "-"}</td>
                  <td className="px-4 py-3">{c.latest?.replies ?? "-"}</td>
                  <td className="px-4 py-3">{c.latest?.won ?? "-"}</td>
                  <td className="px-4 py-3">
                    <span
                      className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                        c.active
                          ? "bg-sonate-green-100 text-sonate-green"
                          : "bg-sonate-cream text-sonate-muted"
                      }`}
                    >
                      {c.active ? "Active" : "En pause"}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </main>
  );
}
