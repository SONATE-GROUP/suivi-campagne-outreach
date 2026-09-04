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
