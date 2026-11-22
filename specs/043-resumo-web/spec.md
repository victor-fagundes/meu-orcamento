# Spec: 043 — Resumo web

**Status:** `ready`  
**Release:** rebuild-web  
**Sprint:** —  
**Depende de:** 040, 042  
**PRD:** 5.2, 5.10, 6, D-02, D-09  
**Branch:** `rebuild-web`

## Context

O Resumo é a tela de entrada logada (`/app/resumo`). O filtro de período é o mês de competência, não um intervalo de datas (D-09). O número principal deixa de se chamar "Ainda pode gastar" e passa a "Disponível neste mês". A conta continua orçado de despesas (F+V+E) menos o gasto. Não é receitas menos despesas: esse é o número do Ano.

Com forma de pagamento diferente de Todas, o planejado não se divide: orçado e disponível mostram "—", e o gasto usa só os lançamentos daquele meio (spec 012).

As frases de item no DS estão em `fraseDoEstado` (`packages/design-system/src/modulos/logica.ts`). O gráfico pedido aqui é o de gasto por semana, com média diária. A rosca e as barras da spec 012 não entram nesta tela nova.

## Goals

1. Mostrar o disponível do mês, os quatro totais e o gráfico semanal.
2. Ocultar valores, filtrar e listar alertas sem criar outra regra de cálculo.
3. Cobrir vazio, carregando e erro.

## Non-goals

- Intervalo livre de datas.
- Seção Insights e indicador de dívida.
- Regra de alerta diferente da que o domínio já calcula.
- Rosca e barras planejado × realizado nesta reconstrução.

## Domain rules

Dinheiro entra em centavos. A formatação na borda usa `formatarBRL` no disponível e `formatarBRLInteiro` nos quatro cartões.

| Caso | Entrada | Resultado |
|---|---|---|
| Disponível | Orçado de despesas 300000, gasto 240000 | 60000 centavos, rótulo "Disponível neste mês" |
| Pagamento ≠ Todas | Um cartão | Gasto só desse meio. Disponível e orçado mostram "—" |
| Limpar filtros | Pagamento e categoria preenchidos | Os dois voltam a Todas. O mês não muda |
| Mês corrente | Dia D, gasto G | "Usou X% do planejado · Faltam N dias", com N = último dia do mês − D |
| Outro mês | Competência fora do mês civil atual | A frase não inclui "Faltam N dias" |
| Ocultar | Botão de visibilidade | Saldo, totais e gráfico mascaram o valor. A preferência fica em `localStorage` (`mo-ocultar-valores`) |
| Vazio | Sem receita planejada e sem movimento | `CartaoVazio`, ação "Definir receitas" |
| Alerta | Atenção ou estouro no mês | Sininho `notifications` com a quantidade. O painel lista esses alertas e liga cada um ao Orçamento |

Os quatro cartões são Receitas, Fixas, Variáveis e Anuais.

## Acceptance criteria

- [ ] AC-1 O bloco de saldo usa `BlocoSaldo`, o rótulo "Disponível neste mês" e o valor em `displayMd` abaixo de 720 px e `displayLg` a partir de 720 px.
- [ ] AC-2 O botão de ocultar usa `visibility` / `visibility_off`, tem `aria-pressed` e persiste em `mo-ocultar-valores`. Ocultar afeta saldo, totais e gráfico.
- [ ] AC-3 `GradeTotais` mostra os quatro cartões sem centavos (`formatarBRLInteiro`). Cada cartão traz "de R$ x planejados", como em `docs/design/MODULOS.md`. O rótulo do saldo é "Disponível neste mês", como em `docs/design/MICROCOPY.md`.
- [ ] AC-4 Os chips filtram por tipo e por cartão. "Limpar filtros" zera pagamento e categoria e mantém o mês.
- [ ] AC-5 Com um cartão escolhido, o disponível e o orçado mostram "—" e o gasto considera só esse meio.
- [ ] AC-6 A frase "Usou X% do planejado · Faltam N dias" só inclui os dias no mês atual. O medidor acompanha o percentual.
- [ ] AC-7 O sininho mostra o contador. O painel lista alertas de atenção e de estouro, cada um com link para o Orçamento do mês.
- [ ] AC-8 O gráfico é o de gasto por semana, com a média diária. "Ver detalhes" abre o painel dos lançamentos da semana.
- [ ] AC-9 Vazio usa `CartaoVazio` com "Definir receitas". Carregando usa `Skeleton`. Erro usa `EstadoErro`.
- [ ] AC-10 A regra de tokens do ESLint passa. Só componentes do DS. Todo controle tem nome acessível e todo campo, rótulo visível. Foco visível. Light, dark e `prefers-reduced-motion` funcionam. Nada de `@material/web`.
- [ ] AC-11 O E2E do fluxo principal passa: abrir o mês, filtrar um cartão, limpar, ocultar valores, abrir o sininho. A captura vai para `tests/visual/out/`, sem pixel-diff bloqueante.
- [ ] AC-12 Nenhum `console.log`, `any` ou TODO novo. Centavos só na borda viram texto.

## Test plan

E2E Playwright do AC-11, em light e em dark.  
Unit já existente de saldo do período permanece verde (`src/domain/reconciliacao.test.ts`, `src/domain/resumo-mes.test.ts`).  
Checklist de `packages/design-system/CHECKLIST.md` no PR.

## Open questions

Nenhuma.
