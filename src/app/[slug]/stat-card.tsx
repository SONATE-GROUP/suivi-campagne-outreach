export function StatCard({
  label,
  value,
  accent = false,
}: {
  label: string;
  value: string | number;
  accent?: boolean;
}) {
  return (
    <div className="rounded-xl border border-ink-border bg-ink-card p-4">
      <p className="text-[11px] font-bold uppercase tracking-wide text-ink-muted-2">
        {label}
      </p>
      <p
        className={`mt-1.5 text-2xl font-extrabold ${
          accent ? "text-ink-orange" : "text-ink-cream"
        }`}
      >
        {value}
      </p>
    </div>
  );
}

export function RateBar({
  label,
  value,
  benchmark,
}: {
  label: string;
  value: number;
  benchmark?: string;
}) {
  const pct = Math.max(0, Math.min(100, Math.round(value * 100)));
  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex items-center justify-between text-sm">
        <span className="text-ink-cream">{label}</span>
        <span className="font-bold text-ink-orange">{pct}%</span>
      </div>
      <div className="h-1.5 w-full overflow-hidden rounded-full bg-ink-border">
        <div
          className="h-full rounded-full bg-ink-orange"
          style={{ width: `${pct}%` }}
        />
      </div>
      {benchmark && <p className="text-xs text-ink-muted-2">{benchmark}</p>}
    </div>
  );
}
