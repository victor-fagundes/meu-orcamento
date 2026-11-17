# Tasks — 016 Import PDF

Spec: `spec.md` · Status alvo: `verified`

## T1 — Extração (MO-901)
- [x] `src/lib/parse-pdf.ts` (pdfjs, memória, scan detect)
- [x] Action `parsePdfFaturaAction` + log metadados
- **AC:** AC-901

## T2 — Parser + prévia (MO-902)
- [x] `src/domain/import-pdf.ts` genérico + emissor
- [x] Testes Vitest com fixture texto
- **AC:** AC-902

## T3 — Confirmar (MO-903)
- [x] `commitImportPdf` competência/parcelas
- [x] `ImportPdfPanel` editável em Ajustes
- **AC:** AC-903

## T5 — Correção do worker (2026-11-17)
- [x] `src/lib/parse-pdf.ts` aponta `workerSrc` para `pdf.worker.mjs` por caminho de arquivo. `require.resolve` quebra na Vercel (“Cannot read properties of undefined (reading 'resolve')”).
- **AC:** AC-901.1

## T4 — Verify
- [ ] Smoke com PDF real do banco
- [ ] Spec → `verified` após teste do PM
