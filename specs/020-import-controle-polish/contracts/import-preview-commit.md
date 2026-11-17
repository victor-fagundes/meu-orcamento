# Contract: Import Preview & Commit (Controle Financeiro polish)

**Consumers**: `import-planilha-panel` UI, domain tests, PM smoke  
**Producers**: `buildLancPreview` / `buildPlanoPreview`, `commitImportLancamentos`,
`importVfPlano`

## Lancamento preview → commit

### Preview invariants

1. Section headers update date-parsing context; they are not imported as lançamentos.
2. Accepted rows expose `dt` (`dataTransacao`) with year consistent with nearest section
   year when present (FR-001, FR-002).
3. Preview `competencia` MUST equal `competenciaMeio(dt, meio, diaFechamento)` using the
   same inputs commit will use (FR-003, FR-014).
4. Section month MUST NOT be written as competência when it disagrees with the cartão rule.

### Commit invariants

1. `lancamentos.competencia` MUST come from `competenciaMeio` / `competenciaCartao`
   (PRD 5.7 / D-04), never from Excel section alone.
2. `valorCentavos` MUST be integer.
3. Duplicates follow D-05 (rewritten 014).
4. Response includes `competencias[]` actually written; UI MAY link to first/sorted
   entry (FR-007). Full multi-month orientation stays GAP-003 / FR-011.
5. Confirm MUST rebuild preview from rows + column map + selected meio (FR-015).
   A client-supplied preview MUST NOT be the source of persisted `meio`, amount,
   accept/reject, or duplicate.
6. Changing the destination cartão before confirm MUST refresh preview competência
   to the same rule commit will apply (FR-003).

## Planejamento preview → commit

1. Detection MUST NOT treat Relatórios-only as successful plan import (FR-004, FR-006).
2. Commit merges per month: write positive centavos; write 0 when the cell is an
   explicit negative or illegible; leave the stored amount when the cell is blank or
   a literal zero (FR-005, 015).
3. Separate confirm from lancamento path (FR-012).

## Sheet selection

1. UI allows choosing sheet after upload (014).
2. Helpers MAY expose `prefer: "lanc" | "plano"` for default sheet suggestion per path.
3. Card path and plan path MUST NOT silently bind to each other’s sheet.
