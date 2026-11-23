# Data Model: Orçamento web

Não há tabela nova, coluna nova nem migração. O mês, o tipo e as categorias abertas continuam na query. O plano continua nos doze centavos do item. Tudo continua filtrado pelo `orcamentoId` da sessão.

## Leitura do mês

O que a página já carrega para a competência.

| Dado | Regra |
|---|---|
| Item ativo | id, nome, tipo, grupo, doze centavos do plano, centavos do mês, realizado do mês |
| Categoria ativa | nome e tipo. Some da lista quando está arquivada |
| Limite | inteiro de 1 a 100 da conta, e o da categoria quando existe |
| Alerta | a lista que `alertasDoMes` já devolve para o mês inteiro |

Item arquivado não entra. Categoria arquivada não entra.

## Tipo na query

Não é gravado.

| Chave | Ausente ou inválida | Preenchida |
|---|---|---|
| `mes` | competência de hoje | `AAAA-MM` válido |
| `tipo` | `F` | `R`, `F`, `V` ou `E` |
| `aberta` | nenhuma categoria aberta | repetida, uma por nome de categoria aberta daquele tipo |

Trocar de tipo apaga `aberta`. Trocar o mês conserva `tipo` e `aberta`. Voltar a um tipo sem `aberta` começa fechado.

## Categoria na lista

Derivada dos itens ativos do tipo. Não é uma linha nova.

| Campo na tela | Conta |
|---|---|
| Realizado | soma dos realizados dos itens do grupo, no mês |
| Planejado | soma dos planos dos itens do grupo, no mês |
| Frase | `fraseDoEstado` com o limite da categoria, ou o da conta |
| Aberta | o nome está em `aberta` |

Ordem: grupos com realizado ou planejado maior que zero primeiro; os zerados depois. Em cada bloco, ordem alfabética do português. Várias podem estar abertas. Fechar uma não fecha as outras.

## Total do tipo

Derivado. Soma do realizado e do planejado dos itens ativos daquele tipo, no mês. Na tela, os centavos são cortados e a segunda cifra usa "de R$ x planejados".

## Plano do mês

Doze inteiros não negativos, um por mês, já guardados no item. O painel edita o índice da competência aberta.

| Ação | Doze valores |
|---|---|
| Salvar, interruptor desligado | só o mês aberto muda |
| Salvar, interruptor ligado | o mês aberto e cada mês posterior do ano recebem o valor; os anteriores ficam |
| Copiar mês anterior | o mês aberto recebe o valor já gravado do mês anterior. Janeiro não grava |
| Aplicar a todos os meses | os doze recebem o valor do campo |
| Copiar ano anterior | os doze ficam como estão |

Zero é valor gravado. Vazio, negativo e terceira casa não gravam.

## Item novo

Nasce no tipo marcado, no grupo informado, com os doze meses em zero. Se o grupo ainda não é categoria ativa, a categoria nasce na mesma gravação. Depois disso o nome entra em `aberta`.

## Alerta

A lista do mês, sem filtro de tipo. A tela não cria nível nem frase. A frase do banner é a que a lista já traz. A contagem dos demais é derivada: 1 vira "E mais 1 alerta."; 2 ou mais viram "E mais N alertas."

## Preferência de ocultar

A chave que o Resumo já usa: `mo-ocultar-valores`. `"1"` oculta a lista. Qualquer outra leitura mostra. Não há coluna e não há segunda chave. O plano aberto lê o centavo real mesmo com a chave ligada.

## O que não é entidade

- Renomear categoria e arquivar categoria. Continuam para a história 047.
- Desarquivar e reordenar.
- Intervalo de datas.
- Botão flutuante.
- Plano de outro ano.
