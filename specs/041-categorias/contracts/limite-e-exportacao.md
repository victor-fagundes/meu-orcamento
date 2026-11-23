# Contract: Limite de alerta e exportação

## Limite

`PUT /api/v1/limites` e `salvarLimitesAction` recebem `globalPct` e `cats`.

Cada número, o global e cada categoria enviada, precisa ser inteiro de 1 a 100. `1` e `100` gravam. `0`, `101`, fração (`80.5`) e texto não gravam. A linha `limites_alerta` fica como estava.

Sucesso continua 200 com os limites gravados. Recusa: a action devolve `{ ok: false, error }` e a rota responde 400. O painel atual mostra esse `error` e não mostra “Limites salvos.”

Leitura (`getLimites` e o GET da rota) não reescreve um valor já salvo. `src/domain/reconciliacao.ts` não muda: mês continua orçado menos gasto; ano continua receitas menos despesas.

## Exportação

Usado por `exportCsvAction`, `exportJsonAction`, `GET /api/v1/export/csv` e `GET /api/v1/export/json`.

Há movimento quando a conta tem ao menos um lançamento ou algum mês de algum item com centavos diferentes de zero.

| Caso | Action | API | Arquivo |
|---|---|---|---|
| Sem movimento | `{ ok: false, error: "Não havia movimento para exportar." }` | 400, `{ "error": "Não havia movimento para exportar." }` | nenhum |
| Falha ao montar | `{ ok: false, error: "Arquivo incompleto não é compartilhado." }` | 400, a mesma frase | nenhum, inclusive parcial |
| Com movimento | `{ ok: true, filename, content }` como hoje | 200, corpo CSV ou JSON, cabeçalho de anexo como hoje | o da história 017 |

O painel em `src/components/export-panel.tsx` só chama o download quando `res.ok`. Telemetria `export_iniciado` só dispara nesse sucesso. O arquivo não inclui outra conta. Valores monetários continuam inteiros, em centavos.

A história 017 continua valendo quando há plano diferente de zero e a lista de lançamentos está vazia: o arquivo sai, com lançamentos vazios.
