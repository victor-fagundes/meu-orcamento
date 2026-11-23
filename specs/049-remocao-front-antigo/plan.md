# Implementation Plan: Remoção do front antigo

**Branch**: `049-remocao-front-antigo` | **Date**: 2026-11-23 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `/specs/049-remocao-front-antigo/spec.md`

## Summary

Resumo, Orçamento, Lançamentos, Ano, Ajustes e Entrada já são as telas do DS. Esta história tira o que ainda carrega a biblioteca antiga: o registro no layout, a vitrine `/`, o tema em `globals.css` e os componentes que nenhuma página nova importa. `/` sem sessão abre `/login`. Com sessão, abre `/app/resumo`. O disponível do mês, a conta e o app do celular não mudam.

## Technical Context

**Language/Version**: TypeScript estrito, Next.js 15 App Router

**Primary Dependencies**: `@meu-orcamento/design-system` (já ligado no layout). Sai `@material/web`. `lit` sai de `transpilePackages` porque só entrava com essa biblioteca.

**Storage**: Nenhuma tabela, coluna ou migração. Lançamentos, categorias, conta e sessão permanecem.

**Testing**: Sem teste novo de domínio. Playwright já existente em `e2e/resumo.spec.ts`, `e2e/orcamento.spec.ts`, `e2e/lancamentos.spec.ts`, `e2e/ano.spec.ts`, `e2e/ajustes.spec.ts`, `e2e/entrada.spec.ts` e `e2e/casca.spec.ts`. `npm test`, `npx tsc --noEmit`, `npm run build` e `npm run lint`. A busca da spec fica no `quickstart.md`.

**Target Platform**: App web local. O Android em `android/` não entra.

**Project Type**: Aplicação web existente. A entrega é a limpeza do front antigo, com as seis áreas continuando nas rotas atuais.

**Performance Goals**: Sem meta nova. As seis áreas abrem como hoje. Com `prefers-reduced-motion`, a transição continua sem animação, pela regra que o DS já tem.

**Constraints**: Domínio sem Next, React ou Drizzle. Centavos e competência não mudam. `src/lib/auth.ts` e `src/app/api/auth/**` não mudam. Estilo que sobrar em `src/app` não usa hexadecimal nem `px`/`rem`/`dp` solto. Sem `console.log`, sem `any`, sem TODO novo. A branch de trabalho é `rebuild-web`. A história 057 continua dona do aparelho.

**Scale/Scope**: Uma interface web. A vitrine antiga não é redesenhada. Specs antigas permanecem. Tailwind fica instalado, mas o app deixa de carregá-lo.

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Gate | Status | Notes |
|------|--------|-------|
| I. Domain Purity | PASS | Nenhum arquivo em `src/domain` muda. O disponível do mês continua saindo de onde já sai. |
| II. Integer Money | PASS | Não há leitura nem gravação nova de valor. O mesmo mês com os mesmos lançamentos mostra o mesmo disponível. |
| III. Spec-Driven Delivery | PASS | A spec 049 está `ready` e sem marcador de clarificação. 041–048 estão `verified`. O código pode começar por essa spec. |
| IV. Vertical Slice | PASS | A pessoa continua usando as seis áreas. Não fica API sem tela, nem tela placeholder. A vitrine antiga sai em vez de ganhar uma tela nova. |
| V. Simplicity & Isolation | PASS | Apaga o que nenhuma rota nova importa. Não reestiliza esse código no DS. Não mexe em `android/` nem em dado de outro orçamento. |

**Post-design re-check**: PASS. `data-model.md` não cria tabela. `contracts/front-web.md` cobre as rotas atuais, o destino de `/` e a ausência da biblioteca antiga. O `quickstart.md` repete as suítes já aceitas. Orçamento, lançamentos e conta não mudam de campo.

## Project Structure

### Documentation (this feature)

```text
specs/049-remocao-front-antigo/
├── plan.md
├── research.md
├── data-model.md
├── quickstart.md
├── contracts/
│   └── front-web.md
├── checklists/requirements.md
└── tasks.md                 # /speckit-tasks — não criado aqui
```

### Source Code (repository root)

```text
src/app/layout.tsx
src/app/page.tsx
src/app/globals.css
src/app/material-theme.css          # apagar
src/types/material-web.d.ts         # apagar
src/components/material/**          # apagar
src/components/app-chrome.tsx       # apagar
src/components/app-nav.tsx          # apagar
src/components/auth-shell.tsx       # apagar
src/components/brand-logo.tsx       # apagar
src/components/sign-out-button.tsx  # apagar
src/components/resumo-dashboard.tsx # apagar
src/components/resumo-donut.ts      # apagar
src/components/resumo-donut.test.ts # apagar
src/components/orcamento-view.tsx   # apagar
src/components/alert-banner.tsx     # apagar
src/components/plano-sheet.tsx      # apagar
src/components/novo-item-sheet.tsx  # apagar
src/components/lancamentos-view.tsx # apagar
src/components/novo-lancamento-sheet.tsx   # apagar
src/components/editar-lancamento-sheet.tsx # apagar
src/components/ano-view.tsx         # apagar
src/components/ajustes-cards.tsx    # apagar
src/components/cartoes-panel.tsx    # apagar
src/components/limites-panel.tsx    # apagar
src/components/export-panel.tsx     # apagar
src/components/carregar-exemplo-button.tsx # apagar
src/components/excluir-conta-panel.tsx     # apagar
src/components/import-planilha-panel.tsx   # apagar
src/components/import-pdf-panel.tsx        # apagar
src/components/competencia-simulador.tsx   # apagar
next.config.ts
package.json
package-lock.json
```

**Structure Decision**: As rotas `/app/resumo`, `/app/orcamento`, `/app/lancamentos`, `/app/ano`, `/app/ajustes` e `/login`, `/cadastro`, `/esqueci-senha` permanecem. Nenhuma delas importa o grupo antigo. `layout.tsx` continua com Manrope, `tokens.css`, `web.css` e `ThemeProvider`, sem `MaterialRegistry`. `page.tsx` só redireciona. `globals.css` perde o tema antigo e fica com o reset mínimo que usa token do DS. `android/` não entra na árvore desta história.

## Complexity Tracking

Nenhuma violação. Reescrever a vitrine ou os painéis antigos no DS seria outra tela. A spec pede que as seis áreas já verificadas sejam a interface.
