# Spec: 015 — Importar planejamento mensal (MO-804)

**Status:** `verified`  
**Release:** B  
**Histórias:** MO-804  
**PRD:** 5.12

## Context

Uma planilha com colunas de mês atualiza o plano do item, não cria lançamento. O arquivo passa pela mesma prévia da spec 014.

## Goals

1. Layout Vida Financeira (`Tipo|Categoria|Nome` e meses) e layout plano (tipo, categoria, item e meses) gravam `plano[]` em centavos.
2. O mês é reconhecido pelo nome ou pelo número 1–12.
3. Item que não existe pode ser criado quando a opção está ligada.

## Non-goals

- Criar lançamento a partir destas colunas.
- Copiar ano anterior (D-08).
- Gravar valor negativo.

## Domain rules

| Caso | Entrada | Resultado |
|---|---|---|
| Mês | Cabeçalho “Janeiro” ou “1” | A coluna entra no índice 0 do plano |
| Valor | “1.000,50” | 100050 centavos no mês correspondente |
| Negativo ou ilegível | “-10” ou “abc” na célula do mês | Esse mês fica 0 centavos. A linha segue se tipo, categoria e item forem válidos |
| Item novo | Opção de criar itens ligada | O item nasce com os meses informados e os meses ausentes em 0 |
| Item novo | Opção desligada | A linha não cria item e não altera plano |
| Confirmação | Usuário cancela | Nenhum plano muda |

## Acceptance criteria

- [x] AC-804.1 Colunas de mês por nome ou número caem no índice certo do plano.
- [x] AC-804.2 Vida Financeira e o layout tipo/categoria/item atualizam o plano visível no Orçamento depois da confirmação.
- [x] AC-804.3 Sem tipo, categoria e item (e sem preset Vida Financeira), a linha não grava.
- [x] AC-804.4 Cancelar não altera plano.

## Test plan

Unit: `buildPlanoPreview` em `src/domain/import-planilha.test.ts`.

## Amend (020)

- Preferir abas de Gastos Mensais / planejamento a Relatórios.
- Merge: mês com valor positivo atualiza o plano; negativo ou ilegível grava 0 nesse mês do item existente; célula vazia ou zero literal não apaga o valor já gravado. Não limpa o ano inteiro.
- Célula negativa/ilegível continua 0 na prévia (regra acima) e na confirmação.
- [x] AC-020-015 Seleção de aba de planejamento + merge só meses não vazios

## Open questions

Nenhuma.

## Amend (022)

A seção da planilha (Despesas Fixas, Despesas Variáveis, Receitas, Anuais) não vira o grupo do item. O contrato ativo é `specs/022-item-unico/spec.md`: nome único atualiza o item do catálogo; nome inédito cai em Outros; nome ambíguo espera escolha.
