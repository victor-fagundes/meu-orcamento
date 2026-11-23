# Implementation Plan: Resumo web

**Branch**: `rebuild-web` | **Date**: 2026-11-22 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `/specs/043-resumo-web/spec.md`

## Summary

A página `/app/resumo` deixa de mostrar "Ainda pode gastar", a rosca e as barras. Passa a mostrar "Disponível neste mês", os quatro cartões, os filtros, o sininho e o gráfico de semanas, com a conta que `totaisDoMes` e `alertasDoMes` já fazem. O mês sobe para o cabeçalho da casca: só Resumo pede mês. O toque num cartão abre `/app/orcamento` daquele tipo. Não há banner, não há tabela nova e não há regra nova de saldo.

## Technical Context

**Language/Version**: TypeScript estrito, Next.js 15 App Router

**Primary Dependencies**: `@meu-orcamento/design-system` (`BlocoSaldo`, `GradeTotais`, `Chips`, `CartaoVazio`, `Skeleton`, `EstadoErro`, `LinhaLancamento`, `Icone`), `totaisDoMes`, `loadAlertasMes`, `hrefOrcamentoMes`, `navegacaoMesDaArea`

**Storage**: Nenhuma tabela nova. Filtros e mês ficam na query. Ocultar valores fica neste navegador, na chave `mo-ocultar-valores`, que ainda não existe. Lançamento já tem `dataTransacao` e `descricao`; a página passa a lê-los.

**Testing**: Vitest das funções puras de semana, média, frase e filtro. Playwright em `e2e/resumo.spec.ts` com a conta demo, no claro e no escuro. Captura em `tests/visual/out/`, sem pixel-diff. Smoke no `quickstart.md`.

**Target Platform**: App web local. A janela estreita é este site. O Android não entra.

**Project Type**: Aplicação web existente. Esta história troca o miolo de Resumo. A casca da história 042 permanece.

**Performance Goals**: Abrir o mês é a leitura que a página já faz, agora com data e descrição do lançamento. Sem animação nova. Com `prefers-reduced-motion`, as barras do gráfico não transitam.

**Constraints**: Domínio sem Next, React ou Drizzle. Centavos inteiros; a média arredonda ao centavo sem float de dinheiro. Estilo novo em `src/app` e `src/components` não usa hexadecimal nem `px`/`rem`/`dp` solto. A medida do valor (40 px abaixo de 720, 56 px a partir daí) fica no CSS do pacote, com os tokens que já existem. Sem `console.log`, sem `any`. A página nova não importa `@material/web`. `ResumoDashboard`, a rosca e `AlertBanner` permanecem no repositório até a história 049. O banner sai desta página.

**Scale/Scope**: Um orçamento, um mês, quatro cartões, no máximo cinco semanas. Sem intervalo de datas. Sem sexta área.

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Gate | Status | Notes |
|------|--------|-------|
| I. Domain Purity | PASS | Semana, média, percentual e a frase saem de função pura em `src/domain`. A página chama `totaisDoMes` e `alertasDoMes`. Não recalcula o saldo com outra fórmula. |
| II. Integer Money | PASS | Entrada e soma em centavos. A média usa divisão inteira ao centavo mais próximo. `formatarBRL` no disponível e `formatarBRLInteiro` nos cartões, só na borda. |
| III. Spec-Driven Delivery | PASS | A spec 043 está `ready`, com as cinco respostas da sessão de 2026-11-22. |
| IV. Vertical Slice | PASS | A entrega é a página usável: leitura do mês, filtros, ocultar, sininho, gráfico e o salto ao Orçamento. O desenho do Orçamento continua na história 044. |
| V. Simplicity & Isolation | PASS | Sem tabela, sem rota HTTP nova, sem segunda preferência de ocultar. A query continua filtrada por `orcamentoId`. |

**Post-design re-check**: PASS. `data-model.md` não cria tabela. `contracts/resumo.md` cobre o disponível, os cartões, os filtros, o gráfico, o sininho e os três estados. O pacote só ganha o que a tela não consegue com o contrato atual: valor ausente, toque no cartão, gráfico e painel com foco preso.

## Project Structure

### Documentation (this feature)

```text
specs/043-resumo-web/
├── plan.md
├── research.md
├── data-model.md
├── quickstart.md
├── contracts/
│   └── resumo.md
├── checklists/requirements.md
└── tasks.md                 # /speckit-tasks — não criado aqui
```

### Source Code (repository root)

```text
src/app/app/resumo/page.tsx            # lê o mês da sessão; tira o banner
src/app/app/resumo/loading.tsx         # Skeleton, sem R$ 0,00
src/app/app/resumo/error.tsx           # EstadoErro com a frase da spec
src/components/resumo-tela.tsx         # cliente: blocos, filtros, sininho, gráfico
src/components/resumo-filtro.ts        # query e recorte, já existente, estendido
src/domain/resumo-semana.ts            # semanas, média, frase, vazio
src/domain/resumo-semana.test.ts
src/components/casca-abas.ts           # só Resumo passa a pedeMes
packages/design-system/src/web/modulos/bloco-saldo.tsx
packages/design-system/src/web/modulos/grade-totais.tsx
packages/design-system/src/web/modulos/grafico-semanas.tsx
packages/design-system/src/web/painel.tsx
packages/design-system/src/web/base.css
e2e/resumo.spec.ts
```

**Structure Decision**: A rota já é `src/app/app/resumo/page.tsx`. O servidor continua dono da leitura. O cliente só alterna ocultar, abre os dois painéis e troca a query. A conta nova mora em `src/domain`. O pacote recebe o gráfico e o painel porque a página não pode desenhar barra nem diálogo com estilo solto.

## Complexity Tracking

Nenhuma violação. A história entrega a tela inteira em cima da conta que já existe.
