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
    <div className="flex min-h-screen flex-col bg-ink-bg">
      <div className="flex-shrink-0 px-7 py-5">
        <img src="/logo/sonate-logo-beige.png" alt="Sonate" className="h-11 w-auto" />
      </div>

      <div className="flex flex-1 items-center justify-center px-6">
        <div className="w-full max-w-sm rounded-2xl border border-ink-border bg-ink-panel p-9">
          <div className="mb-8 text-center">
            <p className="text-xs font-extrabold uppercase tracking-wide text-ink-orange">
              Suivi des campagnes
            </p>
            <p className="mt-1 text-lg font-bold text-ink-cream">Connexion</p>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-3.5">
            <div>
              <label className="mb-1.5 block text-xs text-ink-muted">Mot de passe</label>
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoFocus
                className="w-full rounded-lg border border-ink-border-strong bg-ink-border px-3.5 py-2.5 text-sm text-ink-cream outline-none"
              />
            </div>

            {error && <p className="text-center text-sm text-ink-danger">{error}</p>}

            <button
              type="submit"
              disabled={loading}
              className="mt-1 rounded-lg bg-ink-orange py-2.5 text-sm font-bold text-white transition disabled:opacity-70"
            >
              {loading ? "Connexion..." : "Se connecter"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
