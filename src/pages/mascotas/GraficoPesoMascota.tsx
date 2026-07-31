import { CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

export interface PuntoPeso {
  fecha: string; // literal "YYYY-MM-DDTHH:mm"
  peso: number;
}

function formatearFechaCorta(literal: string) {
  const [fecha] = literal.split("T");
  const [, mm, dd] = fecha.split("-");
  return `${dd}/${mm}`;
}

export function GraficoPesoMascota({ puntos }: { puntos: PuntoPeso[] }) {
  const datos = puntos.map((p) => ({ ...p, etiqueta: formatearFechaCorta(p.fecha) }));

  return (
    <ResponsiveContainer width="100%" height={200}>
      <LineChart data={datos} margin={{ top: 8, right: 16, left: -12, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" />
        <XAxis dataKey="etiqueta" stroke="var(--muted-foreground)" fontSize={12} tickLine={false} axisLine={false} />
        <YAxis
          stroke="var(--muted-foreground)"
          fontSize={12}
          tickLine={false}
          axisLine={false}
          tickFormatter={(v) => `${v}kg`}
          width={48}
        />
        <Tooltip
          formatter={(value) => [`${Number(value).toFixed(1)} kg`, "Peso"]}
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
          dataKey="peso"
          stroke="var(--primary)"
          strokeWidth={2}
          dot={{ r: 4, fill: "var(--primary)", strokeWidth: 0 }}
          activeDot={{ r: 6 }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}
