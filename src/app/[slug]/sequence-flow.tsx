export function SequenceFlow({ imageUrl }: { imageUrl?: string | null }) {
  if (imageUrl) {
    return (
      <div className="overflow-hidden rounded-xl border border-ink-border bg-ink-card p-4">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={imageUrl} alt="Séquence de la campagne" className="w-full rounded-lg" />
      </div>
    );
  }

  return (
    <div className="flex h-32 items-center justify-center rounded-xl border border-ink-border bg-ink-card text-sm text-ink-muted">
      Séquence non disponible pour cette campagne.
    </div>
  );
}
