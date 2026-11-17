# Tasks — 001 Foundation

Spec: `spec.md` · Status alvo: `verified`

## T1 — Scaffold do app
- [x] Next.js 15 + TS + Tailwind no root do repo
- [x] Estrutura `src/app`, `src/domain`, `src/db`, `src/lib`
- [x] `npm` + scripts `dev`, `test`, `test:e2e` (instalar deps após Node)
- **AC:** base para 101–103

## T2 — Domínio monetário (MO-103)
- [x] `src/domain/money.ts` — `toCents`, `fromCents`, `splitParcelas`
- [x] `src/domain/money.test.ts` — caso 10000/3 e edge cases
- **AC:** AC-103.1, AC-103.2 — *código pronto; rodar Vitest após npm install*

## T3 — Database (MO-103 + prep 102)
- [x] Drizzle + Postgres schema: `users`, `orcamentos`, `itens` (mínimo)
- [x] Campos monetários tipados como integer (`planoCentavos`)
- [ ] Migration inicial (`drizzle-kit generate` + Postgres up)
- **AC:** AC-103.3, AC-102.2 (timestamps)

## T4 — Auth (MO-101)
- [x] Better Auth e-mail/senha (PGlite local; Postgres na nuvem depois)
- [x] Páginas login / cadastro / forgot
- [x] Middleware protege `/app/*`
- [x] Redirect pós-login → `/app/resumo` (placeholder)
- [x] Hook cria `orcamentos` no signup
- **AC:** AC-101.1–101.4 — *signup API 200 no smoke test*

## T5 — Isolamento (MO-102)
- [x] Helper `requireOrcamento(session)` sempre scoped
- [x] Teste (unit) cross-tenant 404
- **AC:** AC-102.1 — *código pronto; rodar Vitest após npm install*

## T6 — Verify
- [ ] Rodar Vitest verde
- [ ] Marcar ACs em `spec.md`
- [ ] Spec status → `implemented` → `verified`
- [ ] Atualizar `docs/HISTORIAS_Meu_Orcamento_v1_0.csv` (MO-101–103 → Done ou In Progress)
