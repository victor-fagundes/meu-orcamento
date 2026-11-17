# Quickstart: Validate Project Specification Review

## Prerequisites

- Repo `meu-orcamento` with `specs/001`…`019` present
- Read access to `docs/PRD_*`, `docs/SDD_*`, `docs/DECISOES_*`,
  `.specify/memory/constitution.md`
- Agent available to draft; PM available to review and confirm next slice

## Steps

1. **Inventory (agent draft)**  
   Create/update `docs/SPEC_INVENTORY.md` per
   [contracts/inventory-schema.md](./contracts/inventory-schema.md).  
   - Scan every `specs/*/spec.md` status line.  
   - Release A without smoke evidence → fit `aligned`.  
   - Do **not** edit individual `specs/*/spec.md`.

2. **Gaps (agent draft)**  
   Create/update `docs/PRODUCT_GAP_BACKLOG.md` per
   [contracts/gap-backlog-schema.md](./contracts/gap-backlog-schema.md).  
   - Deep gaps: Release B / import smoke.  
   - Seed themes: dates, planejamento, competência UX, B not verified.

3. **PM review**  
   PM adjusts fit/priorities if needed.

4. **Next slice + confirmation (hard gate)**  
   Fill exactly one Next slice block with `PM confirmation: pending`, then obtain
   explicit PM confirmation and set `confirmed` (date/note).  
   Without confirmation, 019 is not done.

5. **AGENTS pointer (optional)**  
   One-line in `AGENTS.md` Ordem de trabalho pointing to the backlog doc.

## Pass criteria (map to SC)

| Check | SC |
|-------|-----|
| Inventory row count = number of `specs/*/spec.md` | SC-001 |
| Import/planning smoke themes present as gaps | SC-002 |
| PM confirms (or corrects) next slice in &lt; 2 min | SC-003 |
| No gap says “skip spec” or “API only” | SC-004 |
| Files under `docs/`; no `specs/*/spec.md` edits | SC-005 / FR-008 |

## Out of scope for this validation

- Changing `src/**` or re-running import parsers
- Bulk-amending feature specs’ status/ACs (those are follow-up `amend_spec` items)
- Marking Release B `verified` without a dedicated smoke feature
