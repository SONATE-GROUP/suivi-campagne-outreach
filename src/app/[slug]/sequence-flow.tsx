type SequenceStep = {
  id: string;
  lgmMessageId: string;
  type: string;
  channel: string;
  order: number;
  active: boolean;
};

const CHANNEL_STYLE: Record<string, { bg: string; icon: string }> = {
  LINKEDIN: { bg: "#0A66C2", icon: "💼" },
  EMAIL: { bg: "#EA4335", icon: "✉️" },
  TWITTER: { bg: "#1DA1F2", icon: "🐦" },
};

const TYPE_LABEL: Record<string, string> = {
  INITIAL: "Message initial",
  INTRO: "Message initial",
  FOLLOW_UP: "Relance",
  FOLLOWUP: "Relance",
  BREAKUP: "Message de rupture",
  BREAK_UP: "Message de rupture",
  CONNECTION_REQUEST: "Demande de connexion",
  VISIT: "Visite de profil",
};

function labelFor(type: string) {
  return TYPE_LABEL[type.toUpperCase()] ?? type.replaceAll("_", " ").toLowerCase();
}

export function SequenceFlow({ steps }: { steps: SequenceStep[] }) {
  if (steps.length === 0) {
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

        {steps.map((step) => {
          const style = CHANNEL_STYLE[step.channel.toUpperCase()] ?? {
            bg: "#3a5c4e",
            icon: "📨",
          };
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
                <span className="text-center text-xs font-semibold text-white">
                  {labelFor(step.type)}
                </span>
                {!step.active && (
                  <span className="text-[10px] text-ink-muted-2">Inactif</span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
