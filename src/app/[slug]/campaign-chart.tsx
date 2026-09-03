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
      <div className="flex h-64 items-center justify-center rounded-2xl border border-sonate-cream bg-white text-sm text-sonate-muted">
        Aucune campagne synchronisée pour le moment.
      </div>
    );
  }

  return (
    <div className="h-80 rounded-2xl border border-sonate-cream bg-white p-4">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
          <CartesianGrid stroke="#E8DFC9" vertical={false} />
          <XAxis
            dataKey="nameTag"
            tick={{ fontSize: 11, fill: "#6b6f6c" }}
            axisLine={{ stroke: "#E8DFC9" }}
            tickLine={false}
            interval={0}
            angle={-15}
            textAnchor="end"
            height={60}
          />
          <YAxis
            tick={{ fontSize: 12, fill: "#6b6f6c" }}
            axisLine={false}
            tickLine={false}
            width={32}
          />
          <Tooltip
            contentStyle={{
              borderRadius: 12,
              border: "1px solid #E8DFC9",
              fontSize: 13,
            }}
          />
          <Legend wrapperStyle={{ fontSize: 13 }} />
          <Bar dataKey="contacted" name="Contactés" fill="#123C33" radius={[6, 6, 0, 0]} />
          <Bar dataKey="replies" name="Réponses" fill="#2f7d5b" radius={[6, 6, 0, 0]} />
          <Bar dataKey="won" name="Gagnés" fill="#FF6B3D" radius={[6, 6, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
