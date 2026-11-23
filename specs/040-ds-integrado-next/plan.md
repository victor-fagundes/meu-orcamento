# Implementation Plan: DS integrado ao Next

**Branch**: `rebuild-web` (feature `040-ds-integrado-next`) | **Date**: 2026-11-22 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `/specs/040-ds-integrado-next/spec.md`

## Summary

O App Router passa a carregar Manrope, `tokens.css` e o tema (`mo-tema`) sem flash, e o pacote `@meu-orcamento/design-system` ganha os oito componentes que as telas 042–048 vão usar. Diálogo e painel prendem o foco. O catálogo de ícones cobre os onze nomes novos. A checagem visual só grava capturas.

As telas de produto, `@material/web`, `material-theme.css`, `globals.css` e a pasta `android/` ficam como estão. A pasta `specs/040-replicar-front-prototipo` continua Cancelled e não é esta história.

Spec `ready`. Pode implementar.

## Technical Context

**Language/Version**: TypeScript 5.8 no app (Next.js 15.3, React 19.1) e TypeScript 5.6 no pacote. Fonte Manrope variável já está em `packages/design-system/fonts/Manrope-VariableFont_wght.ttf` (peso 200–800).

**Primary Dependencies**: `next/font/local`. Pacote `@meu-orcamento/design-system` (entrada `src/web.ts`), ainda sem dependência na raiz. Vitest e Testing Library no pacote. Playwright 1.65 na raiz, só para a captura visual. Nenhuma biblioteca de foco, de ícone ou de data.

**Storage**: `localStorage`, chave `mo-tema`, valores `light`, `dark` ou `system`. Sem tabela e sem preferência no servidor.

**Testing**: Vitest do pacote (`// @vitest-environment jsdom` nos testes de componente). `npm test` na raiz continua só `src/**/*.test.ts`. Captura visual em Playwright à parte, sem baseline. Porta de saída: `npm test` na raiz, `npm test` no pacote, `npx tsc --noEmit`, depois `npm run build`.

**Target Platform**: App Router no navegador. Desktop a partir de 720 px. Referência visual 390 px e 1280 px. Sem Expo e sem `android/`.

**Project Type**: Design system web ligado ao layout do Next. As telas de produto não entram.

**Performance Goals**: O script de tema roda antes da primeira pintura. A fonte entra pelo `next/font`, sem `@font-face` de caminho relativo e sem pedido extra ao Google.

**Constraints**: Centavos e domínio intactos. Medidas novas só `76` e `960` em `grid`. `material-theme.css` e `globals.css` permanecem até a spec 049. Sem `console.log`, `any` ou TODO novo. A baseline visual não é aprovada por este trabalho.

**Scale/Scope**: Layout raiz, dois campos em `grid`, oito componentes web, onze ícones, foco em dois componentes que já existem, uma suíte de captura. Fora: Resumo, Orçamento, Lançamentos, Ano, Ajustes, Entrada e a casca nativa.

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- **I. Domain purity**: Passa. Nada em `src/domain`. Número na tabela é texto já formatado; o componente não soma.
- **II. Integer money**: Passa. Nenhum valor monetário novo. Formatadores do pacote continuam na borda, em centavos.
- **III. Spec-driven**: Passa. Status `ready`. Aceite é o da spec 040. A pasta Cancelled não é implementada.
- **IV. Vertical slice**: Passa no recorte desta história. A entrega usável é o layout com tema e fonte, mais os componentes exportados, testados e fotografados. As telas 042–048 são histórias próprias, já `ready`, e a spec as lista como non-goal. Não fica API sem tela dentro da 040: não há API.
- **V. Simplicity**: Passa. Sem biblioteca de foco, sem rota pública de catálogo, sem camada nativa dos componentes novos, sem apagar o CSS antigo. O `tsc` da raiz passa por exclusão dos rascunhos que o pacote v0.2 não exporta, em vez de reescrevê-los.

**Revisão pós-design**: Passa. O modelo não cria tabela. Os contratos cobrem tema, componentes, ícones e as duas medidas. A exclusão no `tsconfig` continua sendo o menor jeito de cumprir o AC-12.

## Project Structure

### Documentation (this feature)

```text
specs/040-ds-integrado-next/
├── plan.md
├── research.md
├── data-model.md
├── quickstart.md
├── contracts/
│   ├── tema-layout.md
│   ├── componentes.md
│   └── icones-grade.md
└── tasks.md
```

### Source Code (repository root)

```text
src/app/layout.tsx
next.config.ts
package.json
tsconfig.json
.gitignore
packages/design-system/src/core/tokens.ts
packages/design-system/src/core/css.ts
packages/design-system/src/core/tokens.css
packages/design-system/src/core/icons-paths.ts
packages/design-system/src/base/contratos.ts
packages/design-system/src/web/tema.tsx
packages/design-system/src/web/dialogo.tsx
packages/design-system/src/web/formulario-container.tsx
packages/design-system/src/web/shell-app.tsx
packages/design-system/src/web/tabela.tsx
packages/design-system/src/web/campo-busca.tsx
packages/design-system/src/web/campo-data.tsx
packages/design-system/src/web/switch.tsx
packages/design-system/src/web/menu-acoes.tsx
packages/design-system/src/web/botao-icone.tsx
packages/design-system/src/web/avatar.tsx
packages/design-system/src/web/base.css
packages/design-system/src/web.ts
packages/design-system/tests/tokens-sync.test.ts
packages/design-system/tests/icones.test.ts
packages/design-system/tests/web/foco.test.tsx
packages/design-system/tests/web/componentes-5.test.tsx
docs/design/ICONES.md
tests/visual/playwright.config.ts
tests/visual/catalogo.spec.ts
tests/visual/out/
```

**Structure Decision**: Componentes novos ficam em `packages/design-system/src/web/`, ao lado dos que `src/web.ts` já exporta. O contrato único continua em `src/base/contratos.ts`. Não se criam arquivos em `src/base/*.web.tsx`, `src/modulos/*.web.tsx` nem em `meu-orcamento-design-system/`: essa árvore é um rascunho anterior, não é a entrada do pacote e hoje quebra o `tsc`. Também não há versão nativa destes oito componentes. O layout do Next importa o pacote; `transpilePackages` passa a incluí-lo. A captura visual mora em `tests/visual/` e não entra em `e2e/` nem em `npm test`.

## Complexity Tracking

Nenhuma violação. Tabela não se aplica.
