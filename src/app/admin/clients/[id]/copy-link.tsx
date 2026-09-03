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
      className="rounded-lg border border-sonate-cream bg-white px-4 py-2 text-sm text-sonate-ink transition hover:border-sonate-green-border"
    >
      {copied ? "Lien copié !" : `Copier le lien du dashboard (/${slug})`}
    </button>
  );
}
