# Contract: Orçamento no Android

## Leitura

`GET /api/v1/resumo?competencia=YYYY-MM`

Cada item de `totais.porTipo` e `totais.porGrupo` inclui `frase`. Os centavos continuam os da 028.

## Plano

`GET /api/v1/plano?competencia=YYYY-MM` devolve `planoCentavos` com 12 inteiros.

`PUT /api/v1/plano` recebe `itemId` e `mesesCentavos` de 12 inteiros maiores ou iguais a zero. Texto que não vira centavos não gera PUT.

## Arquivar

`DELETE /api/v1/itens?id=` arquiva. Não apaga lançamentos.

## Sheet

Foco no valor do mês aberto. Sem seleção do texto. Cancelar não grava.
