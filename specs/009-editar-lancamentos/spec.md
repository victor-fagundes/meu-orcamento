# Spec: 009 — Editar lançamento por escopo (MO-305)

**Status:** `verified`  
**Release:** A  
**Sprint:** 3  
**Histórias:** MO-305  
**PRD:** 5.5

## Context

Editar uma parcela pede o escopo quando ela pertence a um grupo. O valor informado é o valor da parcela, não um novo total da compra.

## Goals

1. Editar valor, descrição, item, forma de pagamento e data.
2. Grupo: “somente esta” ou “esta e as próximas”, com confirmação antes de gravar.
3. “Esta e as próximas” avança a data um mês por parcela, no último dia quando o dia não existe, e recalcula a competência.

## Non-goals

- Mudar a quantidade de parcelas.
- Recalcular as parcelas anteriores ou o total original.
- Excluir (MO-306).

## Domain rules

| Caso | Entrada | Resultado |
|---|---|---|
| À vista | Qualquer campo | Só essa linha muda; não há pergunta de escopo |
| Só esta | 3ª de 6, valor novo | As outras cinco permanecem com valor, data e competência anteriores |
| Esta e as próximas | 3ª de 6 | Mudam a 3ª, a 4ª, a 5ª e a 6ª. A 1ª e a 2ª não mudam |
| Valor | Novo valor por parcela | Cada parcela do escopo recebe esse inteiro; a soma do grupo pode deixar de ser o total original |
| Data | 31/01 na parcela selecionada, escopo “esta e as próximas” | A seguinte fica em 28/02 ou 29/02, conforme o ano; a competência segue a regra do cartão |
| Confirmação | Grupo, usuário cancela | Nenhuma linha muda |
| Número de parcelas | Qualquer edição | O total de parcelas do grupo permanece |

## Acceptance criteria

- [x] AC-305.1 Editar a 3ª de 6 com “só esta” deixa as outras cinco iguais.
- [x] AC-305.2 “Esta e as próximas” altera da selecionada até a última.
- [x] AC-305.3 O valor novo é aplicado por parcela, sem redistribuir o total original.
- [x] AC-305.4 Grupo exige confirmação; cancelar não grava.
- [x] AC-305.5 Data 31/01 com “esta e as próximas” leva a parcela seguinte ao último dia de fevereiro e recalcula a competência.

## Test plan

Unit: escopo de edição e ajuste de fim de mês.  
E2E: confirmar e cancelar a edição da 3ª parcela.

## Open questions

Nenhuma.
