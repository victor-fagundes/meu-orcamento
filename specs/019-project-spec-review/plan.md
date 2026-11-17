# Implementation Plan: Project Specification Review

**Branch**: `019-project-spec-review` | **Date**: 2026-11-16 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `/specs/019-project-spec-review/spec.md`

## Summary

Produce durable product documentation that inventories all feature specs (fit:
aligned / drift / gap), captures PM smoke findings (especially Release B import),
and designates exactly one next delivery slice — without changing application code
or individual `specs/*/spec.md` files. Agent drafts; PM reviews and must confirm
the next slice. Release A defaults to `aligned` without contrary smoke evidence;
deep gaps focus on Release B / import. Deliverables: `docs/SPEC_INVENTORY.md` +
`docs/PRODUCT_GAP_BACKLOG.md`.

## Technical Context

**Language/Version**: Markdown documentation (Portuguese, PM-facing)

**Primary Dependencies**: Existing sources of truth — PRD, ARCHITECTURE, SDD,
DECISOES, constitution, `specs/*/spec.md`, AGENTS.md; smoke notes from PM sessions

**Storage**: Git-tracked Markdown files under `docs/` (no database)

**Testing**: Manual checklist in `quickstart.md` against FR/SC; no automated suite

**Target Platform**: Repository documentation consumed in Cursor / GitHub

**Project Type**: Process / governance deliverable (not a runtime app feature)

**Performance Goals**: Inventory completable in one focused PM session (&lt; 2 h)

**Constraints**: MUST NOT implement product code; MUST obey constitution SDD and
vertical-slice rules when proposing follow-ups; workspace artifacts only in-repo

**Scale/Scope**: Specs 001–018 (+ 019 self); Release A + B; known import smoke gaps

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Gate | Status | Notes |
|------|--------|-------|
| I. Domain Purity | PASS | No domain/runtime code in this feature |
| II. Integer Money | PASS | N/A (docs only); follow-ups that touch money MUST cite cents rule |
| III. Spec-Driven Delivery | PASS | Review reinforces specs; follow-ups require new/amended specs before code |
| IV. Vertical Slice | PASS | Follow-up slices in gap list MUST be vertical; no API-only proposals |
| V. Simplicity & Isolation | PASS | Single review doc set; no new tooling |

**Post-design re-check**: PASS — contracts are document schemas only; no unjustified
complexity.

**Post-clarify alignment (2026-11-16)**: Contracts + quickstart updated to match
Clarifications session (docs-only, PM confirmation gate, R-B deep gaps, agent draft,
R-A default aligned).

## Project Structure

### Documentation (this feature)

```text
specs/019-project-spec-review/
├── plan.md
├── research.md
├── data-model.md
├── quickstart.md
├── contracts/
│   ├── inventory-schema.md
│   └── gap-backlog-schema.md
└── checklists/requirements.md
```

### Source Code (repository root)

```text
docs/
├── PRD_Meu_Orcamento_v1_0.txt          # read-only input
├── ARCHITECTURE_Meu_Orcamento.md       # read-only input
├── SDD_Meu_Orcamento.md                # read-only input
├── DECISOES_ASSUMIDAS_v1_0.md          # read-only input
├── SPEC_INVENTORY.md                   # OUTPUT: inventory table
└── PRODUCT_GAP_BACKLOG.md              # OUTPUT: gaps + next slice

specs/*/spec.md                         # read-only inputs for inventory
.specify/memory/constitution.md         # governance input
AGENTS.md                               # operating guidance input
```

**Structure Decision**: Documentation-only feature. No changes under `src/`.
Outputs are two Markdown files in `docs/` with schemas defined in `contracts/`.

## Complexity Tracking

> No constitution violations — table intentionally empty.
