import { useFormatters } from "@/lib/useFormatters";
import { useTranslation } from "react-i18next";
import { CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

export interface WeightPoint {
  date: string; // literal "YYYY-MM-DDTHH:mm"
  weight: number;
}

export function PetWeightChart({ points }: { points: WeightPoint[] }) {
  const { t } = useTranslation();
  const { formatShortDate } = useFormatters();
  const data = points.map((p) => ({ ...p, label: formatShortDate(p.date) }));

  return (
    <ResponsiveContainer width="100%" height={200}>
      <LineChart data={data} margin={{ top: 8, right: 16, left: -12, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" />
        <XAxis dataKey="label" stroke="var(--muted-foreground)" fontSize={12} tickLine={false} axisLine={false} />
        <YAxis
          stroke="var(--muted-foreground)"
          fontSize={12}
          tickLine={false}
          axisLine={false}
          tickFormatter={(v) => `${v}kg`}
          width={48}
        />
        <Tooltip
          formatter={(value) => [`${Number(value).toFixed(1)} kg`, t("pets.weight")]}
          contentStyle={{
            background: "var(--popover)",
            border: "1px solid var(--border)",
            borderRadius: 8,
            color: "var(--popover-foreground)",
            fontSize: 13,
          }}
        />
        <Line
          type="monotone"
          dataKey="weight"
          stroke="var(--chart-1)"
          strokeWidth={2}
          dot={{ r: 4, fill: "var(--chart-1)", strokeWidth: 0 }}
          activeDot={{ r: 6 }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}
