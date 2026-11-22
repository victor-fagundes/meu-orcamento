# Spec: 045 — Lançamentos web

**Status:** `ready`  
**Release:** rebuild-web  
**Sprint:** —  
**Depende de:** 040, 042  
**PRD:** 5.5, 5.7, 5.8  
**Branch:** `rebuild-web`

## Context

`/app/lancamentos` lista, busca, cria, edita e exclui lançamentos do mês. A competência de cartão e a divisão de parcelas continuam as de `src/domain/competencia.ts` e da spec de parcelas. Esta história não altera essas regras.

A exclusão com desfazer de 10 segundos já existe no produto. A tela nova mostra o desfazer num `Snackbar`. A ação de excluir não fica solta na linha: ou está no fim da edição, ou dentro de `MenuAcoes`, sempre com `Dialogo`.

## Goals

1. Listar o mês em tabela, com busca e filtros.
2. Registrar e editar no painel lateral, com parcelamento e prévia.
3. Excluir com confirmação e desfazer por 10 segundos.

## Non-goals

- Mudar a fórmula de competência ou de parcelas.
- Busca fora do mês selecionado.
- Campo de observação separado da descrição.
- FAB.

## Domain rules

| Caso | Entrada | Resultado |
|---|---|---|
| Lista | Mês com lançamentos | `Tabela` com Data, Descrição, Item, Pagamento e Valor. Valor à direita. Ordenação por data decrescente |
| Linha | Clique ou teclado na linha | Abre a edição |
| Busca | Texto | Limitada ao mês, combinada com os filtros. Sem resultado: `Nenhum resultado para "{texto}"` e a ação "Limpar busca" |
| Limpar busca | Ação | Esvazia o texto. Não muda o mês |
| Registrar | Item, valor, data, descrição, pagamento | Painel lateral. Item em `Select` agrupado por tipo. Valor em `CampoMoeda`. Data em `CampoData` |
| Parcelar | `Switch` ligado, cartão, 1–60 | Prévia das competências e dos valores em centavos antes de gravar. Gravação atômica |
| Sem cartão | Débito, PIX ou Dinheiro | Competência = mês da data. O switch de parcelar não se oferece |
| Cartão | Crédito | Cartão ativo obrigatório. Badge "Fatura MM/AAAA" quando a compra cai numa fatura |
| Editar parcela | Grupo de parcelas | Pergunta "Somente esta parcela" ou "Esta e as próximas" antes de gravar. O número de parcelas não muda |
| Excluir | Confirmação | O botão diz "Excluir lançamento". O diálogo diz quantos lançamentos saem. `Snackbar` "Desfazer" por 10 s restaura os mesmos registros, sem duplicar |
| Salvar | Gravação certa | `Snackbar` "Lançamento salvo." por 5 s, sem desfazer |
| Valor | Zero ou vazio | "Informe um valor maior que zero." |
| Vazio | Mês sem lançamento | `CartaoVazio`: "Nenhum lançamento neste mês. Registre cada gasto para acompanhar o que já foi usado." Ação de registrar no cartão |

Descrição vazia grava o nome do item. Item arquivado não aparece no seletor. As frases vêm de `docs/design/MICROCOPY.md` e de `docs/design/MODULOS.md` (snackbar de 10 s com desfazer, 5 s sem).

## Acceptance criteria

- [ ] AC-1 A tabela tem as cinco colunas, `caption`, valor à direita e a linha inteira abre a edição.
- [ ] AC-2 `CampoBusca` e os filtros de item e de pagamento ficam no topo. O mês troca com ‹ ›. A busca não sai do mês.
- [ ] AC-3 Sem resultado, a tela mostra `Nenhum resultado para "{texto}"` e "Limpar busca". Limpar a busca não muda o mês.
- [ ] AC-4 Registrar abre o painel com `Select` agrupado, `CampoMoeda`, `CampoData`, descrição, pagamento e `RodapeAcoes`.
- [ ] AC-5 O `Switch` "Parcelar" mostra a prévia das competências e dos centavos. A gravação segue a regra já testada de parcelas (R$ 100,00 em 3× = 3334 + 3333 + 3333).
- [ ] AC-6 Compra no cartão que cai na fatura mostra o badge "Fatura MM/AAAA". A competência gravada é a da spec de cartão, inclusive compra no dia do fechamento.
- [ ] AC-7 Editar reabre o mesmo painel. Excluir está no fim, como ação destrutiva, ou dentro de `MenuAcoes`. Nos dois casos o `Dialogo` vem antes. Não há excluir direto na linha.
- [ ] AC-8 Depois de excluir, o `Snackbar` oferece desfazer por 10 s e restaura os registros sem duplicar. Parcelamento pede o escopo e informa a quantidade.
- [ ] AC-9 O mês vazio usa o texto de `docs/design/MICROCOPY.md` no `CartaoVazio`. Busca sem resultado e erro (`EstadoErro`) existem. Carregando usa `Skeleton`. Valor inválido mostra "Informe um valor maior que zero." Salvar mostra "Lançamento salvo." por 5 s.
- [ ] AC-10 A regra de tokens do ESLint passa. Só componentes do DS. Rótulos visíveis, foco visível, teclado no painel e no diálogo. Light, dark e `prefers-reduced-motion`. Nada de `@material/web`.
- [ ] AC-11 O E2E registra um lançamento à vista, registra um parcelado no cartão, edita só uma parcela e desfaz uma exclusão. A captura vai para `tests/visual/out/`, sem pixel-diff bloqueante.
- [ ] AC-12 Nenhum `console.log`, `any` ou TODO novo. `src/domain/competencia.ts` não muda.

## Test plan

E2E Playwright do AC-11.  
Unit já existente de parcelas, edição e exclusão permanece verde. Checklist de `packages/design-system/CHECKLIST.md` no PR.

## Open questions

Nenhuma.
