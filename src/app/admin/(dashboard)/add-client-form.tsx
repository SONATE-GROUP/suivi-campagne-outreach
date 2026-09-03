"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const inputClass =
  "rounded-lg border border-ink-border-strong bg-ink-border px-3 py-2 text-sm text-ink-cream outline-none";

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
        className="w-fit rounded-lg bg-ink-orange px-4 py-2.5 text-sm font-bold text-white transition"
      >
        + Nouveau client
      </button>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col gap-3 rounded-xl border border-ink-border bg-ink-card p-6"
    >
      <h3 className="font-bold text-ink-cream">Nouveau client</h3>
      <div className="grid gap-3 sm:grid-cols-2">
        <input
          placeholder="Nom du client (ex : Hilarious Labs)"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          className={inputClass}
        />
        <input
          placeholder="Slug (ex : hilarious-labs)"
          value={slug}
          onChange={(e) => setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, "-"))}
          required
          className={inputClass}
        />
        <input
          placeholder="Mot de passe client"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className={inputClass}
        />
        <input
          placeholder="Clé API LaGrowthMachine"
          value={lgmApiKey}
          onChange={(e) => setLgmApiKey(e.target.value)}
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
          {loading ? "Création..." : "Créer le client"}
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
