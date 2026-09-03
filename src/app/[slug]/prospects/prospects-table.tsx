"use client";

import { useMemo, useState } from "react";
import { NoteCell } from "./note-cell";

type Lead = {
  id: string;
  firstname: string | null;
  lastname: string | null;
  companyName: string | null;
  linkedinUrl: string | null;
  email: string | null;
  status: string | null;
  messagesSent: number;
  messagesOpened: number;
  replied: boolean;
  note: string | null;
  campaign: { nameTag: string };
};

export function ProspectsTable({ leads, campaignTags }: { leads: Lead[]; campaignTags: string[] }) {
  const [search, setSearch] = useState("");
  const [campaignFilter, setCampaignFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [repliedFilter, setRepliedFilter] = useState("all");

  const statuses = useMemo(
    () => Array.from(new Set(leads.map((l) => l.status).filter((s): s is string => !!s))),
    [leads]
  );

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return leads.filter((lead) => {
      if (campaignFilter !== "all" && lead.campaign.nameTag !== campaignFilter) return false;
      if (statusFilter !== "all" && lead.status !== statusFilter) return false;
      if (repliedFilter === "yes" && !lead.replied) return false;
      if (repliedFilter === "no" && lead.replied) return false;
      if (!q) return true;
      const haystack = [
        lead.firstname,
        lead.lastname,
        lead.companyName,
        lead.email,
        lead.status,
        lead.linkedinUrl,
        lead.campaign.nameTag,
        lead.note,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();
      return haystack.includes(q);
    });
  }, [leads, search, campaignFilter, statusFilter, repliedFilter]);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center gap-3">
        <input
          placeholder="Rechercher (n'importe quel champ)"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-64 rounded-lg border border-sonate-green-border bg-white px-3 py-2 text-sm outline-none focus:border-sonate-green"
        />
        <select
          value={campaignFilter}
          onChange={(e) => setCampaignFilter(e.target.value)}
          className="rounded-lg border border-sonate-green-border bg-white px-3 py-2 text-sm outline-none focus:border-sonate-green"
        >
          <option value="all">Toutes les campagnes</option>
          {campaignTags.map((tag) => (
            <option key={tag} value={tag}>
              {tag}
            </option>
          ))}
        </select>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="rounded-lg border border-sonate-green-border bg-white px-3 py-2 text-sm outline-none focus:border-sonate-green"
        >
          <option value="all">Tous les statuts</option>
          {statuses.map((status) => (
            <option key={status} value={status}>
              {status}
            </option>
          ))}
        </select>
        <select
          value={repliedFilter}
          onChange={(e) => setRepliedFilter(e.target.value)}
          className="rounded-lg border border-sonate-green-border bg-white px-3 py-2 text-sm outline-none focus:border-sonate-green"
        >
          <option value="all">Réponse : tous</option>
          <option value="yes">A répondu</option>
          <option value="no">N&apos;a pas répondu</option>
        </select>
        <span className="ml-auto text-sm text-sonate-muted">
          {filtered.length} prospect{filtered.length > 1 ? "s" : ""}
        </span>
      </div>

      <div className="overflow-x-auto rounded-2xl border border-sonate-cream bg-white">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-sonate-cream text-left text-xs uppercase tracking-wide text-sonate-muted">
              <th className="px-4 py-3">Nom</th>
              <th className="px-4 py-3">Entreprise</th>
              <th className="px-4 py-3">Campagne</th>
              <th className="px-4 py-3">Statut</th>
              <th className="px-4 py-3">Messages envoyés</th>
              <th className="px-4 py-3">Réponse</th>
              <th className="px-4 py-3">Profil</th>
              <th className="px-4 py-3">Note</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((lead) => (
              <tr key={lead.id} className="border-b border-sonate-cream last:border-0">
                <td className="px-4 py-3 font-medium text-sonate-ink">
                  {lead.firstname} {lead.lastname}
                </td>
                <td className="px-4 py-3 text-sonate-ink">{lead.companyName}</td>
                <td className="px-4 py-3 text-sonate-muted">{lead.campaign.nameTag}</td>
                <td className="px-4 py-3 text-sonate-muted">{lead.status}</td>
                <td className="px-4 py-3">{lead.messagesSent}</td>
                <td className="px-4 py-3">
                  {lead.replied ? (
                    <span className="rounded-full bg-sonate-green-100 px-2 py-0.5 text-xs font-medium text-sonate-green">
                      Oui
                    </span>
                  ) : (
                    <span className="text-xs text-sonate-muted">Non</span>
                  )}
                </td>
                <td className="px-4 py-3">
                  {lead.linkedinUrl && (
                    <a
                      href={lead.linkedinUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="text-sonate-orange-dark underline underline-offset-2"
                    >
                      LinkedIn
                    </a>
                  )}
                </td>
                <td className="px-4 py-2">
                  <NoteCell leadId={lead.id} initialNote={lead.note} />
                </td>
              </tr>
            ))}

            {filtered.length === 0 && (
              <tr>
                <td colSpan={8} className="px-4 py-6 text-center text-sonate-muted">
                  Aucun prospect ne correspond à ces filtres.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
