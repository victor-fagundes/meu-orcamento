# Data model: Trazer e levar dados no Android

## Prévia

Estado local, apagado no cancelar e depois do confirmar.

| Campo | Regra |
|-------|--------|
| Linhas | As que `preview` devolve. Nada é gravado ainda. |
| Escolha de grupo | Obrigatória quando a linha pede. Sem escolha, a linha não entra no confirm. |
| abrirCompetencia | Só na resposta do confirm de lançamentos. Nulo quando não há competência gravada. |

## Arquivo de saída

O corpo de `export/csv` ou `export/json` da mesma conta. Sem lançamentos, a tela diz isso e não oferece um arquivo como se houvesse movimento.
