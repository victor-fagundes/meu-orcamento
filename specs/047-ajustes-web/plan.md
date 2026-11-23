# Implementation Plan: Ajustes web

**Branch**: `047-ajustes-web` | **Date**: 2026-11-23 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `/specs/047-ajustes-web/spec.md`

## Summary

`/app/ajustes` deixa de ser o sanfona Material. Passa a ser um menu em dois grupos, com Categorias e itens na abertura, Conta, cartões, limite global, arquivados, exportação, exemplo e exclusão. A casca perde o Sair sem diálogo. O tema usa o `ThemeProvider` que já existe. Vencimento aceita 1 a 31. Gravar categoria ou cartão fecha o formulário e leva o foco para a linha. Importar e o simulador continuam no repositório e somem do menu.

## Technical Context

**Language/Version**: TypeScript estrito, Next.js 15 App Router

**Primary Dependencies**: `@meu-orcamento/design-system` (`LinhaAjuste`, `Avatar`, `Chips`, `MenuAcoes`, `FormularioContainer`, `Campo`, `Select`, `Dialogo`, `Botao`, `Banner`, `Skeleton`, `EstadoErro`, `ThemeProvider`, `useTema`), `requireSessionOrcamento`, `validarNomeCategoria`, `validateCreateCartao`, `validarLimitePct`, `haMovimentoParaExportar`, `applyExamplePlans`

**Storage**: Nenhuma tabela nova. Categoria, item, cartão, `globalPct` e `catsJson` continuam como estão. O tema continua na chave `mo-tema` deste navegador. A frase EXCLUIR não é coluna.

**Testing**: Vitest em `cartoes.test.ts`, na frase EXCLUIR, na linha do cartão, nas iniciais e no limite global que não apaga `catsJson`. Playwright em `e2e/ajustes.spec.ts`, mais o ajuste de `e2e/casca.spec.ts`, `e2e/orcamento.spec.ts` e `e2e/resumo.spec.ts`. Smoke no `quickstart.md`.

**Target Platform**: App web local. A janela estreita é este site, no mesmo corte de 720 px da casca. O Android não entra.

**Project Type**: Aplicação web existente. Esta história troca o miolo de Ajustes e tira o Sair da casca. A aba Ajustes da história 042 permanece.

**Performance Goals**: Cada página lê só o próprio orçamento. Sem meta nova de tempo. Com `prefers-reduced-motion`, painel, diálogo e troca de tema não transitam.

**Constraints**: Domínio sem Next, React ou Drizzle. Centavos inteiros até a exportação. Estilo novo não usa hexadecimal nem `px`/`rem`/`dp` solto. Sem `console.log`, sem `any`. A página nova não importa `@material/web`. Painéis de importar, simulador e o sanfona antigo permanecem no repositório até a história 049. `TIPOS_LABEL` não muda. A rota HTTP de cartão não muda.

**Scale/Scope**: Uma conta e um orçamento. Sem importar no menu, sem simulador, sem limite por categoria nesta página, sem desarquivar, sem reativar cartão, sem espera de 30 dias, sem botão flutuante.

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Gate | Status | Notes |
|------|--------|-------|
| I. Domain Purity | PASS | Nome de categoria, dias do cartão, limite, movimento da exportação, frase EXCLUIR, texto da linha do cartão e iniciais saem de funções puras. A página não recalcula alerta nem competência. |
| II. Integer Money | PASS | O exemplo grava centavos pelos doze meses. A exportação continua em centavos. O limite é inteiro de 1 a 100, não é dinheiro. |
| III. Spec-Driven Delivery | PASS | A spec 047 está escrita e sem marcador de clarificação. O status segue `Draft`: o código desta história só começa quando passar a `ready`. |
| IV. Vertical Slice | PASS | A entrega é o menu e as páginas usáveis, com a casca sem o Sair solto. Não fica API sem tela. |
| V. Simplicity & Isolation | PASS | Sem tabela nova e sem rota HTTP nova. Leitura e gravação filtram por `orcamentoId`. O limite global não reescreve `catsJson`. |

**Post-design re-check**: PASS. `data-model.md` não cria tabela. `contracts/ajustes.md` cobre o menu, o tema, as categorias, os cartões, o limite, a exportação, o exemplo, a exclusão e o foco. O pacote só ganha a folha estreita no `FormularioContainer`, desligada por padrão, para as telas 044 e 045 não mudarem de lugar.

## Project Structure

### Documentation (this feature)

```text
specs/047-ajustes-web/
├── plan.md
├── research.md
├── data-model.md
├── quickstart.md
├── contracts/
│   └── ajustes.md
├── checklists/requirements.md
└── tasks.md                 # /speckit-tasks — não criado aqui
```

### Source Code (repository root)

```text
src/app/app/ajustes/layout.tsx
src/app/app/ajustes/page.tsx
src/app/app/ajustes/loading.tsx
src/app/app/ajustes/error.tsx
src/app/app/ajustes/categorias/page.tsx
src/app/app/ajustes/conta/page.tsx
src/app/app/ajustes/cartoes/page.tsx
src/app/app/ajustes/limites/page.tsx
src/app/app/ajustes/exportar/page.tsx
src/app/app/ajustes/exemplo/page.tsx
src/app/app/ajustes/excluir/page.tsx
src/app/layout.tsx
src/app/actions/cartoes.ts
src/app/actions/conta.ts
src/app/actions/limites.ts
src/app/actions/catalog.ts
src/application/cartoes.ts
src/application/limites.ts
src/components/casca-app.tsx
src/components/ajustes-moldura.tsx
src/components/conta-tela.tsx
src/components/categorias-tela.tsx
src/components/cartoes-tela.tsx
src/components/limites-tela.tsx
src/components/exportar-tela.tsx
src/components/exemplo-tela.tsx
src/components/excluir-tela.tsx
src/domain/cartoes.ts
src/domain/cartoes.test.ts
src/domain/iniciais.ts
src/domain/iniciais.test.ts
src/domain/exclusao-conta.ts
src/domain/exclusao-conta.test.ts
packages/design-system/src/base/contratos.ts
packages/design-system/src/web/formulario-container.tsx
packages/design-system/src/web/base.css
e2e/ajustes.spec.ts
e2e/casca.spec.ts
e2e/orcamento.spec.ts
e2e/resumo.spec.ts
```

**Structure Decision**: A casca continua em volta de `/app/ajustes`. `page.tsx` redireciona para `/app/ajustes/categorias`. O layout mostra o menu e a página junta a partir de 720 px. Abaixo disso, a página abre sozinha e Voltar mostra o menu. Itens arquivados não tem rota própria: o menu e a aba usam `/app/ajustes/categorias?aba=arquivados`. Gerenciar continua em `/app/ajustes/categorias?tipo=`. Os painéis antigos ficam no repositório e deixam de ser montados.

## Complexity Tracking

Nenhuma violação. A folha de baixo é um modificador opcional do formulário que já existe. Sem ele, 390 px continuaria um painel lateral, e ligá-lo para todo o site mudaria Orçamento e Lançamentos, que já estão verificados.
