type BarRow = {
  type: "bar";
  label: string;
  value: number;
  pct: number;
  info?: string;
};

type Badge = { label: string; value: number; pct: number; color: string };
type BadgeRow = { type: "badges"; badges: [Badge, Badge] };

type Row = BarRow | BadgeRow;

function Bar({ pct }: { pct: number }) {
  const width = Math.max(0, Math.min(100, pct));
  return (
    <div className="h-1.5 w-full overflow-hidden rounded-full bg-ink-border">
      <div className="h-full rounded-full bg-ink-orange" style={{ width: `${width}%` }} />
    </div>
  );
}

export function ChannelStatsCard({
  title,
  icon,
  iconBg,
  rows,
  won,
}: {
  title: string;
  icon: string;
  iconBg: string;
  rows: Row[];
  won: number;
}) {
  return (
    <div className="flex flex-col gap-4 rounded-xl border border-ink-border bg-ink-card p-5">
      <div className="flex items-center gap-3">
        <span
          className="flex h-9 w-9 items-center justify-center rounded-lg text-base"
          style={{ backgroundColor: iconBg }}
        >
          {icon}
        </span>
        <span className="text-base font-bold text-ink-cream">{title}</span>
      </div>

      <div className="flex flex-col gap-3.5">
        {rows.map((row, i) =>
          row.type === "bar" ? (
            <div key={i} className="flex flex-col gap-1.5">
              <div className="flex items-center justify-between text-sm">
                <span className="text-ink-cream">{row.label}</span>
                <span className="font-semibold text-ink-cream">
                  <span className="mr-1.5 text-ink-muted">{row.pct}%</span>
                  {row.value}
                </span>
              </div>
              <Bar pct={row.pct} />
            </div>
          ) : (
            <div key={i} className="flex items-center justify-between gap-3 border-t border-ink-border pt-3.5">
              {row.badges.map((b) => (
                <span key={b.label} className="flex items-center gap-2 text-sm">
                  <span
                    className="h-2.5 w-2.5 rounded-sm"
                    style={{ backgroundColor: b.color }}
                  />
                  <span className="text-ink-cream">{b.label}</span>
                  <span className="font-semibold text-ink-cream">
                    {b.value} <span className="text-ink-muted">({b.pct}%)</span>
                  </span>
                </span>
              ))}
            </div>
          )
        )}
      </div>

      <div className="flex items-center justify-between rounded-lg bg-ink-border px-3.5 py-2.5">
        <span className="text-sm font-semibold text-ink-cream">Leads Won</span>
        <span className="text-sm font-bold text-ink-orange">{won}</span>
      </div>
    </div>
  );
}
