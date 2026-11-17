# Tasks: Import Controle Financeiro Polish

**Input**: Design documents from `/specs/020-import-controle-polish/`

**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/, quickstart.md

**Tests**: Domain Vitest against in-repo fixture (SC-001/SC-002); no Playwright unless added later

**Organization**: Vertical slice; US1 dates + cartão competência (Option B); US2 plano; US3 UI

**Baseline note**: Specs 014/015/PRD realigned 2026-11-16; 020 rethink Option B same evening.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: US1 / US2 / US3
- Include exact file paths in descriptions

## Path Conventions

- Domain: `src/domain/import-planilha.ts`, `src/domain/competencia.ts`
- Application: `src/application/import-planilha.ts`
- UI: `src/components/import-planilha-panel.tsx`
- Fixture: `fixtures/controle-financeiro-reference.xlsx` (or alias of existing CF xlsx)
- Specs amend: current `specs/014-import-planilha/spec.md`, `specs/015-import-planejamento/spec.md`

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Mark feature ready and lock reference fixture path

- [x] T001 Set `specs/020-import-controle-polish/spec.md` status to `ready` (constitution III before code)
- [x] T002 [P] Ensure sanitized reference workbook at `fixtures/controle-financeiro-reference.xlsx` (copy/alias/document `fixtures/Controle_Financeiro_Victor_Atualizado.xlsx` per FR-013 and `specs/020-import-controle-polish/quickstart.md`)

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Sheet helper shared by stories; preview competência uses cartão rule inputs

**⚠️ CRITICAL**: No user story coding until this phase completes

- [x] T003 Ensure preview can compute post-rule competência (reuse `competenciaMeio` from `src/domain/competencia.ts` in application/UI preview path — not a persisted section field) per `specs/020-import-controle-polish/data-model.md`
- [x] T004 Extend `pickBestSheet` in `src/domain/import-planilha.ts` with optional `prefer: "lanc" | "plano"` so Relatórios stays penalized and card vs plan defaults can differ (contracts/import-preview-commit.md)

**Checkpoint**: Helpers ready — story work can proceed

---

## Phase 3: User Story 1 - Dates + cartão competência (Priority: P1) 🎯 MVP

**Goal**: Section improves `dataTransacao` year/day; competência = PRD 5.7 / D-04; preview = commit

**Independent Test**: Fixture card sheet → ≥95% rows year matches section context; with cartão fechamento, persisted competência matches `competenciaCartao(dt, diaFechamento)` (FR-014)

### Tests for User Story 1

- [x] T005 [P] [US1] Add/extend unit cases in `src/domain/import-planilha.test.ts` for section header → correct ISO year/day on `dt` (not “today” alone)
- [x] T006 [P] [US1] Extend `src/domain/import-planilha.fixture.test.ts` for SC-001 date-year spot-check (≥20 rows) and assert competência via `competenciaCartao` when fechamento provided (not section month override)

### Implementation for User Story 1

- [x] T007 [US1] Harden `buildLancPreview` / `parseDateCell` / section context in `src/domain/import-planilha.ts` so section/bill labeling drives `dataTransacao` year/day (FR-001, FR-002)
- [x] T008 [US1] Keep `commitImportLancamentos` in `src/application/import-planilha.ts` on `competenciaMeio` / `competenciaCartao` only (FR-014) — do **not** persist Excel section as competência
- [x] T009 [US1] Show preview `dataTransacao` + post-rule competência in `src/components/import-planilha-panel.tsx` matching commit (FR-003); pass cartão fechamento into preview when meio=cartao
- [x] T010 [US1] Run `npx vitest run src/domain/import-planilha.test.ts src/domain/import-planilha.fixture.test.ts src/domain/competencia.test.ts` and fix until US1 assertions pass

**Checkpoint**: US1 independently testable via Vitest + card confirm smoke

---

## Phase 4: User Story 2 - Import planejamento from Gastos Mensais (Priority: P1)

**Goal**: Prefer planning sheets over Relatórios; merge-only non-empty months; clear zero-plan failure

**Independent Test**: Fixture planning sheet → non-zero plan cells; Relatórios-only → not successful plan; merge leaves blank months unchanged

### Tests for User Story 2

- [x] T011 [P] [US2] Add/extend tests in `src/domain/import-planilha.test.ts` for `pickBestSheet(..., prefer: "plano")` avoiding Relatórios and for empty-plan rejection messaging
- [x] T012 [P] [US2] Extend `src/domain/import-planilha.fixture.test.ts` so planning sheet yields `buildPlanoPreview` with ok/`cellsUpdated` > 0 (SC-002)

### Implementation for User Story 2

- [x] T013 [US2] Harden `buildPlanoPreview` / layout detection in `src/domain/import-planilha.ts` so Relatórios-like sheets do not count as successful planejamento (FR-004, FR-006); keep `plano[12]` as integer centavos; align negative→0 with current 015
- [x] T014 [US2] Verify/confirm merge in `src/application/import-planilha.ts` `importVfPlano`: for each month `m`, write only if source `plano[m] > 0`; empty/zero leaves stored value unchanged (FR-005)
- [x] T015 [US2] Wire plan-path default sheet via `prefer: "plano"` in `src/components/import-planilha-panel.tsx` (or upload action) without binding card path to plan sheet (FR-012)
- [x] T016 [US2] Surface clear zero-plan / no-layout explanation in preview UI in `src/components/import-planilha-panel.tsx` (FR-006)
- [x] T017 [US2] Run Vitest fixture/unit tests for plan path and fix until SC-002 expectations pass

**Checkpoint**: US2 independently testable; separate from card confirm

---

## Phase 5: User Story 3 - Preview and confirm end-to-end usable (Priority: P2)

**Goal**: Separate confirms; report counts; reach imported competência from UI

**Independent Test**: UI card confirm then plan confirm; open Lançamentos/Orçamento without guessing URL (quickstart manual)

### Implementation for User Story 3

- [x] T018 [US3] Ensure import panel allows independent card vs planejamento confirms in `src/components/import-planilha-panel.tsx` (FR-012; no single-confirm-both requirement)
- [x] T019 [US3] Keep/confirm post-import report shows accepted/skipped/rejected counts (D-05) and links to `competencias[]` from commit in `src/components/import-planilha-panel.tsx` (FR-007)
- [x] T020 [US3] Verify Lançamentos month nav / `?mes=` (or equivalent) in `src/app/app/lancamentos/page.tsx` + `src/components/lancamentos-view.tsx` reaches imported competência after card confirm
- [x] T021 [US3] Smoke Orçamento view shows merged plan months after plan confirm (manual per `specs/020-import-controle-polish/quickstart.md`)

**Checkpoint**: Full vertical slice usable in ≤10 minutes (SC-003)

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Spec amends on **current** 014/015, backlog close, status

- [x] T022 [P] Add **Amend (020)** note + AC deltas to current `specs/014-import-planilha/spec.md` per `specs/020-import-controle-polish/contracts/amend-014-015.md`
- [x] T023 [P] Add **Amend (020)** note + AC deltas to current `specs/015-import-planejamento/spec.md` per `specs/020-import-controle-polish/contracts/amend-014-015.md`
- [x] T024 Run full quickstart checklist in `specs/020-import-controle-polish/quickstart.md` (Vitest + UI)
- [x] T025 After PM smoke, mark GAP-001 and GAP-002 closed in `docs/PRODUCT_GAP_BACKLOG.md` (SC-005)
- [x] T026 Mark acceptance scenarios in `specs/020-import-controle-polish/spec.md` and set status to `implemented` (then `verified` after PM)

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: Start immediately
- **Foundational (Phase 2)**: After Setup — BLOCKS US1–US3
- **US1 (Phase 3)**: After Foundational — MVP (Option B)
- **US2 (Phase 4)**: After Foundational; serialize domain edits with US1 on `import-planilha.ts`
- **US3 (Phase 5)**: After US1 commit path; preferably after US2 sheet wiring
- **Polish (Phase 6)**: After US1–US3 + PM smoke for T025

### Parallel Opportunities

- T001 ∥ T002
- T005 ∥ T006
- T011 ∥ T012
- T022 ∥ T023

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Phase 1–2
2. Phase 3 US1 (date year + cartão competência)
3. **STOP** — Vitest SC-001 + card UI smoke
4. Continue US2/US3

---

## Phase 7: Correction — Bugbot 2026-11-16

**Purpose**: Close AC gaps found on the implemented slice. GAP-003 (link only the first competência) stays out of scope (FR-011).

- [x] T027 [US1] Reject abbreviated dates with no section year in `buildLancPreview` / `parseDateCell` (`src/domain/import-planilha.ts`) and cover FR-016 in `src/domain/import-planilha.test.ts`
- [x] T028 [US2] Distinguish plan cells in `src/domain/import-planilha.ts`: positive writes cents, explicit negative/illegible writes 0, blank or literal zero keeps the stored month. Use that merge in `importVfPlano` (`src/application/import-planilha.ts`). Test in `src/domain/import-planilha.test.ts` (FR-005)
- [x] T029 [US1] Rebuild lançamento preview inside `confirmImportAction` (`src/app/actions/import-planilha.ts`) from `rowsJson` + `map` + `defaultMeio`; do not persist a client preview (FR-015)
- [x] T030 [US1] Refresh lançamento preview when cartão destino changes in `src/components/import-planilha-panel.tsx`, and drop a stale preview when the column map changes (FR-003)
- [x] T031 Run `npx vitest run src/domain/import-planilha.test.ts src/domain/import-planilha.fixture.test.ts` and recheck US1 scenarios 3–5 and US2 scenario 2 in `spec.md`

---

## Notes

- Integer centavos only
- Do **not** implement section-as-competência (rejected Option A)
- Do not implement GAP-004 verify or GAP-003 redesign
- Commit only when PM requests git commit
- Domain purity: no Next/DB imports in `src/domain/import-planilha.ts`
