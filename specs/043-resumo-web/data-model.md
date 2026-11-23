# Data Model: Resumo web

Não há tabela nova, coluna nova nem migração. O mês continua na query `mes`. O lançamento já guarda `dataTransacao`, `descricao`, `valorCentavos`, `meio`, `cartaoId` e `competencia`. A página passa a ler data e descrição. Tudo continua filtrado pelo `orcamentoId` da sessão.

## Leitura do mês

O que a página já carrega, mais a data e a descrição de cada lançamento da competência.

| Dado | Regra |
|---|---|
| Item ativo | `tipo`, `grupo`, plano do mês em centavos |
| Lançamento | centavos, tipo e grupo do item, meio, cartão, data, descrição, competência |
| Alerta | a lista que `alertasDoMes` já devolve para o mês inteiro |
| Cartão ativo | id e apelido, para o chip de pagamento |

Receita planejada zero e zero lançamentos, antes de filtrar, é o mês vazio. Despesa planejada não impede o vazio.

## Disponível

Derivado. Não é coluna.

| Situação | Valor |
|---|---|
| Pagamento em Todas | `aindaPodeGastarCentavos` de `totaisDoMes` |
| Outro pagamento | ausente na tela, mostrado como "—" |
| Planejado de despesas zero, pagamento em Todas | o mesmo saldo, sem percentual |

O rótulo é sempre "Disponível neste mês", inclusive quando o centavo é negativo.

## Cartão de tipo

Quatro, na ordem Receitas, Fixas, Variáveis, Anuais. O realizado é a soma do tipo no recorte. O planejado é a soma do tipo, ou ausente quando o pagamento não é Todas. Na tela, os centavos são cortados. Ativar abre o Orçamento do mesmo mês com `tipo` `R`, `F`, `V` ou `E`.

## Filtro

Não é gravado. Mora na query de `/app/resumo`.

| Chave | Ausente | Preenchida |
|---|---|---|
| `mes` | competência de hoje | `AAAA-MM` válido; inválido cai na de hoje |
| `tipo` | Todas | `R`, `F`, `V` ou `E`. Só o gráfico, o detalhe e a média |
| `pagamento` | Todas | `deb`, `pix`, `din` ou `cartao:<id>` de um cartão ativo |
| `categoria` | Todas | grupo de um item ativo |

Valor desconhecido volta a Todas. Limpar apaga `tipo`, `pagamento` e `categoria` e mantém `mes`.

Categoria recorta disponível, cartões, gráfico, detalhe e média. Não recorta o alerta. Tipo não recorta disponível nem cartão. Pagamento troca o planejado e o disponível pelo traço e recorta o gasto.

## Semana

Derivada da competência e da data do lançamento de despesa. Não é tabela.

| Semana | Dias |
|---|---|
| 1 | 1–7 |
| 2 | 8–14 |
| 3 | 15–21 |
| 4 | 22–28 |
| 5 | 29 até o último dia, só se o mês tem esses dias |

Data da competência fora do mês: anterior entra na semana 1; posterior entra na última semana existente. Receita não entra na soma. A média é centavos inteiros, no centavo mais próximo.

## Alerta

A lista do mês, sem filtro. A tela não cria nível nem frase. Zero itens: o sininho não mostra quantidade.

## Preferência de ocultar

Uma chave neste navegador: `mo-ocultar-valores`. `"1"` oculta. Qualquer outra leitura mostra. Vale ao trocar o mês. Outro navegador começa mostrando. Não há coluna na conta.

## O que não é entidade

- Banner. Esta tela não o guarda e não o mostra.
- Rosca, barras de planejado × realizado, Insights e indicador de dívida.
- Intervalo de datas.
- Edição do lançamento a partir do detalhe da semana. Isso é a história 045.
