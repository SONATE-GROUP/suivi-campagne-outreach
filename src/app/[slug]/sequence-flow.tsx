"use client";

import { useState } from "react";

type SequenceStep = {
  id: string;
  lgmMessageId: string;
  type: string;
  channel: string;
  order: number;
  active: boolean;
  content: string | null;
  subject: string | null;
};

const CHANNEL_STYLE: Record<string, { bg: string; icon: string; label: string }> = {
  LINKEDIN: { bg: "#0A66C2", icon: "💼", label: "LinkedIn" },
  GOOGLE: { bg: "#EA4335", icon: "✉️", label: "Email" },
  EMAIL: { bg: "#EA4335", icon: "✉️", label: "Email" },
  TWITTER: { bg: "#1DA1F2", icon: "🐦", label: "Twitter" },
};

function styleFor(channel: string) {
  return (
    CHANNEL_STYLE[channel.toUpperCase()] ?? { bg: "#3a5c4e", icon: "📨", label: channel }
  );
}

export function SequenceFlow({
  steps,
  imageUrl,
}: {
  steps: SequenceStep[];
  imageUrl?: string | null;
}) {
  const [selected, setSelected] = useState<SequenceStep | null>(null);

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

  const lanes = new Map<string, SequenceStep[]>();
  for (const step of steps) {
    const key = step.channel.toUpperCase();
    if (!lanes.has(key)) lanes.set(key, []);
    lanes.get(key)!.push(step);
  }

  return (
    <>
      <div className="flex flex-col gap-4 rounded-xl border border-ink-border bg-ink-card p-6">
        {Array.from(lanes.entries()).map(([channelKey, channelSteps]) => {
          const style = styleFor(channelKey);
          return (
            <div key={channelKey} className="overflow-x-auto">
              <div className="flex w-fit items-center gap-2">
                <div className="flex flex-shrink-0 flex-col items-center gap-1.5">
                  <div className="flex h-14 w-14 items-center justify-center rounded-full bg-ink-positive text-xl text-white">
                    ▶
                  </div>
                  <span className="text-xs font-semibold text-ink-cream">
                    {style.label}
                  </span>
                </div>

                {channelSteps.map((step, i) => (
                  <div key={step.id} className="flex flex-shrink-0 items-center gap-2">
                    <span className="text-ink-muted-2">→</span>
                    <button
                      type="button"
                      onClick={() => step.content && setSelected(step)}
                      className={`flex w-36 flex-col items-center gap-1.5 rounded-lg border p-3 text-left transition ${
                        step.active
                          ? "border-transparent"
                          : "border-dashed border-ink-border-strong opacity-50"
                      } ${step.content ? "cursor-pointer hover:brightness-110" : "cursor-default"}`}
                      style={step.active ? { backgroundColor: style.bg } : undefined}
                    >
                      <span className="text-lg leading-none">{style.icon}</span>
                      <span className="text-center text-xs font-semibold text-white">
                        {style.label} #{i + 1}
                      </span>
                      {!step.active && (
                        <span className="text-[10px] text-ink-muted-2">Inactif</span>
                      )}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {selected && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-6"
          onClick={() => setSelected(null)}
        >
          <div
            className="flex max-h-[80vh] w-full max-w-lg flex-col gap-3 overflow-y-auto rounded-xl border border-ink-border bg-ink-card p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-2">
                <span className="text-lg leading-none">{styleFor(selected.channel).icon}</span>
                <span className="text-sm font-semibold text-ink-cream">
                  {styleFor(selected.channel).label}
                </span>
              </div>
              <button
                onClick={() => setSelected(null)}
                className="text-sm text-ink-muted hover:text-ink-cream"
              >
                ✕
              </button>
            </div>
            {selected.subject && (
              <p className="text-sm font-semibold text-ink-cream">Objet : {selected.subject}</p>
            )}
            <p className="whitespace-pre-wrap text-sm text-ink-muted">{selected.content}</p>
          </div>
        </div>
      )}
    </>
  );
}
