"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export function AddClientForm() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [password, setPassword] = useState("");
  const [lgmApiKey, setLgmApiKey] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const res = await fetch("/api/admin/clients", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, slug, password, lgmApiKey }),
    });

    setLoading(false);

    if (res.ok) {
      setName("");
      setSlug("");
      setPassword("");
      setLgmApiKey("");
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
        + Nouveau client
      </button>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col gap-3 rounded-2xl border border-sonate-cream bg-sonate-ivory-light p-6"
    >
      <h3 className="font-semibold text-sonate-green">Nouveau client</h3>
      <div className="grid gap-3 sm:grid-cols-2">
        <input
          placeholder="Nom du client (ex : Hilarious Labs)"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          className="rounded-lg border border-sonate-green-border bg-white px-3 py-2 text-sm outline-none focus:border-sonate-green"
        />
        <input
          placeholder="Slug (ex : hilarious-labs)"
          value={slug}
          onChange={(e) => setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, "-"))}
          required
          className="rounded-lg border border-sonate-green-border bg-white px-3 py-2 text-sm outline-none focus:border-sonate-green"
        />
        <input
          placeholder="Mot de passe client"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="rounded-lg border border-sonate-green-border bg-white px-3 py-2 text-sm outline-none focus:border-sonate-green"
        />
        <input
          placeholder="Clé API LaGrowthMachine"
          value={lgmApiKey}
          onChange={(e) => setLgmApiKey(e.target.value)}
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
          {loading ? "Création..." : "Créer le client"}
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
