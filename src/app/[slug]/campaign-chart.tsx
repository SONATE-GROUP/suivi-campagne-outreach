"use client";

import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";

type Row = { nameTag: string; contacted: number; replies: number; won: number };

export function CampaignChart({ data }: { data: Row[] }) {
  if (data.length === 0) {
    return (
      <div className="flex h-64 items-center justify-center rounded-xl border border-ink-border bg-ink-card text-sm text-ink-muted">
        Aucune campagne synchronisée pour le moment.
      </div>
    );
  }

  return (
    <div className="h-80 rounded-xl border border-ink-border bg-ink-card p-4">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
          <CartesianGrid stroke="#2d4a3e" vertical={false} />
          <XAxis
            dataKey="nameTag"
            tick={{ fontSize: 11, fill: "#7a9e8e" }}
            axisLine={{ stroke: "#2d4a3e" }}
            tickLine={false}
            interval={0}
            angle={-15}
            textAnchor="end"
            height={60}
          />
          <YAxis
            tick={{ fontSize: 12, fill: "#7a9e8e" }}
            axisLine={false}
            tickLine={false}
            width={32}
          />
          <Tooltip
            contentStyle={{
              borderRadius: 10,
              border: "1px solid #2d4a3e",
              backgroundColor: "#142218",
              fontSize: 13,
              color: "#f5f0e8",
            }}
          />
          <Legend wrapperStyle={{ fontSize: 13, color: "#f5f0e8" }} />
          <Bar dataKey="contacted" name="Contactés" fill="#7a9e8e" radius={[6, 6, 0, 0]} />
          <Bar dataKey="replies" name="Réponses" fill="#4caf7d" radius={[6, 6, 0, 0]} />
          <Bar dataKey="won" name="Gagnés" fill="#e8571a" radius={[6, 6, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
