# Spec: 007 — Criar lançamento (MO-303)

**Status:** `verified`  
**Release:** A  
**Sprint:** 3  
**Histórias:** MO-303  
**PRD:** 5.5, 5.8

## Context

Um lançamento aponta para um item ativo. No cartão, as parcelas nascem juntas, com centavos que somam o total, e a competência de cada uma já gravada.

## Goals

1. O modal pede tipo, item, descrição, valor, data, forma de pagamento e, no cartão, o cartão e as parcelas.
2. Descrição vazia grava o nome do item.
3. A prévia mostra o valor de cada parcela e a competência antes de salvar.
4. O grupo só é gravado se todas as parcelas forem gravadas.

## Non-goals

- Editar (MO-305) e excluir (MO-306).
- Busca da lista (MO-304), além da linha recém-criada aparecer no mês da competência.
- Parcelas em débito, PIX ou dinheiro.
- Mudar o número de parcelas depois de gravar.

## Domain rules

| Caso | Entrada | Resultado |
|---|---|---|
| Descrição vazia | Item “Supermercado”, descrição em branco | Descrição gravada = Supermercado |
| Valor | 0, negativo ou vazio | Não salva; erro no valor |
| Parcelas | Forma diferente de cartão | Campo de parcelas não se aplica; grava 1 lançamento |
| Cartão | Forma cartão sem cartão ativo escolhido | Não salva |
| 100 em 3× | 10000 centavos, 3 parcelas | 3334, 3333 e 3333; soma 10000 |
| Parcelas | 0 ou mais de 60 | Não salva |
| Seletor | Item arquivado ou cartão inativo | Não aparece |
| Falha no meio | Qualquer parcela do grupo não grava | Nenhuma parcela do grupo permanece |

## Acceptance criteria

- [x] AC-303.1 Descrição vazia usa o nome do item.
- [x] AC-303.2 A prévia lista valor e competência de cada parcela antes de salvar.
- [x] AC-303.3 R$ 100,00 em 3× grava 3334, 3333 e 3333 centavos.
- [x] AC-303.4 Item arquivado e cartão inativo ficam fora dos seletores.
- [x] AC-303.5 O grupo é gravado por inteiro ou não é gravado.
- [x] AC-303.6 Valor ≤ 0 não grava.
- [x] AC-303.7 Cartão sem cartão escolhido não grava.
- [x] AC-303.8 Parcela fora de 1–60 não grava.

## Test plan

Unit: divisão de centavos e competência do grupo.  
E2E: salvar R$ 100 em 3× e ver as três linhas.

## Open questions

Nenhuma.
