"use client";
import { useCallback, useEffect, useState } from "react";
import { signOut } from "next-auth/react";
import { AnimatePresence, motion } from "framer-motion";
import { toast } from "sonner";
import { brl } from "@/lib/categories";
import { ExpensePie, FlowBars } from "./charts";
import { TransactionForm, type Tx } from "./transaction-form";

type Summary = {
  month: { income: number; expense: number }; year: { income: number; expense: number };
  months: { label: string; income: number; expense: number }[]; byCategory: { name: string; value: number }[];
};

export function Dashboard() {
  const now = new Date();
  const [ym, setYm] = useState({ y: now.getFullYear(), m: now.getMonth() + 1 });
  const [name, setName] = useState("");
  const [summary, setSummary] = useState<Summary | null>(null);
  const [txs, setTxs] = useState<Tx[] | null>(null);
  const [filter, setFilter] = useState<"ALL" | "INCOME" | "EXPENSE">("ALL");
  const [editing, setEditing] = useState<{ tx?: Tx; type: "INCOME" | "EXPENSE" } | null>(null);

  const load = useCallback(async () => {
    setSummary(null); setTxs(null);
    try {
      const q = `year=${ym.y}&month=${ym.m}`;
      const [s, t] = await Promise.all([fetch(`/api/summary?${q}`), fetch(`/api/transactions?${q}`)]);
      if (!s.ok || !t.ok) throw new Error();
      setSummary(await s.json()); setTxs(await t.json());
    } catch { toast.error("Erro ao carregar os dados."); setSummary({ month: { income: 0, expense: 0 }, year: { income: 0, expense: 0 }, months: [], byCategory: [] }); setTxs([]); }
  }, [ym]);

  useEffect(() => { load(); }, [load]);
  useEffect(() => { fetch("/api/profile").then((r) => r.json()).then((p) => setName(p.displayName)); }, []);

  const shift = (d: number) => setYm(({ y, m }) => { const x = new Date(y, m - 1 + d, 1); return { y: x.getFullYear(), m: x.getMonth() + 1 }; });
  const balance = summary ? summary.month.income - summary.month.expense : 0;
  const yearBalance = summary ? summary.year.income - summary.year.expense : 0;
  const shown = (txs ?? []).filter((t) => filter === "ALL" || t.type === filter);
  const card = "rounded-2xl border border-line bg-card p-4";

  async function rename() {
    const v = prompt("Como quer ser chamado?", name)?.trim();
    if (!v) return;
    const r = await fetch("/api/profile", { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ displayName: v }) });
    r.ok ? (setName(v), toast.success("Nome atualizado")) : toast.error("Nome inválido");
  }
  async function remove(id: string) {
    if (!confirm("Excluir este lançamento?")) return;
    const r = await fetch(`/api/transactions/${id}`, { method: "DELETE" });
    r.ok ? (toast.success("Lançamento excluído"), load()) : toast.error("Não foi possível excluir.");
  }

  return (
    <main className="mx-auto max-w-3xl space-y-4 p-4 pb-28">
      <header className="flex items-center justify-between">
        <button onClick={rename} className="text-xl font-semibold" aria-label="Editar nome">Olá, {name || "…"}!</button>
        <button onClick={() => signOut({ callbackUrl: "/" })} className="text-sm text-neutral-400">Sair</button>
      </header>

      <div className="flex items-center justify-between">
        <button onClick={() => shift(-1)} aria-label="Mês anterior" className="rounded-lg border border-line px-3 py-1">‹</button>
        <span className="font-medium capitalize">{new Date(ym.y, ym.m - 1).toLocaleDateString("pt-BR", { month: "long", year: "numeric" })}</span>
        <button onClick={() => shift(1)} aria-label="Próximo mês" className="rounded-lg border border-line px-3 py-1">›</button>
      </div>

      <motion.section key={`${ym.y}-${ym.m}-${balance}`} initial={{ opacity: 0.4, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }}
        className={`${card} text-center ${balance >= 0 ? "border-gain/40" : "border-loss/40"}`} aria-live="polite">
        <p className="text-sm text-neutral-400">Saldo do mês</p>
        <p className={`text-4xl font-bold ${balance >= 0 ? "text-gain" : "text-loss"}`}>{summary ? brl(balance) : "…"}</p>
        <div className="mt-3 grid grid-cols-2 gap-2 text-sm">
          <p>Entradas <b className="block text-gain">{summary ? brl(summary.month.income) : "…"}</b></p>
          <p>Saídas <b className="block text-loss">{summary ? brl(summary.month.expense) : "…"}</b></p>
        </div>
      </motion.section>

      <section className={card}>
        <h2 className="mb-2 font-medium">Ano de {ym.y}</h2>
        <div className="grid grid-cols-3 gap-2 text-sm">
          <p>Entradas <b className="block text-gain">{summary ? brl(summary.year.income) : "…"}</b></p>
          <p>Saídas <b className="block text-loss">{summary ? brl(summary.year.expense) : "…"}</b></p>
          <p>Saldo <b className={`block ${yearBalance >= 0 ? "text-gain" : "text-loss"}`}>{summary ? brl(yearBalance) : "…"}</b></p>
        </div>
      </section>

      <section className={card}><h2 className="mb-2 font-medium">Saídas por categoria</h2><ExpensePie data={summary?.byCategory ?? []} /></section>
      <section className={card}><h2 className="mb-2 font-medium">Últimos 12 meses</h2><FlowBars data={summary?.months ?? []} /></section>

      <section className={card}>
        <div className="mb-3 flex items-center justify-between">
          <h2 className="font-medium">Lançamentos</h2>
          <select value={filter} onChange={(e) => setFilter(e.target.value as typeof filter)} aria-label="Filtrar por tipo" className="rounded-lg border border-line bg-bg px-2 py-1 text-sm">
            <option value="ALL">Todos</option><option value="INCOME">Entradas</option><option value="EXPENSE">Saídas</option>
          </select>
        </div>
        {txs === null ? <p className="py-6 text-center text-neutral-500">Carregando…</p>
          : shown.length === 0 ? <p className="py-6 text-center text-neutral-500">Nenhum lançamento aqui. Toque em “+ Entrada” ou “− Saída”.</p>
          : <ul className="divide-y divide-line">
              {shown.map((t) => (
                <li key={t.id} className="flex items-center justify-between gap-2 py-3">
                  <div className="min-w-0">
                    <p className="truncate">{t.category === "Outros" && t.customCategory ? t.customCategory : t.category}</p>
                    <p className="truncate text-xs text-neutral-500">{new Date(t.date).toLocaleDateString("pt-BR", { timeZone: "UTC" })}{t.description ? ` · ${t.description}` : ""}</p>
                  </div>
                  <b className={t.type === "INCOME" ? "text-gain" : "text-loss"}>{t.type === "INCOME" ? "+" : "−"}{brl(Number(t.amount))}</b>
                  <button onClick={() => setEditing({ tx: t, type: t.type })} aria-label="Editar" className="px-1">✎</button>
                  <button onClick={() => remove(t.id)} aria-label="Excluir" className="px-1 text-loss">✕</button>
                </li>
              ))}
            </ul>}
      </section>

      <div className="fixed inset-x-0 bottom-0 flex gap-2 border-t border-line bg-bg/95 p-3 backdrop-blur">
        <button onClick={() => setEditing({ type: "INCOME" })} className="flex-1 rounded-xl bg-gain py-3 font-medium text-black">+ Entrada</button>
        <button onClick={() => setEditing({ type: "EXPENSE" })} className="flex-1 rounded-xl bg-loss py-3 font-medium text-white">− Saída</button>
      </div>

      <AnimatePresence>
        {editing && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-10 flex items-end bg-black/70 sm:items-center sm:justify-center" onClick={() => setEditing(null)}>
            <motion.div initial={{ y: 40 }} animate={{ y: 0 }} exit={{ y: 40 }} onClick={(e) => e.stopPropagation()} role="dialog" aria-modal="true"
              className="max-h-[90dvh] w-full overflow-y-auto rounded-t-2xl border border-line bg-card p-4 sm:max-w-md sm:rounded-2xl">
              <TransactionForm initial={editing.tx} defaultType={editing.type} onDone={() => { setEditing(null); load(); }} />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}
