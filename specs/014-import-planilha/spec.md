# Spec: 014 — Importação de planilha (MO-801, MO-802, MO-803)

**Status:** `verified`  
**Release:** B  
**Histórias:** MO-801, MO-802, MO-803  
**PRD:** 5.12, D-03, D-05

## Context

A planilha entra por Ajustes, passa por prévia e só grava na confirmação. Duplicata é regra da D-05, não um bloqueio mudo.

## Goals

1. Aceitar CSV, XLSX, XLS e ODS de até 10 MB.
2. Detectar layout de lançamentos, Vida Financeira ou plano, e sugerir o mapeamento.
3. Mostrar prévia com o motivo da linha rejeitada.
4. Marcar duplicata e não importá-la, a menos que o usuário peça.

## Non-goals

- Gravar sem confirmação.
- Sobrescrever lançamento existente.
- PDF (spec 016).
- O plano mensal em si (spec 015), além de reconhecer o layout.

## Domain rules

| Caso | Entrada | Resultado |
|---|---|---|
| Tamanho | Arquivo > 10 MB | Erro “Arquivo maior que 10 MB.” e nada é lido para gravar |
| CSV | UTF-8 ou Latin-1, vírgula ou ponto e vírgula | Linhas com data, valor e descrição |
| Aba | Planilha com mais de uma aba | O usuário escolhe a aba antes da prévia |
| Layout | Cabeçalho Vida Financeira ou de plano | O tipo de layout detectado aparece antes da prévia |
| Linha inválida | Data ou valor inválido | A prévia mostra o motivo e a linha não entra na confirmação |
| Duplicata | Mesma data, mesmos centavos, descrição igual depois de trim, minúsculas e sem acento, mesmo meio | A prévia marca “Duplicata”; a confirmação padrão não grava essa linha |
| Forçar | Usuário marca importar duplicatas | Essas linhas são gravadas |
| Confirmação | Usuário cancela | Nenhum lançamento novo |

## Acceptance criteria

- [x] AC-801.1 CSV UTF-8 e Latin-1, com vírgula ou ponto e vírgula, gera linhas.
- [x] AC-801.2 Arquivo maior que 10 MB devolve o erro da tabela e não grava.
- [x] AC-801.3 Layout Vida Financeira e layout de plano são reconhecidos.
- [x] AC-802.1 Linha inválida aparece na prévia com o motivo.
- [x] AC-802.2 Cancelar a prévia não grava.
- [x] AC-803.1 Duplicata pela D-05 fica marcada e, sem o pedido de forçar, não é importada.
- [x] AC-803.2 Com “importar duplicatas”, a linha duplicada é gravada.
- [x] AC-803.3 A confirmação informa quantas linhas foram importadas, ignoradas e rejeitadas.

## Test plan

Unit: `src/domain/import-planilha.test.ts`, inclusive “Açúcar” = “acucar”.

## Amend (020)

- Cabeçalhos de seção/fatura do Controle Financeiro melhoram o ano/dia de `dataTransacao`.
- A competência gravada segue PRD 5.7 / D-04 (fechamento do cartão), igual ao lançamento manual — a seção Excel não sobrescreve.
- A prévia mostra a competência pós-regra que será salva. Trocar o cartão destino atualiza essa competência antes de confirmar.
- Data abreviada sem ano e sem seção acima da linha não entra como aceita; a prévia diz que o ano não veio da planilha.
- A confirmação reconstrói a prévia no servidor (linhas + mapa + meio). Não grava meio, valor, aceite ou duplicata vindos da prévia do cliente.
- [x] AC-020-014 Seção auxilia o ano da data; competência via regra do cartão na confirmação

## Open questions

Nenhuma. D-05.
