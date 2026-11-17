# Contract: Spec Inventory Document

**Path**: `docs/SPEC_INVENTORY.md`  
**Consumer**: PM, agents (`AGENTS.md` / Spec Kit follow-ups)  
**Producer**: Agent drafts; PM reviews (FR-009). This feature MUST NOT edit
individual `specs/*/spec.md` files (FR-008).

## Required sections

1. **Header** — title, date (ISO `YYYY-MM-DD`), drafter, reviewer (PM).
2. **Sources consulted** — bullet list including PRD, constitution, SDD, decisions,
   and count of `specs/*/spec.md` scanned.
3. **Review depth note** — state that Release A is inventoried with default fit rules;
   deep analysis targets Release B / import smoke (clarify session).
4. **Inventory table** — Markdown table with columns:

| id | slug | title | status | release | fit | notes |
|----|------|-------|--------|---------|-----|-------|

5. **Summary counts** — totals for `aligned` / `drift` / `gap` and by status.
6. **Self-reference** — include `019-project-spec-review` as process row if useful,
   marked fit N/A or aligned when deliverables exist.

## Fit assignment rules (FR-010)

- Release A + status `implemented` or `verified` + **no** known smoke evidence →
  fit = `aligned` (lack of formal `verified` alone is not enough for `drift`).
- Known smoke failure or PRD conflict with evidence → `drift` or `gap`, with a short
  note in `notes`.
- Release B / import rows with open smoke issues → prefer `drift` or `gap` as
  appropriate; do not mark `aligned` while those issues remain.

## Invariants

- Every directory under `specs/` with a `spec.md` MUST appear exactly once (SC-001).
- `fit` MUST be one of `aligned`, `drift`, `gap`.
- `status` MUST match the value declared in that folder’s `spec.md` at review time
  (this document does not change those files).

## Non-goals

- Must not contain implementation plans or code patches.
- Must not delete or rewrite PRD content.
- Must not patch per-feature `spec.md` status/AC checkboxes.
