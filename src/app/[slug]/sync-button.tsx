"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export function SyncButton({ slug }: { slug: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  async function handleSync() {
    setLoading(true);
    setMessage("");
    const res = await fetch(`/api/sync/${slug}`, { method: "POST" });
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
        className="rounded-lg border border-sonate-green px-4 py-2 text-sm font-semibold text-sonate-green transition hover:bg-sonate-green-50 disabled:opacity-60"
      >
        {loading ? "Synchronisation..." : "Synchroniser maintenant"}
      </button>
      {message && <span className="text-sm text-sonate-muted">{message}</span>}
    </div>
  );
}
