"use client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { transactionSchema, type TransactionInput } from "@/lib/validators";
import { EXPENSE_CATEGORIES, INCOME_CATEGORIES } from "@/lib/categories";

export type Tx = TransactionInput & { id: string };

export function TransactionForm({ initial, defaultType, onDone }: {
  initial?: Tx; defaultType: "INCOME" | "EXPENSE"; onDone: () => void;
}) {
  const { register, handleSubmit, watch, formState: { errors, isSubmitting } } = useForm<TransactionInput>({
    resolver: zodResolver(transactionSchema),
    defaultValues: initial
      ? { ...initial, date: String(initial.date).slice(0, 10) }
      : { type: defaultType, date: new Date().toISOString().slice(0, 10), recurring: false, category: "" },
  });
  const type = watch("type");
  const cats = type === "INCOME" ? INCOME_CATEGORIES : EXPENSE_CATEGORIES;

  async function onSubmit(values: TransactionInput) {
    const res = await fetch(initial ? `/api/transactions/${initial.id}` : "/api/transactions", {
      method: initial ? "PUT" : "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(values),
    });
    if (!res.ok) return toast.error("Não foi possível salvar. Tente de novo.");
    toast.success(initial ? "Lançamento atualizado" : "Lançamento adicionado");
    onDone();
  }

  const field = "w-full rounded-lg border border-line bg-bg px-3 py-2";
  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
      <div className="grid grid-cols-2 gap-2" role="radiogroup" aria-label="Tipo">
        {(["INCOME", "EXPENSE"] as const).map((t) => (
          <label key={t} className={`cursor-pointer rounded-lg border p-2 text-center ${type === t ? (t === "INCOME" ? "border-gain text-gain" : "border-loss text-loss") : "border-line text-neutral-400"}`}>
            <input type="radio" value={t} {...register("type")} className="sr-only" />{t === "INCOME" ? "Entrada" : "Saída"}
          </label>
        ))}
      </div>
      <label className="block text-sm">Valor
        <input type="number" step="0.01" inputMode="decimal" className={field} {...register("amount")} />
        {errors.amount && <span className="text-loss">{errors.amount.message}</span>}
      </label>
      <label className="block text-sm">Data
        <input type="date" className={field} {...register("date")} />
      </label>
      <label className="block text-sm">Categoria
        <select className={field} {...register("category")}>
          <option value="">Escolha…</option>
          {cats.map((c) => <option key={c}>{c}</option>)}
        </select>
        {errors.category && <span className="text-loss">{errors.category.message}</span>}
      </label>
      {watch("category") === "Outros" && (
        <label className="block text-sm">Qual categoria?
          <input className={field} {...register("customCategory")} />
        </label>
      )}
      <label className="block text-sm">Descrição (opcional)
        <input className={field} {...register("description")} />
      </label>
      <label className="flex items-center gap-2 text-sm"><input type="checkbox" {...register("recurring")} /> Recorrente</label>
      <button disabled={isSubmitting} className="w-full rounded-xl bg-gain py-3 font-medium text-black disabled:opacity-60">
        {isSubmitting ? "Salvando…" : "Salvar"}
      </button>
    </form>
  );
}
