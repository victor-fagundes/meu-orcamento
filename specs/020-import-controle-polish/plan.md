# Implementation Plan: Import Controle Financeiro Polish

**Branch**: `020-import-controle-polish` | **Date**: 2026-11-16 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `/specs/020-import-controle-polish/spec.md`

## Summary

Correct Controle Financeiro import so section/bill headers fix **`dataTransacao`**
year/day inference (not “today” alone), while **competência** follows PRD 5.7 / D-04
(`competenciaCartao` / `competenciaMeio`) — PM rethink Option B after baseline
realignment. Planejamento prefers real planning sheets (not Relatórios) with
**merge-only** non-empty months. Vertical slice: detect → preview (dates + post-rule
competência) → separate confirms → navigate. Amend current 014/015 text; fixture
tests. Closes GAP-001 and GAP-002 after PM smoke.

## Technical Context

**Language/Version**: TypeScript (strict), Next.js 15 App Router

**Primary Dependencies**: Existing import stack — `src/domain/import-planilha.ts`,
`src/application/import-planilha.ts`, `src/components/import-planilha-panel.tsx`,
spreadsheet parse helpers, Vitest, Drizzle/PGlite

**Storage**: Existing `lancamentos.competencia` / `itens.planoCentavosJson` (integer
centavos); no new tables

**Testing**: Vitest domain tests against in-repo fixture; PM UI smoke via quickstart

**Target Platform**: Local Meu Orçamento web app (demo user)

**Project Type**: Web application — domain + application + UI polish (amend)

**Performance Goals**: Same as current import (≤10 MB workbook; preview ≤200 rows)

**Constraints**: Domain purity; integer cents; no float money; separate confirms;
FR-010/011 out of scope; workspace artifacts in-repo only

**Scale/Scope**: One reference workbook; card sheet + planning sheet paths; amend
notes on 014/015

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Gate | Status | Notes |
|------|--------|-------|
| I. Domain Purity | PASS | Date/section/sheet/plan preview logic stays in `src/domain` |
| II. Integer Money | PASS | Plan/lancamentos remain integer centavos; merge uses cents arrays |
| III. Spec-Driven Delivery | PASS | 020 active; 014/015 brief amend; status → `ready` before code |
| IV. Vertical Slice | PASS | Domain + application commit rules + UI preview/confirm/nav |
| V. Simplicity & Isolation | PASS | Extend existing import modules; no new service layer |

**Post-design re-check**: PASS — contracts are preview/commit shapes + UI outcomes;
fixture path documented; no unjustified complexity.

**Post-rethink (2026-11-16 evening)**: Option B — cartão competência; section aids
dates only. Spec/research/data-model/contracts/tasks/quickstart updated; no new
feature number.

## Project Structure

### Documentation (this feature)

```text
specs/020-import-controle-polish/
├── plan.md
├── research.md
├── data-model.md
├── quickstart.md
├── contracts/
│   ├── import-preview-commit.md
│   └── amend-014-015.md
└── checklists/requirements.md
```

### Source Code (repository root)

```text
src/domain/import-planilha.ts          # section competência, pickBestSheet prefer, dates
src/domain/import-planilha.test.ts
src/domain/import-planilha.fixture.test.ts
src/application/import-planilha.ts     # commit uses competenciaFatura when set; merge plan
src/components/import-planilha-panel.tsx  # sheet path, preview dates, post-import link
fixtures/controle-financeiro-reference.xlsx  # or documented alias of existing fixture
specs/014-import-planilha/spec.md      # brief Amend (020)
specs/015-import-planejamento/spec.md  # brief Amend (020)
docs/PRODUCT_GAP_BACKLOG.md            # close GAP-001/002 after smoke
```

**Structure Decision**: Single Next app; change existing import vertical slice only.
No new packages.

## Complexity Tracking

> No constitution violations — table intentionally empty.
