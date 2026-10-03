import { z } from "zod";
export const transactionSchema = z.object({
  type: z.enum(["INCOME", "EXPENSE"]),
  amount: z.coerce.number().positive("Informe um valor maior que zero"),
  date: z.string().min(1, "Informe a data"),
  category: z.string().min(1, "Escolha a categoria"),
  customCategory: z.string().max(40).optional().nullable(),
  description: z.string().max(200).optional().nullable(),
  recurring: z.boolean().default(false),
});
export type TransactionInput = z.infer<typeof transactionSchema>;
