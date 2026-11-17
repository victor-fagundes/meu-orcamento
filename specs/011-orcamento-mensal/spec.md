# Spec: 011 — Visão Orçamento mensal (MO-401, MO-701, MO-702)

**Status:** `verified`  
**Release:** A  
**Sprint:** 4  
**Histórias:** MO-401, MO-701, MO-702  
**PRD:** 5.3, 5.10, Q-02

## Context

A tela Orçamento é o acompanhamento do mês de competência. Os estados de alerta são os mesmos do Resumo. O limite preventivo padrão é 80% e pode ser trocado em Ajustes, no global ou por categoria.

## Goals

1. Navegar o mês e filtrar por tipo R, F, V ou E.
2. Mostrar categoria expansível, barra desenhada no máximo em 100% e o texto do saldo restante.
3. Aplicar preventivo, atingido, ultrapassado e gasto sem planejado.
4. Banner com o alerta mais grave e sininho com a lista do mês.
5. Toque no item abre o planejamento.

## Non-goals

- Visão Ano (spec 021).
- Push e e-mail.
- Intervalo de datas diferente do mês de competência.

## Domain rules

| Caso | Entrada | Resultado |
|---|---|---|
| Mês | Seta anterior ou próximo | Totais e realizado passam a ser os da competência destino |
| Abaixo do limite | Planejado 10000, gasto 7900, limite 80 | Só o percentual; sem alerta |
| Preventivo | Gasto 8000 de 10000, limite 80 | Texto de alerta preventivo |
| Atingido | Gasto = planejado e planejado > 0 | “Orçamento atingido” |
| Ultrapassado | Gasto 10500 de 10000 | “Estourou” e o excedente de 500 centavos; a barra desenhada para em 100% |
| Sem plano | Planejado 0 e gasto > 0 | “Gasto sem orçamento planejado”, sem percentual |
| Zerado | Planejado 0 e gasto 0 | Sem alerta |
| Limite global | Ajustes salva 70 | O preventivo passa a usar 70 |
| Limite de categoria | Categoria com 50 e global 80 | Essa categoria usa 50; as outras usam 80 |
| Limite inválido | 0, 101 ou vazio | Não grava; permanece o valor anterior |
| Banner | Um ou mais alertas | Mostra o mais grave; se houver outros, mostra a contagem |
| Sininho | Toque | Lista cada alerta do mês com total ou nome da categoria |
| Sininho | Zero alertas | O banner não aparece |

## Acceptance criteria

- [x] AC-401.1 Mês anterior e próximo trocam totais e realizado.
- [x] AC-401.2 Os textos são “Ainda pode gastar”, “Orçamento atingido” ou “Estourou”, conforme a tabela.
- [x] AC-401.3 Item com realizado > 0 e plano 0 mostra “Gasto sem orçamento planejado”.
- [x] AC-401.4 A barra desenhada não passa de 100%.
- [x] AC-401.5 Limite global 70 muda o ponto do preventivo; limite de categoria substitui o global só nessa categoria.
- [x] AC-401.6 O banner mostra o alerta mais grave e a contagem dos demais. O sininho abre a lista do mês.

## Test plan

Unit: `src/domain/consumo.test.ts` e `src/domain/alertas.test.ts`.  
E2E: estourar uma categoria, ver banner e abrir o sininho.

## Open questions

Nenhuma. Q-02: padrão 80, editável, 100 = atingido.
