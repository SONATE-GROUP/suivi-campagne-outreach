"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const inputClass =
  "rounded-lg border border-ink-border-strong bg-ink-border px-3 py-2 text-sm text-ink-cream outline-none";

export function AddCampaignForm({ clientId }: { clientId: string }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [nameTag, setNameTag] = useState("");
  const [lgmCampaignId, setLgmCampaignId] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const res = await fetch("/api/admin/campaigns", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ clientId, nameTag, lgmCampaignId }),
    });

    setLoading(false);

    if (res.ok) {
      setNameTag("");
      setLgmCampaignId("");
      setOpen(false);
      router.refresh();
    } else {
      const data = await res.json();
      setError(data.error || "Erreur");
    }
  }

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="w-fit rounded-lg bg-ink-orange px-4 py-2.5 text-sm font-bold text-white transition"
      >
        + Ajouter une campagne
      </button>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col gap-3 rounded-xl border border-ink-border bg-ink-card p-6"
    >
      <h3 className="font-bold text-ink-cream">Nouvelle campagne</h3>
      <div className="grid gap-3 sm:grid-cols-2">
        <input
          placeholder="Nom (ex : Managers équipes)"
          value={nameTag}
          onChange={(e) => setNameTag(e.target.value)}
          required
          className={inputClass}
        />
        <input
          placeholder="ID campagne LGM"
          value={lgmCampaignId}
          onChange={(e) => setLgmCampaignId(e.target.value)}
          required
          className={inputClass}
        />
      </div>

      {error && <p className="text-sm text-ink-danger">{error}</p>}

      <div className="flex gap-3">
        <button
          type="submit"
          disabled={loading}
          className="rounded-lg bg-ink-orange px-4 py-2 text-sm font-bold text-white disabled:opacity-60"
        >
          {loading ? "Ajout..." : "Ajouter"}
        </button>
        <button
          type="button"
          onClick={() => setOpen(false)}
          className="rounded-lg px-4 py-2 text-sm text-ink-muted hover:text-ink-cream"
        >
          Annuler
        </button>
      </div>
    </form>
  );
}
