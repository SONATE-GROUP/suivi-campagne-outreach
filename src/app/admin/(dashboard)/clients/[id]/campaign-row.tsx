"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export function CampaignRow({
  id,
  nameTag,
  lgmCampaignId,
  active,
}: {
  id: string;
  nameTag: string;
  lgmCampaignId: string;
  active: boolean;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function toggleActive() {
    setLoading(true);
    await fetch(`/api/admin/campaigns/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ active: !active }),
    });
    setLoading(false);
    router.refresh();
  }

  async function remove() {
    if (!confirm(`Supprimer la campagne "${nameTag}" et toutes ses données ?`)) return;
    setLoading(true);
    await fetch(`/api/admin/campaigns/${id}`, { method: "DELETE" });
    setLoading(false);
    router.refresh();
  }

  return (
    <div className="flex items-center justify-between rounded-xl border border-ink-border bg-ink-card px-5 py-3">
      <div>
        <p className="font-medium text-ink-cream">{nameTag}</p>
        <p className="text-xs text-ink-muted">LGM ID : {lgmCampaignId}</p>
      </div>
      <div className="flex items-center gap-4">
        <span
          className={`text-xs font-medium ${active ? "text-ink-positive" : "text-ink-muted"}`}
        >
          {active ? "Active" : "En pause"}
        </span>
        <button
          onClick={toggleActive}
          disabled={loading}
          className="text-xs text-ink-orange underline underline-offset-2 disabled:opacity-60"
        >
          {active ? "Mettre en pause" : "Réactiver"}
        </button>
        <button
          onClick={remove}
          disabled={loading}
          className="text-xs text-ink-danger underline underline-offset-2 disabled:opacity-60"
        >
          Supprimer
        </button>
      </div>
    </div>
  );
}
