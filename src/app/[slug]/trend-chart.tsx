"use client";

import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";

type Point = { date: string; contacted: number; replies: number; won: number };

const COLORS = {
  contacted: "#123C33",
  replies: "#2f7d5b",
  won: "#FF6B3D",
};

function formatDate(value: string | number | undefined) {
  if (typeof value !== "string") return "";
  const [, month, day] = value.split("-");
  return `${day}/${month}`;
}

export function TrendChart({ data }: { data: Point[] }) {
  if (data.length < 2) {
    return (
      <div className="flex h-64 items-center justify-center rounded-2xl border border-sonate-cream bg-white text-sm text-sonate-muted">
        Pas encore assez de données pour afficher une tendance (au moins 2 synchronisations
        nécessaires).
      </div>
    );
  }

  return (
    <div className="h-72 rounded-2xl border border-sonate-cream bg-white p-4">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
          <CartesianGrid stroke="#E8DFC9" vertical={false} />
          <XAxis
            dataKey="date"
            tickFormatter={formatDate}
            tick={{ fontSize: 12, fill: "#6b6f6c" }}
            axisLine={{ stroke: "#E8DFC9" }}
            tickLine={false}
          />
          <YAxis
            tick={{ fontSize: 12, fill: "#6b6f6c" }}
            axisLine={false}
            tickLine={false}
            width={32}
          />
          <Tooltip
            labelFormatter={(label) => formatDate(label as string)}
            contentStyle={{
              borderRadius: 12,
              border: "1px solid #E8DFC9",
              fontSize: 13,
            }}
          />
          <Legend wrapperStyle={{ fontSize: 13 }} />
          <Line
            type="monotone"
            dataKey="contacted"
            name="Contactés"
            stroke={COLORS.contacted}
            strokeWidth={2}
            dot={false}
          />
          <Line
            type="monotone"
            dataKey="replies"
            name="Réponses"
            stroke={COLORS.replies}
            strokeWidth={2}
            dot={false}
          />
          <Line
            type="monotone"
            dataKey="won"
            name="Gagnés"
            stroke={COLORS.won}
            strokeWidth={2}
            dot={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
