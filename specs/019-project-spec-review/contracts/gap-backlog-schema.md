# Contract: Product Gap Backlog Document

**Path**: `docs/PRODUCT_GAP_BACKLOG.md`  
**Consumer**: PM (confirms next `/speckit-specify`), agents  
**Producer**: Agent drafts; PM reviews and **must confirm** next slice (FR-005, FR-009).  
This feature MUST NOT edit individual `specs/*/spec.md` (FR-008); use
`action_type = amend_spec` for later work.

## Required sections

1. **Header** — title, date (ISO), link to `docs/SPEC_INVENTORY.md`, draft/review status.
2. **Gaps table** — columns:

| id | title | priority | user_impact | action_type | related_specs | evidence |
|----|-------|----------|-------------|-------------|---------------|----------|

3. **Depth policy** — deep write-ups focus on Release B / import; Release A gaps only
   when smoke evidence exists (not a full PRD re-audit).
4. **Next slice** — exactly one block:

```markdown
## Next slice

**Name**: …
**In scope**:
- …
**Out of scope**:
- …
**Closes gaps**: GAP-…
**Depends on**: …
**PM confirmation**: pending | confirmed (date / note)
```

5. **Parking lot** — remaining P2/P3 gaps listed without blocking next slice.
6. **Compliance note** — statement that no gap proposes skipping SDD or vertical slices
   (SC-004).

## Seed gaps (minimum for SC-002)

Review MUST include at least these themes (ids may vary):

| Theme | Expected priority |
|-------|-------------------|
| Import dates vs Controle Financeiro source | P1 |
| Import planejamento (Gastos Mensais / fixas / variáveis) | P1 |
| Post-import orientation / competência visibility | P2 |
| Release B verify vs `implemented` without `verified` | P2 |

## Completion gate

- Feature 019 is **not complete** while `PM confirmation` is `pending`.
- Confirmation may be a chat “ok/confirmado” recorded in the doc, or an explicit
  line filled by the PM.

## Invariants

- `action_type` ∈ `amend_spec` \| `new_spec` \| `verify_only`.
- Exactly one Next slice section (FR-005).
- No product code instructions (FR-006).
- No edits to `specs/*/spec.md` in this feature (FR-008).
