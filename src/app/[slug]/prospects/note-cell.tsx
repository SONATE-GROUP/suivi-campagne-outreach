"use client";

import { useState } from "react";

export function NoteCell({ leadId, initialNote }: { leadId: string; initialNote: string | null }) {
  const [value, setValue] = useState(initialNote ?? "");
  const [saved, setSaved] = useState(true);
  const [saving, setSaving] = useState(false);

  async function save() {
    if (saved) return;
    setSaving(true);
    const res = await fetch(`/api/leads/${leadId}/note`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ note: value.trim() || null }),
    });
    setSaving(false);
    if (res.ok) setSaved(true);
  }

  return (
    <div className="flex min-w-48 items-start gap-2">
      <textarea
        value={value}
        onChange={(e) => {
          setValue(e.target.value);
          setSaved(false);
        }}
        onBlur={save}
        placeholder="Ajouter une note..."
        rows={1}
        className="w-full resize-y rounded-lg border border-transparent bg-transparent px-2 py-1 text-sm text-sonate-ink outline-none transition placeholder:text-sonate-muted hover:border-sonate-cream focus:border-sonate-green focus:bg-white"
      />
      {saving && <span className="mt-1 shrink-0 text-xs text-sonate-muted">...</span>}
      {!saving && !saved && <span className="mt-1 shrink-0 text-xs text-sonate-orange-dark">●</span>}
    </div>
  );
}
