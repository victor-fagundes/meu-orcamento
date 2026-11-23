# Spec: 046 — Ano web

**Status:** `ready`  
**Release:** rebuild-web  
**Sprint:** —  
**Depende de:** 040, 042  
**PRD:** 5.4, 6, D-02  
**Branch:** `rebuild-web`

## Context

`/app/ano` é a visão Jan–Dez no computador. O saldo da linha de fechamento é receitas menos despesas (`saldoFinalAno`). O rótulo deixa de ser "Saldo final" e passa a ser "Sobra no ano". A competência é a mesma do Resumo e do Orçamento, inclusive cartão e parcelas.

A tabela detalhada é só do web. No celular a lista mensal sem essa tabela fica para a fase mobile (spec 055) e não entra aqui.

## Referências visuais e de DS
- Identidade: `docs/identidade-visual/decisoes/DECISOES_identidade_visual.md` (seções aplicáveis: 3 Tipografia, 5 Layout, 7 Estados e mensagens, 8 Nomes e microcopy)
- Tela de referência: `docs/identidade-visual/telas-web/web-ano-dados.dc.html`, `web-ano-vazio.dc.html`, `web-ano-planejado.dc.html`
- Componentes do DS usados: `CabecalhoTela`, `TabelaMeses`, `CartaoVazio`, `EstadoErro`
- Tokens: apenas os de `packages/design-system/src/core/tokens.ts`

## Critérios de aceite visuais
- AC-V1: hierarquia e textos iguais à tela de referência.
- AC-V2: todos os componentes vêm do DS.
- AC-V3: estados (vazio, erro, carregando) iguais aos da referência.

## Goals

1. Mostrar os doze meses, o total de cada linha e a sobra do ano.
2. Destacar o mês ativo e o ano sem movimento.
3. Trocar o ano sem perder o rótulo nem a fórmula.

## Non-goals

- Tabela detalhada no celular.
- Regra própria de alerta no Ano.
- Alternar a fórmula para orçado menos gasto.

## Domain rules

| Caso | Entrada | Resultado |
|---|---|---|
| Grade | Ano com movimento | `TabelaMeses`: 12 meses, total da linha, mês ativo destacado |
| Sobra | Receitas 500000, despesas 240000 | 260000 centavos, rótulo "Sobra no ano" |
| Nome | Qualquer ano | A linha se chama "Sobra no ano", não "Saldo final" |
| Ano vazio | Sem plano e sem lançamento | `CartaoVazio` |
| Troca de ano | ‹ › | Os números só trocam depois da resposta. Se falhar, o ano que estava na tela permanece e `EstadoErro` aparece |
| Competência | Compra no cartão | O mês da célula é o da fatura, o mesmo das outras telas |

Valores negativos ficam destacados com texto, não só com cor. Número à direita, dígitos tabulares.

## Acceptance criteria

- [ ] AC-1 A tela usa `TabelaMeses` com doze meses, total por linha e o mês ativo destacado.
- [ ] AC-2 A linha de fechamento se chama "Sobra no ano" e o valor é `saldoFinalAno` (receitas − despesas), em centavos formatados na borda.
- [ ] AC-3 ‹ › troca o ano. Durante o carregamento a grade anterior permanece. Falha mantém o ano confirmado e mostra `EstadoErro`.
- [ ] AC-4 Ano sem movimento mostra `CartaoVazio` e não mostra a grade vazia como se houvesse zeros a conferir.
- [ ] AC-5 Uma compra de cartão com fechamento no dia 25 em 26/05 aparece em junho, no mesmo mês do Resumo e do Orçamento.
- [ ] AC-6 A regra de tokens do ESLint passa. Só componentes do DS. A tabela tem `caption` e cabeçalho com `scope`. Foco visível. Light, dark e `prefers-reduced-motion`. Nada de `@material/web`.
- [ ] AC-7 O E2E abre o ano, confere o rótulo "Sobra no ano", troca o ano e volta. A captura vai para `tests/visual/out/`, sem pixel-diff bloqueante.
- [ ] AC-8 Nenhum `console.log`, `any` ou TODO novo. Esta spec não desenha a lista mensal do celular.

## Test plan

E2E Playwright do AC-7 em 1280 px.  
`saldoFinalAno` em `src/domain/reconciliacao.test.ts` permanece verde. Checklist de `packages/design-system/CHECKLIST.md` no PR.

## Open questions

Nenhuma.
