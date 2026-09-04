"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";

const MAX_IMAGE_BYTES = 2 * 1024 * 1024;

export function CampaignRow({
  id,
  nameTag,
  lgmCampaignId,
  active,
  sequenceImage,
}: {
  id: string;
  nameTag: string;
  lgmCampaignId: string;
  active: boolean;
  sequenceImage: string | null;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [imageError, setImageError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  async function toggleActive() {
    setLoading(true);
    await fetch(`/api/admin/campaigns/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ active: !active }),
    });
    setLoading(false);
    router.refresh();
  }

  async function remove() {
    if (!confirm(`Supprimer la campagne "${nameTag}" et toutes ses données ?`)) return;
    setLoading(true);
    await fetch(`/api/admin/campaigns/${id}`, { method: "DELETE" });
    setLoading(false);
    router.refresh();
  }

  async function handleImageChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setImageError(null);

    if (file.size > MAX_IMAGE_BYTES) {
      setImageError("Image trop lourde (2 Mo max).");
      e.target.value = "";
      return;
    }

    const dataUrl = await new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });

    setLoading(true);
    await fetch(`/api/admin/campaigns/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ sequenceImage: dataUrl }),
    });
    setLoading(false);
    e.target.value = "";
    router.refresh();
  }

  async function removeImage() {
    setLoading(true);
    await fetch(`/api/admin/campaigns/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ sequenceImage: null }),
    });
    setLoading(false);
    router.refresh();
  }

  return (
    <div className="flex flex-col gap-3 rounded-xl border border-ink-border bg-ink-card px-5 py-3">
      <div className="flex items-center justify-between">
        <div>
          <p className="font-medium text-ink-cream">{nameTag}</p>
          <p className="text-xs text-ink-muted">LGM ID : {lgmCampaignId}</p>
        </div>
        <div className="flex items-center gap-4">
          <span
            className={`text-xs font-medium ${active ? "text-ink-positive" : "text-ink-muted"}`}
          >
            {active ? "Active" : "En pause"}
          </span>
          <button
            onClick={toggleActive}
            disabled={loading}
            className="text-xs text-ink-orange underline underline-offset-2 disabled:opacity-60"
          >
            {active ? "Mettre en pause" : "Réactiver"}
          </button>
          <button
            onClick={remove}
            disabled={loading}
            className="text-xs text-ink-danger underline underline-offset-2 disabled:opacity-60"
          >
            Supprimer
          </button>
        </div>
      </div>

      <div className="flex items-center gap-3 border-t border-ink-border pt-3">
        <span className="text-xs text-ink-muted">Schéma de séquence (image) :</span>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          disabled={loading}
          className="text-xs text-ink-muted file:mr-2 file:rounded file:border-0 file:bg-ink-border-strong file:px-2 file:py-1 file:text-xs file:text-ink-cream"
        />
        {sequenceImage && (
          <button
            onClick={removeImage}
            disabled={loading}
            className="text-xs text-ink-danger underline underline-offset-2 disabled:opacity-60"
          >
            Retirer l&apos;image
          </button>
        )}
        {imageError && <span className="text-xs text-ink-danger">{imageError}</span>}
      </div>
    </div>
  );
}
