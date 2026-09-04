"use client";

import { useMemo, useState } from "react";
import { NoteCell } from "./note-cell";
import { translateStatus } from "@/lib/status-labels";

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

type SortKey =
  | "name"
  | "companyName"
  | "campaign"
  | "status"
  | "messagesSent"
  | "replied"
  | "note";

const COLUMNS: { key: SortKey; label: string }[] = [
  { key: "name", label: "Nom" },
  { key: "companyName", label: "Entreprise" },
  { key: "campaign", label: "Campagne" },
  { key: "status", label: "Statut" },
  { key: "messagesSent", label: "Messages envoyés" },
  { key: "replied", label: "Réponse" },
];

function sortValue(lead: Lead, key: SortKey): string | number {
  switch (key) {
    case "name":
      return `${lead.lastname ?? ""} ${lead.firstname ?? ""}`.trim().toLowerCase();
    case "companyName":
      return (lead.companyName ?? "").toLowerCase();
    case "campaign":
      return lead.campaign.nameTag.toLowerCase();
    case "status":
      return (lead.status ?? "").toLowerCase();
    case "messagesSent":
      return lead.messagesSent;
    case "replied":
      return lead.replied ? 1 : 0;
    case "note":
      return (lead.note ?? "").toLowerCase();
  }
}

export function ProspectsTable({ leads, campaignTags }: { leads: Lead[]; campaignTags: string[] }) {
  const [search, setSearch] = useState("");
  const [campaignFilter, setCampaignFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [repliedFilter, setRepliedFilter] = useState("all");
  const [sortKey, setSortKey] = useState<SortKey | null>(null);
  const [sortDir, setSortDir] = useState<"asc" | "desc">("asc");

  const statuses = useMemo(
    () => Array.from(new Set(leads.map((l) => l.status).filter((s): s is string => !!s))),
    [leads]
  );

  function toggleSort(key: SortKey) {
    if (sortKey !== key) {
      setSortKey(key);
      setSortDir("asc");
    } else if (sortDir === "asc") {
      setSortDir("desc");
    } else {
      setSortKey(null);
    }
  }

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    const result = leads.filter((lead) => {
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

    if (!sortKey) return result;

    return [...result].sort((a, b) => {
      const va = sortValue(a, sortKey);
      const vb = sortValue(b, sortKey);
      const cmp = typeof va === "number" && typeof vb === "number" ? va - vb : String(va).localeCompare(String(vb));
      return sortDir === "asc" ? cmp : -cmp;
    });
  }, [leads, search, campaignFilter, statusFilter, repliedFilter, sortKey, sortDir]);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center gap-3">
        <input
          placeholder="Rechercher (n'importe quel champ)"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-64 rounded-lg border border-ink-border bg-ink-card px-3 py-2 text-sm text-ink-cream outline-none"
        />
        <select
          value={campaignFilter}
          onChange={(e) => setCampaignFilter(e.target.value)}
          className="cursor-pointer rounded-lg border border-ink-border bg-ink-card px-3 py-2 text-sm text-ink-cream outline-none"
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
          className="cursor-pointer rounded-lg border border-ink-border bg-ink-card px-3 py-2 text-sm text-ink-cream outline-none"
        >
          <option value="all">Tous les statuts</option>
          {statuses.map((status) => (
            <option key={status} value={status}>
              {translateStatus(status)}
            </option>
          ))}
        </select>
        <select
          value={repliedFilter}
          onChange={(e) => setRepliedFilter(e.target.value)}
          className="cursor-pointer rounded-lg border border-ink-border bg-ink-card px-3 py-2 text-sm text-ink-cream outline-none"
        >
          <option value="all">Réponse : tous</option>
          <option value="yes">A répondu</option>
          <option value="no">N&apos;a pas répondu</option>
        </select>
        <span className="ml-auto text-sm text-ink-muted">
          {filtered.length} prospect{filtered.length > 1 ? "s" : ""}
        </span>
      </div>

      <div className="overflow-x-auto rounded-xl border border-ink-border bg-ink-card">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-ink-border text-left text-[11px] font-bold uppercase tracking-wide text-ink-muted-2">
              {COLUMNS.map((col) => (
                <th key={col.key} className="px-4 py-3">
                  <button
                    onClick={() => toggleSort(col.key)}
                    className="flex cursor-pointer items-center gap-1 uppercase tracking-wide text-ink-muted-2 hover:text-ink-cream"
                  >
                    {col.label}
                    <span className="text-ink-orange">
                      {sortKey === col.key ? (sortDir === "asc" ? "↑" : "↓") : ""}
                    </span>
                  </button>
                </th>
              ))}
              <th className="px-4 py-3">Profil</th>
              <th className="px-4 py-3">Note</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((lead) => (
              <tr key={lead.id} className="border-b border-ink-border last:border-0">
                <td className="px-4 py-3 font-medium text-ink-cream">
                  {lead.firstname} {lead.lastname}
                </td>
                <td className="px-4 py-3 text-ink-cream">{lead.companyName}</td>
                <td className="px-4 py-3 text-ink-muted">{lead.campaign.nameTag}</td>
                <td className="px-4 py-3 text-ink-muted">{translateStatus(lead.status)}</td>
                <td className="px-4 py-3 text-ink-muted">{lead.messagesSent}</td>
                <td className="px-4 py-3">
                  {lead.replied ? (
                    <span className="rounded-full border border-ink-positive/40 px-2 py-0.5 text-xs font-medium text-ink-positive">
                      Oui
                    </span>
                  ) : (
                    <span className="text-xs text-ink-muted-2">Non</span>
                  )}
                </td>
                <td className="px-4 py-3">
                  {lead.linkedinUrl && (
                    <a
                      href={lead.linkedinUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="text-ink-orange underline underline-offset-2"
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
                <td colSpan={8} className="px-4 py-6 text-center text-ink-muted">
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
