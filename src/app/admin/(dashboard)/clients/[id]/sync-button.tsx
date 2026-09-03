"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export function SyncButton({ clientId }: { clientId: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  async function handleSync() {
    setLoading(true);
    setMessage("");
    const res = await fetch("/api/admin/sync", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ clientId }),
    });
    setLoading(false);

    if (res.ok) {
      setMessage("Synchronisation terminée.");
      router.refresh();
    } else {
      setMessage("Erreur pendant la synchronisation.");
    }
  }

  return (
    <div className="flex items-center gap-3">
      <button
        onClick={handleSync}
        disabled={loading}
        className="rounded-lg border border-ink-border-strong px-4 py-2 text-sm font-semibold text-ink-cream transition hover:bg-ink-card disabled:opacity-60"
      >
        {loading ? "Synchronisation..." : "Synchroniser maintenant"}
      </button>
      {message && <span className="text-sm text-ink-muted">{message}</span>}
    </div>
  );
}
