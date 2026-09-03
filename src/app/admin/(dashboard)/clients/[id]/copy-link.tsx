"use client";

import { useState } from "react";

export function CopyLink({ slug }: { slug: string }) {
  const [copied, setCopied] = useState(false);

  async function copy() {
    const url = `${window.location.origin}/${slug}`;
    await navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <button
      onClick={copy}
      className="rounded-lg border border-ink-border-strong px-4 py-2 text-sm text-ink-cream transition hover:bg-ink-card"
    >
      {copied ? "Lien copié !" : `Copier le lien du dashboard (/${slug})`}
    </button>
  );
}
