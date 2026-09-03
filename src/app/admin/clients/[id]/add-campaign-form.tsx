"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

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
        className="rounded-lg bg-sonate-orange px-4 py-2.5 text-sm font-semibold text-sonate-ivory transition hover:bg-sonate-orange-dark"
      >
        + Ajouter une campagne
      </button>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col gap-3 rounded-2xl border border-sonate-cream bg-sonate-ivory-light p-6"
    >
      <h3 className="font-semibold text-sonate-green">Nouvelle campagne</h3>
      <div className="grid gap-3 sm:grid-cols-2">
        <input
          placeholder="Nom (ex : Managers équipes)"
          value={nameTag}
          onChange={(e) => setNameTag(e.target.value)}
          required
          className="rounded-lg border border-sonate-green-border bg-white px-3 py-2 text-sm outline-none focus:border-sonate-green"
        />
        <input
          placeholder="ID campagne LGM"
          value={lgmCampaignId}
          onChange={(e) => setLgmCampaignId(e.target.value)}
          required
          className="rounded-lg border border-sonate-green-border bg-white px-3 py-2 text-sm outline-none focus:border-sonate-green"
        />
      </div>

      {error && <p className="text-sm text-red-600">{error}</p>}

      <div className="flex gap-3">
        <button
          type="submit"
          disabled={loading}
          className="rounded-lg bg-sonate-green px-4 py-2 text-sm font-semibold text-sonate-ivory hover:bg-sonate-green-dark disabled:opacity-60"
        >
          {loading ? "Ajout..." : "Ajouter"}
        </button>
        <button
          type="button"
          onClick={() => setOpen(false)}
          className="rounded-lg px-4 py-2 text-sm text-sonate-muted hover:text-sonate-ink"
        >
          Annuler
        </button>
      </div>
    </form>
  );
}
