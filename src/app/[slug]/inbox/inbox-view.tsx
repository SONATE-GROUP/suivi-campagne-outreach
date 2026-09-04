"use client";

import { useState } from "react";
import type { InboxConversation } from "@/lib/inbox";
import type { LgmMessage } from "@/lib/lgm";

function formatDate(value: number | string) {
  const d = typeof value === "number" ? new Date(value) : new Date(value);
  return d.toLocaleString("fr-FR", { dateStyle: "medium", timeStyle: "short" });
}

const CHANNEL_ICON: Record<string, string> = {
  LINKEDIN: "💼",
  EMAIL: "✉️",
};

export function InboxView({
  slug,
  conversations,
}: {
  slug: string;
  conversations: InboxConversation[];
}) {
  const [selected, setSelected] = useState<InboxConversation | null>(null);
  const [messages, setMessages] = useState<LgmMessage[]>([]);
  const [loading, setLoading] = useState(false);

  async function openConversation(conv: InboxConversation) {
    setSelected(conv);
    setLoading(true);
    setMessages([]);
    const res = await fetch(`/api/inbox/${slug}/messages/${conv.id}`);
    setLoading(false);
    if (res.ok) {
      const data = await res.json();
      setMessages(data.messages ?? []);
    }
  }

  if (conversations.length === 0) {
    return (
      <div className="flex h-64 items-center justify-center rounded-xl border border-ink-border bg-ink-card text-sm text-ink-muted">
        Aucune conversation pour le moment.
      </div>
    );
  }

  return (
    <div className="flex h-[calc(100vh-260px)] min-h-[420px] gap-4">
      <div className="flex w-80 flex-shrink-0 flex-col overflow-y-auto rounded-xl border border-ink-border bg-ink-card">
        {conversations.map((conv) => (
          <button
            key={conv.id}
            onClick={() => openConversation(conv)}
            className={`flex flex-col gap-1 border-b border-ink-border px-4 py-3 text-left transition last:border-0 ${
              selected?.id === conv.id ? "bg-ink-border-strong" : "hover:bg-ink-border/40"
            }`}
          >
            <div className="flex items-center justify-between gap-2">
              <span className="truncate text-sm font-semibold text-ink-cream">
                {conv.leadName}
              </span>
              <span className="shrink-0 text-xs">{CHANNEL_ICON[conv.lastMessageType] ?? ""}</span>
            </div>
            {conv.companyName && (
              <span className="truncate text-xs text-ink-muted">{conv.companyName}</span>
            )}
            <div className="flex items-center justify-between gap-2">
              <span className="truncate text-[11px] text-ink-muted-2">{conv.campaignNameTag}</span>
              <span className="shrink-0 text-[11px] text-ink-muted-2">
                {formatDate(conv.lastMessageAt)}
              </span>
            </div>
          </button>
        ))}
      </div>

      <div className="flex flex-1 flex-col rounded-xl border border-ink-border bg-ink-card">
        {!selected ? (
          <div className="flex flex-1 items-center justify-center text-sm text-ink-muted">
            Sélectionne une conversation pour voir les échanges.
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between border-b border-ink-border px-5 py-3">
              <div>
                <p className="text-sm font-semibold text-ink-cream">{selected.leadName}</p>
                <p className="text-xs text-ink-muted">
                  {selected.companyName} · {selected.campaignNameTag}
                </p>
              </div>
              {selected.linkedinUrl && (
                <a
                  href={selected.linkedinUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="text-xs text-ink-orange underline underline-offset-2"
                >
                  Voir le profil LinkedIn
                </a>
              )}
            </div>

            <div className="flex flex-1 flex-col gap-3 overflow-y-auto px-5 py-4">
              {loading && <p className="text-sm text-ink-muted">Chargement...</p>}
              {!loading && messages.length === 0 && (
                <p className="text-sm text-ink-muted">Aucun message dans cette conversation.</p>
              )}
              {messages.map((m) => (
                <div
                  key={m.id}
                  className={`flex flex-col gap-1 ${
                    m.direction === "sent" ? "items-end" : "items-start"
                  }`}
                >
                  <div
                    className={`max-w-[75%] rounded-xl px-3.5 py-2.5 text-sm ${
                      m.direction === "sent"
                        ? "bg-ink-orange text-white"
                        : "border border-ink-border bg-ink-bg text-ink-cream"
                    }`}
                  >
                    {m.content}
                  </div>
                  <span className="text-[11px] text-ink-muted-2">
                    {CHANNEL_ICON[m.channel] ?? ""} {formatDate(m.createdAt)}
                  </span>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
