"use client";

import { useState, use } from "react";
import { useRouter } from "next/navigation";

export default function ClientLoginPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = use(params);
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ slug, password }),
    });

    setLoading(false);

    if (res.ok) {
      router.push(`/${slug}`);
      router.refresh();
    } else {
      const data = await res.json();
      setError(data.error || "Erreur de connexion");
    }
  }

  return (
    <main className="flex flex-1 flex-col items-center justify-center px-6">
      <div className="w-full max-w-sm rounded-2xl border border-sonate-cream bg-sonate-ivory-light p-8 shadow-sonate">
        <img src="/logo/sonate-logo-vert.png" alt="Sonate" className="mb-6 h-10 w-auto" />
        <h1 className="text-lg font-bold text-sonate-green">Accès au tableau de bord</h1>
        <p className="mt-1 text-sm text-sonate-muted">
          Entrez le mot de passe qui vous a été communiqué.
        </p>

        <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-4">
          <input
            type="password"
            placeholder="Mot de passe"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="rounded-lg border border-sonate-green-border bg-white px-4 py-2.5 text-sm outline-none focus:border-sonate-green"
          />

          {error && <p className="text-sm text-red-600">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="rounded-lg bg-sonate-green px-4 py-2.5 text-sm font-semibold text-sonate-ivory transition hover:bg-sonate-green-dark disabled:opacity-60"
          >
            {loading ? "Connexion..." : "Se connecter"}
          </button>
        </form>
      </div>
    </main>
  );
}
