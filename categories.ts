export const INCOME_CATEGORIES = [
  "Salário", "Freelance / Serviços", "Vendas", "Investimentos / Dividendos",
  "Aluguel recebido", "Presentes / Doações recebidas", "Reembolsos", "Outros",
] as const;

export const EXPENSE_CATEGORIES = [
  "Alimentação / Mercado", "Moradia", "Transporte", "Saúde", "Educação",
  "Lazer / Entretenimento", "Vestuário", "Imprevistos / Emergências",
  "Assinaturas / Serviços", "Dívidas / Empréstimos", "Pets", "Cuidados pessoais",
  "Presentes / Doações", "Impostos / Taxas", "Outros",
] as const;

export const brl = (n: number) =>
  n.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
