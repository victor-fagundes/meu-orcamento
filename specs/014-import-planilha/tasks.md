# Tasks — 014 Import planilha

Spec: `spec.md` · Status alvo: `verified`

## T1 — Domínio + parse (MO-801)
- [x] `src/domain/import-planilha.ts` — CSV, layout, map, preview, duplicatas
- [x] `src/lib/parse-spreadsheet.ts` — CSV/XLSX/XLS/ODS ≤ 10 MB
- [x] Testes Vitest (`;`, VF, duplicata)
- **AC:** AC-801

## T2 — Prévia + UI mapeamento (MO-802)
- [x] Application `previewImportLancamentos`
- [x] Actions `parseImportFileAction` / `previewImportAction`
- [x] `ImportPlanilhaPanel` em Ajustes
- **AC:** AC-802

## T3 — Confirmar (MO-803)
- [x] `commitImportLancamentos` + `importVfPlano`
- [x] `confirmImportAction` + relatório na UI
- **AC:** AC-803

## T4 — Verify
- [ ] Smoke manual em Ajustes (upload → prévia → confirmar)
- [ ] Spec status → `verified` após teste do PM
