---

description: "Task list for 024 produção na nuvem"
---

# Tasks: Produção na nuvem

**Input**: Design documents from `/specs/024-producao-nuvem/`

**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/, quickstart.md

**Tests**: Vitest só em `src/lib/production-env.test.ts`. Smoke de publicação no `quickstart.md`. Sem Playwright.

**Organization**: US4 (segredo) e a troca de banco bloqueiam todo o resto. US1 e US2 saem juntos na primeira URL. US5 e US6 são o corte de arquivo e o texto de reset.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Pode rodar em paralelo (outro arquivo, sem depender de tarefa incompleta)
- **[Story]**: US1 … US6
- Cada tarefa cita o arquivo

## Path Conventions

- Banco: `src/db/index.ts`, `src/db/postgres.ts`, `src/db/pglite.ts`, `src/db/types.ts`, `drizzle.config.ts`, `drizzle/`
- Auth: `src/lib/auth.ts`, `src/lib/production-env.ts`
- UI: `src/app/app/ajustes/page.tsx`, `src/app/esqueci-senha/page.tsx`, `src/components/import-planilha-panel.tsx`
- Importação: `src/lib/parse-pdf.ts`, `src/lib/parse-spreadsheet.ts`, `src/app/actions/import-pdf.ts`, `src/app/actions/import-planilha.ts`
- Host: `next.config.ts`, `vercel.json`, `.env.example`

---

## Phase 1: Setup

**Purpose**: Liberar a spec e registrar o hosting

- [x] T001 Set `specs/024-producao-nuvem/spec.md` status from `draft` to `ready`
- [x] T002 [P] Keep `vercel.json` region `gru1` for the Next.js function
- [x] T003 [P] Document `DATABASE_URL` (pooled) and `DATABASE_URL_UNPOOLED` (direct) in `.env.example` without real secrets

---

## Phase 2: Foundational (Blocking)

**Purpose**: Produção não abre PGlite nem o segredo de desenvolvimento

**Independent Test**: `productionConfigError` recusa produção sem URL, com o segredo `dev-only-change-me-meu-orcamento-32chars` ou com `http://localhost`. Dev sem `DATABASE_URL` segue no PGlite.

- [x] T004 Keep the production gate in `src/lib/production-env.ts` and cover it in `src/lib/production-env.test.ts`
- [x] T005 Route `src/db/index.ts`: `DATABASE_URL` abre Postgres; ausência em produção lança erro; ausência no dev chama `src/db/pglite.ts`
- [x] T006 [P] Open Neon in `src/db/postgres.ts` with `postgres` `max: 1`, `prepare: false`, `ssl: "require"`
- [x] T007 [P] Keep the local bootstrap and the demo seed inside `src/db/pglite.ts` only
- [x] T008 Point `drizzle.config.ts` at `DATABASE_URL_UNPOOLED`, then `DATABASE_URL`
- [x] T009 Generate `drizzle/` from `src/db/schema.ts` with `npm run db:generate`. No new table
- [x] T010 In `src/lib/auth.ts`, call the production gate, set `trustedOrigins` to `BETTER_AUTH_URL`, and skip logging the reset URL when `NODE_ENV` is `production`

---

## Phase 3: User Story 1 — Usar fora da máquina (P1)

**Goal**: HTTPS, conta nova, sem nota de demo

**Independent Test**: Login de produção não vem preenchido. Ajustes não mostra `data/pglite` nem `demo1234`.

- [x] T011 [US1] Hide the dev note in `src/app/app/ajustes/page.tsx` when `NODE_ENV` is `production`
- [x] T012 [P] [US1] Keep the demo defaults in `src/app/login/page.tsx` behind `NODE_ENV !== "production"`

---

## Phase 4: User Story 2 — Dado sobrevive ao deploy (P1)

**Goal**: Neon em `aws-sa-east-1`, migração antes do deploy, sem copiar `data/pglite`

**Independent Test**: Um lançamento gravado na URL publicada continua depois de um novo deploy.

- [x] T013 [US2] Create the Neon project `meu-orcamento` in `aws-sa-east-1` and keep the pooled URL and the direct URL out of git
- [x] T014 [US2] Run `npm run db:migrate` with `DATABASE_URL_UNPOOLED` before `vercel --prod`

---

## Phase 5: User Story 3 — Isolamento (P1)

**Goal**: Nenhuma query nova. O filtro por `orcamentoId` da sessão permanece

**Independent Test**: Segunda conta não vê o lançamento da primeira

- [x] T015 [US3] Confirm `src/lib/session.ts` still scopes reads and writes by the session `orcamentoId`. Do not add a table

---

## Phase 6: User Story 4 — Segredo de produção (P1)

**Goal**: A publicação recusa configuração incompleta

**Independent Test**: Já coberto por T004. As variáveis entram só no painel da Vercel

- [x] T016 [US4] Set `DATABASE_URL`, `BETTER_AUTH_SECRET` (32+ chars, different from `dev-only-change-me-meu-orcamento-32chars`) and `BETTER_AUTH_URL` `https://…` on the Vercel production environment

---

## Phase 7: User Story 5 — Teto de 4 MB (P2)

**Goal**: Planilha e PDF acima de 4 MB recebem a mensagem do app

**Independent Test**: Arquivo de 5 MB não grava. Arquivo de 1 MB segue a importação atual

- [x] T017 [P] [US5] Set `MAX_PDF_BYTES` in `src/lib/parse-pdf.ts` and `MAX_IMPORT_BYTES` in `src/lib/parse-spreadsheet.ts` to 4 MB
- [x] T018 [P] [US5] Say "4 MB" in `src/app/actions/import-pdf.ts`, `src/app/actions/import-planilha.ts` and `src/components/import-planilha-panel.tsx`
- [x] T019 [US5] Set `serverActions.bodySizeLimit` to `4mb` in `next.config.ts`

---

## Phase 8: User Story 6 — Reset sem terminal (P2)

**Goal**: Produção não promete link no log

**Independent Test**: A frase de produção não cita terminal. O servidor não grava o URL

- [x] T020 [US6] In `src/app/esqueci-senha/page.tsx`, when `NODE_ENV` is `production`, say the email link is not available yet

---

## Phase 9: Polish

**Purpose**: Teste, publicação e status

- [x] T021 Run `npx vitest run src/lib/production-env.test.ts`
- [x] T022 Deploy with `vercel --prod --yes` to region `gru1`
- [x] T023 Set `specs/024-producao-nuvem/spec.md` status to `implemented` after the production URL responds

---

## Dependencies

- Phase 2 blocks every story
- US1, US2 and US4 ship in the same deploy
- US3 has no schema change
- US5 and US6 can land in that same deploy
- T014 runs before T022
- T016 runs before T022

## Parallel example

```text
T006 postgres.ts  | T007 pglite.ts | T017 limites de 4 MB
```

## MVP

US1 + US2 + US4: conta real em HTTPS, dado no Neon, sem segredo de desenvolvimento. US5 e US6 entram no mesmo corte porque o arquivo e o reset quebram no ar se ficarem para depois.

## Validation

- 23 tasks, IDs T001–T023, each with a checkbox and a file or command path
- Story tasks carry US1–US6
- Setup and foundational tasks have no story label
