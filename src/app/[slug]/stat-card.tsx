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
    <div className="rounded-2xl border border-sonate-cream bg-white p-5">
      <p className="text-xs font-medium uppercase tracking-wide text-sonate-muted">
        {label}
      </p>
      <p
        className={`mt-2 text-2xl font-bold ${
          accent ? "text-sonate-orange-dark" : "text-sonate-green"
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
        <span className="text-sonate-ink">{label}</span>
        <span className="font-semibold text-sonate-green">{pct}%</span>
      </div>
      <div className="h-2 w-full overflow-hidden rounded-full bg-sonate-green-100">
        <div
          className="h-full rounded-full bg-sonate-green"
          style={{ width: `${pct}%` }}
        />
      </div>
      {benchmark && <p className="text-xs text-sonate-muted">{benchmark}</p>}
    </div>
  );
}
