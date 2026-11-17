# Contract: Trazer e levar dados no Android

## Planilha

1. `POST /api/v1/import/planilha/parse` lê o arquivo. Não grava o orçamento.
2. `POST /api/v1/import/planilha/preview` devolve as linhas.
3. `POST /api/v1/import/planilha/confirm` grava e, para lançamentos, inclui `abrirCompetencia`.

Cancelar para no passo 2.

`abrirCompetencia` segue `competenciaDestinoImport`: o mês corrente se ele foi gravado, senão a competência mais recente. Planejamento não devolve mês de destino.

## PDF

`POST /api/v1/import/pdf/parse` mostra a prévia. `POST /api/v1/import/pdf/confirm` grava. Recusa do servidor não cria lançamento.

## Exportar

`GET /api/v1/export/csv` e `GET /api/v1/export/json`. Falha não entrega arquivo completo.
