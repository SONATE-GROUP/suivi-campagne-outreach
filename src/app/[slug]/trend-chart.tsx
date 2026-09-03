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
  contacted: "#7a9e8e",
  replies: "#4caf7d",
  won: "#e8571a",
};

function formatDate(value: string | number | undefined) {
  if (typeof value !== "string") return "";
  const [, month, day] = value.split("-");
  return `${day}/${month}`;
}

export function TrendChart({ data }: { data: Point[] }) {
  if (data.length < 2) {
    return (
      <div className="flex h-64 items-center justify-center rounded-xl border border-ink-border bg-ink-card text-sm text-ink-muted">
        Pas encore assez de données pour afficher une tendance (au moins 2 synchronisations
        nécessaires).
      </div>
    );
  }

  return (
    <div className="h-72 rounded-xl border border-ink-border bg-ink-card p-4">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
          <CartesianGrid stroke="#2d4a3e" vertical={false} />
          <XAxis
            dataKey="date"
            tickFormatter={formatDate}
            tick={{ fontSize: 12, fill: "#7a9e8e" }}
            axisLine={{ stroke: "#2d4a3e" }}
            tickLine={false}
          />
          <YAxis
            tick={{ fontSize: 12, fill: "#7a9e8e" }}
            axisLine={false}
            tickLine={false}
            width={32}
          />
          <Tooltip
            labelFormatter={(label) => formatDate(label as string)}
            contentStyle={{
              borderRadius: 10,
              border: "1px solid #2d4a3e",
              backgroundColor: "#142218",
              fontSize: 13,
              color: "#f5f0e8",
            }}
          />
          <Legend wrapperStyle={{ fontSize: 13, color: "#f5f0e8" }} />
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
