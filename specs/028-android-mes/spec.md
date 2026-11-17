# Spec: 028 — Android mostra o mês (correção da 027)

**Status:** `implemented`  
**Release:** Android  
**Sprint:** —  
**Histórias:** correção da 027 (Resumo e Orçamento)  
**PRD:** 5.2, 5.3

## Context

A spec 027 entregou o app Android e a API. O Resumo nativo lista itens e dois rótulos soltos. O Orçamento nativo lista `tipo · grupo · nome` só com o plano. Nenhum dos dois mostra o que a pessoa abre o produto para ver: quanto ainda pode gastar, quanto foi orçado, quanto foi gasto, e o realizado de cada grupo.

O computador já calcula isso. Esta correção não muda a cara do computador e não traz o desenho novo do Android.

## Goals

1. No Android, o Resumo do mês mostra ainda pode gastar, total orçado de despesas e total gasto de despesas.
2. No Android, o Resumo mostra receitas, despesas fixas, despesas variáveis e anuais, cada um com realizado e planejado.
3. No Android, o Orçamento de um tipo mostra cada grupo com planejado, realizado e o que ainda cabe.
4. Esses números são os mesmos da web, na mesma conta e no mesmo mês, em centavos inteiros.
5. O cálculo existe num lugar só. O Android exibe o resultado. Não soma de outro jeito.

## Non-goals

- Redesenhar o computador. Cartões, navegação de cima, gráficos e filtros ficam como estão.
- O desenho nativo da proposta (barra de baixo desenhada de novo, sheet, “Sem movimento”). A lista pode ser simples, desde que os números e os grupos estejam lá.
- Lançamentos, Ano, Ajustes, importação, exportação e login. Continuam como a 027 deixou.
- Filtro de pagamento ou de categoria no Android.
- Editar plano ou arquivar item nesta correção.
- Apagar a 027 ou reabrir o APK, a sessão e a paridade das outras telas.

## Domain rules

Despesas são os tipos fixas, variáveis e anuais. Receita não entra em “ainda pode gastar”, no total orçado nem no total gasto.

| Caso | Entrada | Resultado |
|---|---|---|
| Mês dentro do orçado | Despesas planejadas 10.000 centavos, gasto 4.000 | Ainda pode gastar 6.000 |
| Mês estourado | Despesas planejadas 1.000, gasto 2.500 | Ainda pode gastar −1.500 |
| Receita | Receita planejada 50.000 e lançada 50.000, despesa 0 | Ainda pode gastar 0. A receita aparece só na linha de receitas |
| Tipo | Fixas planejadas 2.000, realizadas 500 | A linha de fixas mostra 500 e 2.000 |
| Grupo | Dois itens em Moradia, planos 1.000 e 700, gastos 400 e 100 | Moradia planejado 1.700, realizado 500, ainda cabe 1.200 |
| Grupo zerado | Item em Educação com plano 0 e sem lançamento | Educação aparece com 0, 0 e ainda cabe 0 |
| Lançamento sem item | Gasto 300 com tipo variável e item que não está na lista | Entra no total gasto e na linha de variáveis. Não cria grupo |
| Centavos | Qualquer valor | Inteiro. Sem fração de real |

“Ainda cabe” no grupo é planejado menos realizado, e pode ser negativo.

Ordem dos grupos: quem tem plano ou realizado maior que zero vem primeiro. Dentro de cada bloco, ordem pt-BR. A ordem dos tipos é receitas, fixas, variáveis, anuais.

## Acceptance criteria

- [x] AC-028.1 No Android, o Resumo do mês mostra ainda pode gastar, total orçado e total gasto das despesas.
- [x] AC-028.2 No Android, o Resumo mostra as quatro linhas de tipo com realizado e planejado.
- [x] AC-028.3 No Android, o Orçamento do tipo escolhido mostra cada grupo com planejado, realizado e o que ainda cabe, inclusive grupo zerado.
- [x] AC-028.4 Trocar o mês no Android atualiza esses números e mantém o tipo escolhido no Orçamento.
- [x] AC-028.5 Os centavos batem com a tabela de regras. Receita não entra no que ainda pode gastar.
- [x] AC-028.6 O computador não muda de cara nesta correção.

## Test plan

Unit: `src/domain/resumo-mes.test.ts` cobre a tabela.  
API: a resposta do mês inclui esses totais, calculados pela mesma função.  
Android: Resumo e Orçamento só exibem esses totais. Se eles não vierem, a tela diz que não carregou, e não inventa soma.  
E2E: não nesta correção.

## Open questions

Nenhuma. O Android exibe o cálculo único do mês. O desenho novo fica para outra spec.

## Design técnico

Omitido. Não há tabela nova nem efeito colateral. A resposta do mês ganha os totais já calculados. O plano por item, para edição, continua no fluxo que já existe.
