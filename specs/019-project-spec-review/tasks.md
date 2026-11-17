# Tasks: Project Specification Review

**Input**: Design documents from `/specs/019-project-spec-review/`

**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/, quickstart.md

**Tests**: Not requested — validation is manual via `quickstart.md` (no Vitest/Playwright tasks)

**Organization**: Docs-only feature. Tasks grouped by user story; no `src/**` changes; do not edit other `specs/*/spec.md` (FR-008).

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g. US1, US2, US3)
- Include exact file paths in descriptions

## Path Conventions

- Outputs: `docs/SPEC_INVENTORY.md`, `docs/PRODUCT_GAP_BACKLOG.md`
- Inputs (read-only): `specs/*/spec.md`, `docs/PRD_*`, `docs/SDD_*`, `docs/DECISOES_*`, `.specify/memory/constitution.md`, `AGENTS.md`
- Contracts: `specs/019-project-spec-review/contracts/`

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Confirm sources and working copy before drafting deliverables

- [x] T001 List every `specs/*/spec.md` path and count (expect 19 including 019) under `specs/`
- [x] T002 [P] Confirm read access to sources of truth: `docs/PRD_Meu_Orcamento_v1_0.txt`, `docs/ARCHITECTURE_Meu_Orcamento.md`, `docs/SDD_Meu_Orcamento.md`, `docs/DECISOES_ASSUMIDAS_v1_0.md`, `.specify/memory/constitution.md`, `AGENTS.md`
- [x] T003 [P] Re-read fit/depth rules in `specs/019-project-spec-review/contracts/inventory-schema.md` and `specs/019-project-spec-review/contracts/gap-backlog-schema.md`

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Collect status/release facts and smoke evidence needed by all stories

**⚠️ CRITICAL**: No draft of deliverable docs until this phase is complete

- [x] T004 Extract from each `specs/*/spec.md` the fields `id`, `slug`, `title`, `status`, and release hint (A / B / infra / process) into a working note (chat or scratch under `specs/019-project-spec-review/` only — do not write `docs/` yet)
- [x] T005 Compile known Release B / import smoke evidence themes for gap seeding: import dates vs Controle Financeiro; planejamento (Gastos Mensais / fixas / variáveis); post-import competência orientation; Release B `implemented` without `verified` — per `contracts/gap-backlog-schema.md` seed table
- [x] T006 Confirm FR-008 constraint: plan will not modify any `specs/*/spec.md` status or AC checkboxes during this feature

**Checkpoint**: Source scan + smoke themes ready — user story drafting can begin

---

## Phase 3: User Story 1 - Inventory of product specs (Priority: P1) 🎯 MVP

**Goal**: Durable inventory of every feature spec with status, release, and fit (`aligned` / `drift` / `gap`)

**Independent Test**: `docs/SPEC_INVENTORY.md` exists; row count equals number of `specs/*/spec.md`; every row has a fit label; Release A without smoke evidence defaults to `aligned` (FR-010)

### Implementation for User Story 1

- [x] T007 [US1] Create `docs/SPEC_INVENTORY.md` with Header (title, ISO date `YYYY-MM-DD`, drafter=agent, reviewer=PM) per `specs/019-project-spec-review/contracts/inventory-schema.md`
- [x] T008 [US1] Add Sources consulted + Review depth note sections to `docs/SPEC_INVENTORY.md` (PRD, constitution, SDD, decisions, count of specs scanned; R-A inventory with default fit; deep analysis targets R-B/import)
- [x] T009 [US1] Fill Inventory table in `docs/SPEC_INVENTORY.md` with columns `id | slug | title | status | release | fit | notes` for every `specs/*/spec.md` (status MUST match each file; fit enum `aligned` \| `drift` \| `gap` per data-model Feature Spec Record)
- [x] T010 [US1] Apply FR-010 fit rules in `docs/SPEC_INVENTORY.md`: Release A + `implemented`/`verified` + no smoke → `aligned`; Release B/import with open smoke → `drift` or `gap` with short `notes` evidence
- [x] T011 [US1] Add Summary counts (totals by fit and by status) and self-reference row for `019-project-spec-review` in `docs/SPEC_INVENTORY.md`

**Checkpoint**: US1 independently testable — PM can open inventory and see 100% coverage (SC-001)

---

## Phase 4: User Story 2 - Capture open product gaps (Priority: P1)

**Goal**: Prioritized gap backlog from smoke + inventory drift, with `action_type` and no SDD/vertical-slice violations

**Independent Test**: `docs/PRODUCT_GAP_BACKLOG.md` lists seed import/planning themes with P1/P2 priorities, user impact, and `action_type` ∈ `amend_spec` \| `new_spec` \| `verify_only` (SC-002, SC-004)

### Implementation for User Story 2

- [x] T012 [US2] Create `docs/PRODUCT_GAP_BACKLOG.md` with Header (ISO date, link to `docs/SPEC_INVENTORY.md`, draft/review status) per `specs/019-project-spec-review/contracts/gap-backlog-schema.md`
- [x] T013 [US2] Add Depth policy section to `docs/PRODUCT_GAP_BACKLOG.md` (deep write-ups = Release B / import; Release A gaps only with smoke evidence)
- [x] T014 [US2] Write Gaps table in `docs/PRODUCT_GAP_BACKLOG.md` with columns `id | title | priority | user_impact | action_type | related_specs | evidence`; include at least seed themes: import dates (P1), planejamento (P1), post-import competência UX (P2), Release B verify (P2); `priority` ∈ `P1` \| `P2` \| `P3`; `action_type` ∈ `amend_spec` \| `new_spec` \| `verify_only`
- [x] T015 [US2] Cross-check inventory `drift`/`gap` rows in `docs/SPEC_INVENTORY.md` against Gaps table in `docs/PRODUCT_GAP_BACKLOG.md` so no inventory drift lacks a gap (or explicit parking-lot note)
- [x] T016 [US2] Add Compliance note to `docs/PRODUCT_GAP_BACKLOG.md` stating no gap proposes skipping SDD or delivering API-only/UI-only slices (SC-004)

**Checkpoint**: US2 independently testable — PM can prioritize follow-ups from the gap table alone

---

## Phase 5: User Story 3 - Agree next delivery slice (Priority: P2)

**Goal**: Exactly one next slice with in/out scope, gap refs, and explicit PM confirmation before 019 closes

**Independent Test**: One Next slice block in `docs/PRODUCT_GAP_BACKLOG.md`; `PM confirmation` moves from `pending` to `confirmed` with date/note after PM says so (FR-005, SC-003)

### Implementation for User Story 3

- [x] T017 [US3] Add exactly one `## Next slice` block to `docs/PRODUCT_GAP_BACKLOG.md` with fields Name, In scope, Out of scope, Closes gaps, Depends on, and `PM confirmation: pending` (default candidate per research: Import Controle Financeiro polish — dates + planejamento; adjust if inventory/gaps show higher impact)
- [x] T018 [US3] Add Parking lot section to `docs/PRODUCT_GAP_BACKLOG.md` listing remaining P2/P3 gaps that do not block the proposed next slice
- [x] T019 [US3] Present Next slice proposal to PM for review; after explicit confirmation, set `PM confirmation: confirmed (YYYY-MM-DD / note)` in `docs/PRODUCT_GAP_BACKLOG.md` — do not mark feature complete while still `pending`
- [x] T020 [US3] Optionally update `AGENTS.md` Ordem de trabalho atual with one line pointing to `docs/PRODUCT_GAP_BACKLOG.md` as next-slice source (do not change other `specs/*/spec.md`)

**Checkpoint**: US3 complete only after PM confirmation recorded — 019 may then advance status in its own `spec.md` during implement/polish

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Validate contracts/quickstart and close process hygiene

- [x] T021 [P] Run manual validation checklist in `specs/019-project-spec-review/quickstart.md` against SC-001…SC-005; fix any doc gaps in `docs/SPEC_INVENTORY.md` / `docs/PRODUCT_GAP_BACKLOG.md`
- [x] T022 [P] Mark acceptance checkboxes in `specs/019-project-spec-review/spec.md` only after PM confirmation; set status toward `implemented` when ACs satisfied (this feature’s own `spec.md` only — FR-008 still forbids editing other specs)
- [x] T023 Verify no product code under `src/**` and no edits to other `specs/*/spec.md` were introduced by this feature (git status review)

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies — start immediately
- **Foundational (Phase 2)**: Depends on Setup — BLOCKS all user stories
- **User Story 1 (Phase 3)**: Depends on Foundational
- **User Story 2 (Phase 4)**: Depends on Foundational; ideally after US1 so inventory drifts feed gaps (T015), but gap seed themes (T014) can start in parallel with US1 table fill
- **User Story 3 (Phase 5)**: Depends on US2 gap table (needs gap ids to close); PM confirmation is the hard gate
- **Polish (Phase 6)**: Depends on US3 confirmation recorded

### User Story Dependencies

- **US1 (P1)**: After Phase 2 — no dependency on US2/US3
- **US2 (P1)**: After Phase 2 — integrate with US1 via T015 cross-check
- **US3 (P2)**: After US2 Next-slice inputs (gap ids); blocked on PM for T019

### Within Each User Story

- Header/structure before table content
- Fit/priority rules applied before summary/compliance
- Draft before PM confirmation

### Parallel Opportunities

- T002 ∥ T003 after T001
- T007–T011 sequential within inventory file (same file — avoid parallel writers)
- After Phase 2: US1 draft and US2 header/depth (T012–T013) can overlap if different agents; T014 should wait for smoke themes (T005)
- T021 ∥ T022 only after T019 confirmed

---

## Parallel Example: After Foundational

```text
# Agent A — US1 inventory
Task: T007–T011 docs/SPEC_INVENTORY.md

# Agent B — US2 shell (same time, different file)
Task: T012–T013 docs/PRODUCT_GAP_BACKLOG.md header + depth policy
# Then serialize T014–T016 and hand off to US3
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1–2
2. Complete Phase 3 (US1) → `docs/SPEC_INVENTORY.md`
3. **STOP and VALIDATE** SC-001 with PM
4. Continue to US2/US3 for full 019 DoD

### Incremental Delivery

1. Setup + Foundational → scan ready
2. US1 → inventory demo
3. US2 → gap backlog demo
4. US3 → next slice + PM confirm → feature complete
5. Polish → quickstart + own AC checkboxes

### Parallel Team Strategy

Not required (solo PM + agent). If parallel: one agent on inventory, one on gap shell; serialize Next slice + PM gate.

---

## Notes

- Docs-only: FR-006 forbids `src/**` product changes
- FR-008: never edit other features’ `specs/*/spec.md` in this work
- `action_type` and `fit` enums are fixed — quote them verbatim in deliverables
- Feature 019 incomplete while `PM confirmation: pending`
- Commit only when PM requests a git commit
