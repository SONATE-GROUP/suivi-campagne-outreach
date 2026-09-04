type SequenceStep = {
  id: string;
  lgmMessageId: string;
  type: string;
  channel: string;
  order: number;
  active: boolean;
};

const CHANNEL_STYLE: Record<string, { bg: string; icon: string; label: string }> = {
  LINKEDIN: { bg: "#0A66C2", icon: "💼", label: "LinkedIn" },
  GOOGLE: { bg: "#EA4335", icon: "✉️", label: "Email" },
  EMAIL: { bg: "#EA4335", icon: "✉️", label: "Email" },
  TWITTER: { bg: "#1DA1F2", icon: "🐦", label: "Twitter" },
};

export function SequenceFlow({
  steps,
  imageUrl,
}: {
  steps: SequenceStep[];
  imageUrl?: string | null;
}) {
  if (steps.length === 0) {
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

  return (
    <div className="overflow-x-auto rounded-xl border border-ink-border bg-ink-card p-6">
      <div className="flex w-fit items-center gap-2">
        <div className="flex flex-shrink-0 flex-col items-center gap-1.5">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-ink-positive text-xl text-white">
            ▶
          </div>
          <span className="text-xs font-semibold text-ink-cream">Start</span>
        </div>

        {(() => {
          const channelCounts: Record<string, number> = {};
          return steps.map((step) => {
            const channelKey = step.channel.toUpperCase();
            const style = CHANNEL_STYLE[channelKey] ?? {
              bg: "#3a5c4e",
              icon: "📨",
              label: step.channel,
            };
            channelCounts[channelKey] = (channelCounts[channelKey] ?? 0) + 1;
            const label = `${style.label} #${channelCounts[channelKey]}`;

            return (
              <div key={step.id} className="flex flex-shrink-0 items-center gap-2">
                <span className="text-ink-muted-2">→</span>
                <div
                  className={`flex w-36 flex-col items-center gap-1.5 rounded-lg border p-3 ${
                    step.active
                      ? "border-transparent"
                      : "border-dashed border-ink-border-strong opacity-50"
                  }`}
                  style={step.active ? { backgroundColor: style.bg } : undefined}
                >
                  <span className="text-lg leading-none">{style.icon}</span>
                  <span className="text-center text-xs font-semibold text-white">{label}</span>
                  {!step.active && (
                    <span className="text-[10px] text-ink-muted-2">Inactif</span>
                  )}
                </div>
              </div>
            );
          });
        })()}
      </div>
    </div>
  );
}
