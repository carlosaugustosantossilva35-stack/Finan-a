# Controle financeiro

Next.js 14 (App Router) · TypeScript · Tailwind · NextAuth (Google) · Prisma + PostgreSQL · React Hook Form + Zod · Recharts · Framer Motion · Sonner

## Como rodar
1. `npm install`
2. Copie `.env.example` para `.env` e preencha (veja abaixo).
3. `npx prisma db push`
4. `npm run dev` → http://localhost:3000

## Variáveis de ambiente
- `DATABASE_URL`: PostgreSQL (local, Neon ou Supabase).
- `NEXTAUTH_URL`: `http://localhost:3000` (na Vercel, a URL do site).
- `NEXTAUTH_SECRET`: `openssl rand -base64 32`.
- `GOOGLE_CLIENT_ID` / `GOOGLE_CLIENT_SECRET`: Google Cloud Console → APIs e serviços → Credenciais → ID do cliente OAuth (aplicativo da Web). URI de redirecionamento: `{NEXTAUTH_URL}/api/auth/callback/google`.

## Deploy (Vercel)
Importe o repositório, adicione as mesmas variáveis e use o banco hospedado. O `build` já roda `prisma generate`.

## Arquitetura
- `src/app/api/*`: rotas REST. Toda rota valida a sessão e filtra por `userId`, então um usuário nunca acessa dados de outro.
- `/api/summary`: totais do mês, do ano e dos últimos 12 meses, mais saídas por categoria, em uma única chamada.
- `src/lib/validators.ts`: um schema Zod compartilhado entre formulário e API.
- `src/components`: `dashboard` (tela principal), `transaction-form`, `charts`.
- Datas são gravadas ao meio-dia UTC para não mudar de dia por fuso horário.

## Ainda não incluído
Lançamentos recorrentes são só marcados (flag); não são gerados automaticamente a cada mês.

## Instalar como app (PWA)
Depois do deploy em HTTPS (Vercel):
- **Android/Chrome:** botão "Instalar app" no topo, ou menu ⋮ → Instalar app.
- **iPhone/Safari:** Compartilhar → Adicionar à Tela de Início.
O app abre em tela cheia, com ícone próprio. Os dados continuam na nuvem, então precisa de internet para ver e salvar lançamentos.
