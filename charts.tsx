"use client";
import { Bar, BarChart, Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { brl } from "@/lib/categories";

const PALETTE = ["#ef4444", "#f97316", "#f59e0b", "#e11d48", "#dc2626", "#fb7185", "#b91c1c", "#fb923c", "#fca5a5", "#9f1239", "#c2410c", "#fdba74", "#7f1d1d", "#fecaca", "#78350f"];

export function ExpensePie({ data }: { data: { name: string; value: number }[] }) {
  if (!data.length) return <p className="py-10 text-center text-neutral-500">Sem saídas neste mês.</p>;
  return (
    <div className="h-64" role="img" aria-label="Saídas por categoria">
      <ResponsiveContainer>
        <PieChart>
          <Pie data={data} dataKey="value" nameKey="name" innerRadius="55%" outerRadius="85%" stroke="#0a0a0a">
            {data.map((_, i) => <Cell key={i} fill={PALETTE[i % PALETTE.length]} />)}
          </Pie>
          <Tooltip formatter={(v: number) => brl(v)} contentStyle={{ background: "#141414", border: "1px solid #262626" }} />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}

export function FlowBars({ data }: { data: { label: string; income: number; expense: number }[] }) {
  return (
    <div className="h-64" role="img" aria-label="Entradas e saídas dos últimos 12 meses">
      <ResponsiveContainer>
        <BarChart data={data}>
          <XAxis dataKey="label" stroke="#737373" fontSize={12} />
          <YAxis stroke="#737373" fontSize={12} width={44} />
          <Tooltip formatter={(v: number) => brl(v)} contentStyle={{ background: "#141414", border: "1px solid #262626" }} />
          <Legend />
          <Bar dataKey="income" name="Entradas" fill="#22c55e" radius={[4, 4, 0, 0]} />
          <Bar dataKey="expense" name="Saídas" fill="#ef4444" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
