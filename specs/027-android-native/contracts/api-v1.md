# Contract: API v1 (JSON)

## Purpose

Stable HTTP surface for the Android client. Handlers authenticate the Better Auth session, resolve `orcamentoId`, and call `src/application/*`. **No domain logic in the handler.**

Base path: `/api/v1`  
Auth: session cookie (preferred) or bearer if enabled  
Money: integer **centavos** in JSON  
Content-Type: `application/json` except multipart import uploads and binary export downloads  

## Conventions

| Item | Rule |
|------|------|
| Success | `2xx` + JSON body |
| Auth failure | `401` |
| Validation / domain error | `400` + `{ "error": string }` (or structured errors already used in application) |
| Server failure | `500` + generic error |
| Competência query | `?competencia=YYYY-MM` where a month scope applies |
| Concurrent writes | Last successful write wins; no merge payload |

## Resource map (minimum for FR-002)

| Area | Methods (illustrative) | Application owner |
|------|------------------------|-------------------|
| Resumo | `GET /resumo` | alertas/limites + agregações já usadas no Resumo |
| Lançamentos | `GET/POST /lancamentos`, `PATCH/DELETE /lancamentos/:id` | `application/lancamentos` |
| Orçamento / plano | `GET/PUT` plano lines | `application/plano` |
| Ano | `GET /ano` (or competências agregadas) | same sources as web Ano |
| Itens / catálogo | `GET/POST/...` | `application/itens`, `catalog` |
| Cartões | `GET/POST/PATCH` | `application/cartoes` |
| Limites / alertas | `GET/PUT` | `application/limites`, `alertas-mes` |
| Conta | delete account / profile as web | `actions/conta` parity |
| Import planilha | `POST /import/planilha/parse`, preview, confirm | `application/import-planilha` |
| Import PDF | `POST /import/pdf/parse`, confirm | `application/import-pdf` |
| Export | `GET /export/csv`, `GET /export/json` | `application/export-orcamento` |

Exact path names may be grouped during implementation; the **behavior** must match web acceptance for the same account.

## Money example

```json
{
  "id": "…",
  "valorCentavos": 1299,
  "competencia": "2026-11",
  "dataTransacao": "2026-11-10"
}
```

Forbidden: `"valor": 12.99` as the stored/transport amount.

## Import limits

Same as web hosting: **4 MB** max upload; clear error if exceeded or network fails mid-upload.

## Web coexistence

Server Actions remain for the Next UI. API v1 is additive. Both must call the same application functions so web and Android stay consistent.
