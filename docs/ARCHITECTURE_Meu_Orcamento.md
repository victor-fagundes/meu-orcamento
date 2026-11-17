# Architecture Decision Record — Meu Orçamento

**Papel:** Dev Architecture  
**Data:** 08/11/2026  
**Escopo:** Release A + preparação Release B  
**Método de entrega:** Spec-Driven Development (SDD)

---

## 1. Princípios de arquitetura

1. **Uma regra de domínio, um lugar** — competência, parcelas e alertas vivem em `domain/`, nunca em componentes de UI.
2. **Centavos são `bigint`/`integer`, nunca `float`** — conversão só na borda (UI ↔ API).
3. **Specs mandam** — código implementa critérios de aceite das histórias; PRD é fonte de verdade de produto.
4. **Mobile-first, API-first** — UI consome a mesma API que a importação usará depois.
5. **Release A sem dependência de import** — parsers entram como módulos isolados na Release B.

---

## 2. Stack recomendada (opinionada)

| Camada | Escolha | Por quê |
|--------|---------|---------|
| **App** | **Next.js 15 (App Router) + TypeScript** | Full-stack num repo; SSR/RSC; deploy simples; um time (você) |
| **UI** | **React 19 + Tailwind CSS 4** | Protótipo já é componentizável; tokens CSS fáceis de portar |
| **Validação** | **Zod** | Contratos compartilhados UI ↔ API ↔ specs |
| **ORM** | **Drizzle ORM** | Tipagem forte, SQL explícito, migrations leves, bom com centavos |
| **DB** | **PostgreSQL** (Neon em produção) · **PGlite** no teste local | Mesma schema Drizzle; teste sem nuvem; prod na nuvem depois |
| **Auth** | **Better Auth** (ou Auth.js se preferir ecossistema Next) | E-mail/senha + sessão; sem vendor lock-in cedo |
| **Testes unitários** | **Vitest** | Competência, parcelas, alertas, mapeamento |
| **Testes E2E** | **Playwright** | Fluxos Sprint 1–3 (login → planejar → lançar) |
| **Monetário** | Inteiros (centavos) + helpers `brl` | PRD §6 |
| **Import planilha (B)** | **SheetJS** (server-side) | Já validado no protótipo |
| **Import PDF (B)** | **pdf-parse** / PDF.js no server | Nunca no client em produção |
| **Deploy** | **Vercel** (app) + **Neon** (DB) | Zero ops no MVP |
| **Telemetria (B)** | **PostHog** (self-host ou cloud) | Eventos do PRD §3 |

### Alternativas rejeitadas (por enquanto)

| Opção | Motivo de corte |
|-------|-----------------|
| Expo / React Native | Mobile web do protótipo cobre o JTBD; nativo dobra custo |
| NestJS + React separado | Overhead de dois deploys para 1 PM-dev |
| Prisma | Drizzle é mais previsível em migrations e raw SQL |
| MongoDB | Modelo relacional (itens → lançamentos → parcelas) pede SQL |
| Supabase Auth + RLS only | Bom fallback; Better Auth mantém domínio no app |
| Float / Decimal JS na regra | Proibido pelo PRD |

---

## 3. Diagrama lógico

```text
┌─────────────────────────────────────────────────┐
│  Browser (PWA-lite)                              │
│  app/(auth) · app/(app)/resumo|orcamento|...     │
└────────────────────┬────────────────────────────┘
                     │ Server Actions / Route Handlers
┌────────────────────▼────────────────────────────┐
│  Application layer                               │
│  use-cases: createLancamento, importPlanilha…    │
└────────────────────┬────────────────────────────┘
                     │
┌────────────────────▼────────────────────────────┐
│  Domain (puro, sem I/O)                          │
│  competencia · parcelas · alertas · saldos       │
└────────────────────┬────────────────────────────┘
                     │
┌────────────────────▼────────────────────────────┐
│  Infrastructure                                  │
│  Drizzle + Postgres · Auth · File parsers (B)    │
└─────────────────────────────────────────────────┘
```

---

## 4. Modelo de dados (esqueleto)

```text
users
  id, email, password_hash, created_at

orcamentos          -- 1:1 com user no MVP
  id, user_id

itens
  id, orcamento_id, tipo (R|F|V|E), grupo, nome
  plano_centavos[12], arquivado, ordem

cartoes
  id, orcamento_id, apelido, dia_fechamento?
  dia_vencimento?, instituicao?, ultimos4?, ativo

lancamentos
  id, orcamento_id, item_id, cartao_id?
  descricao, valor_centavos, data_transacao
  competencia (YYYY-MM)   -- gravada, não recalculada
  meio (deb|pix|din|cartao)
  parcela_n?, parcela_total?, grupo_parcela_id?

limites_alerta
  orcamento_id, global_pct, cats jsonb
```

**Invariantes**
- `valor_centavos` e `plano_centavos` são inteiros ≥ 0.
- `competencia` é gravada no insert; mudança de fechamento não recalcula histórico (PRD 5.7).
- Soft-delete: item/cartão arquivado/inativo; nunca apagar com histórico.

---

## 5. Estrutura de pastas (repo)

```text
# Path canônico (Cursor)
# C:\Users\victo\.cursor\projects\meu-orcamento

meu-orcamento/                  # .cursor/projects/meu-orcamento
├── specs/                      # SDD — fonte operacional
│   ├── 001-foundation/         # ready (Sprint 1)
│   └── ...
├── docs/                       # PRD, arquitetura, sprints, histórias
├── prototype/                  # HTML de referência UX
├── src/                        # Next.js (após scaffold)
├── e2e/
├── AGENTS.md
└── README.md
```

---

## 6. Segurança (MVP)

- Auth obrigatória em todas as rotas `/app/*`.
- Toda query filtra `orcamento.user_id === session.userId`.
- IDs de outro usuário → **404**, não 403.
- PDF/planilha processados em memória; não persistir arquivo (Release B).
- Sem CPF por padrão; HTTPS no deploy.

---

## 7. Non-goals técnicos (Release A)

- Offline / service worker avançado
- Open Finance / sync bancário
- Microserviços
- OCR de imagem
- App store / binário nativo

---

## 8. Decisão aberta (só uma)

**Auth:** Better Auth (recomendado) vs Auth.js.

Recomendação: **Better Auth** — DX atual, tipagem, e-mail/senha simples.

Se quiser zero setup de e-mail no dia 1: magic link + Resend depois; no Sprint 1, login e-mail/senha local basta.
