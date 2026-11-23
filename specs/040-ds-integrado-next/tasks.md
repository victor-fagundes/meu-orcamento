---
description: "Task list for integrating the design system into the Next.js App Router"
---

# Tasks: DS integrado ao Next

**Input**: Design documents from `/specs/040-ds-integrado-next/`

**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/tema-layout.md, contracts/componentes.md, contracts/icones-grade.md, quickstart.md

**Tests**: A spec pede teste para foco (AC-8), ícones (AC-9), Switch, MenuAcoes, CampoData e Tabela (AC-10) e captura visual sem baseline (AC-11). Esses testes nascem antes da implementação e falham até ela existir. Tema e fonte se provam no layout e no quickstart, sem arquivo de teste novo.

**Organization**: História 1 é o tema e a Manrope no App Router (MVP). História 2 é o catálogo de ícones. História 3 são os oito componentes. História 4 é o foco do diálogo e do painel, e pode seguir em paralelo com a 1 e a 2. História 5 só fotografa os componentes da história 3.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Pode correr em paralelo (arquivos diferentes, sem depender de tarefa incompleta)
- **[Story]**: História a que a tarefa pertence (US1–US5)
- Setup, fundação e polimento não levam história

## Path Conventions

- App: `src/app/layout.tsx`, `next.config.ts`, `package.json`, `tsconfig.json`
- Pacote vivo: `packages/design-system/src/web/`, `src/core/`, `src/base/contratos.ts`, `src/web.ts`
- Fora desta história: `packages/design-system/src/base/*.web.tsx`, `src/base/*.native.tsx`, `src/modulos/*.web.tsx`, `src/modulos/*.native.tsx`, `src/index.web.ts`, `src/index.native.ts`, `src/native/`, e a pasta `meu-orcamento-design-system/`
- Captura: `tests/visual/`

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: O Next passa a compilar o pacote, e o `tsc` da raiz deixa de ver o rascunho que não é a entrada v0.2.

- [X] T001 Declarar `"@meu-orcamento/design-system": "file:./packages/design-system"` em `package.json` e rodar `npm install` para gravar o lockfile
- [X] T002 [P] Acrescentar `@meu-orcamento/design-system` a `transpilePackages` em `next.config.ts`, mantendo `@material/web` e `lit`
- [X] T003 [P] Em `tsconfig.json`, ligar `allowImportingTsExtensions` (o projeto já tem `noEmit`) e excluir `meu-orcamento-design-system`, `packages/design-system/src/native`, `packages/design-system/src/index.web.ts`, `packages/design-system/src/index.native.ts`, `packages/design-system/src/base/*.web.tsx`, `packages/design-system/src/base/*.native.tsx`, `packages/design-system/src/modulos/*.web.tsx` e `packages/design-system/src/modulos/*.native.tsx`. Não excluir `packages/design-system/src/web`, `src/core`, `src/base/contratos.ts` nem `src/base/estado.ts`

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Os arquivos web que já usam estado ou evento viram client components antes de o layout importar o pacote.

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [X] T004 Percorrer cada `.tsx` em `packages/design-system/src/web/` e, se o arquivo usa `useState`, `useEffect`, `useRef`, `window` ou um evento de DOM, colocar `'use client'` na primeira linha. O conjunto já visto é `botao.tsx`, `campo.tsx`, `campo-moeda.tsx`, `checkbox.tsx`, `chips.tsx`, `dialogo.tsx`, `estado-erro.tsx`, `formulario-container.tsx`, `navegacao-principal.tsx`, `select.tsx`, `snackbar.tsx`, `tema.tsx`, `modulos/bloco-saldo.tsx`, `modulos/cabecalho-tela.tsx`, `modulos/cartao-vazio.tsx`, `modulos/grupo-com-medidor.tsx`, `modulos/linha-ajuste.tsx`, `modulos/linha-item.tsx`, `modulos/linha-lancamento.tsx` e `modulos/rodape-acoes.tsx`. Arquivo só de marcação fica sem a diretiva. `packages/design-system/src/web.ts` não leva a diretiva

**Checkpoint**: A entrada `src/web.ts` pode ser importada por um server component do App Router. Tema, ícones, componentes, foco e captura ainda não estão feitos.

---

## Phase 3: User Story 1 - Abrir o app com Manrope e o tema já resolvido (Priority: P1) 🎯 MVP

**Goal**: O App Router carrega Manrope, os tokens e o tema sem flash, com a chave `mo-tema`.

**Independent Test**: Recarregar com `mo-tema` ausente, `light` e `dark`. A primeira pintura já está no tema certo e em Manrope, sem `@font-face` de caminho relativo e sem pedido de fonte ao Google. `globals.css` e `material-theme.css` continuam no app.

### Implementation for User Story 1

- [X] T005 [P] [US1] Em `packages/design-system/src/core/css.ts`, remover o `@font-face` e definir `--font-family: var(--font-manrope), "Segoe UI", sans-serif`. Rodar `npm run gen:css` no pacote para que `packages/design-system/src/core/tokens.css` fique idêntico a `buildCss()` e sem `url("../../fonts/...")`. Não criar outra medida
- [X] T006 [P] [US1] Em `packages/design-system/src/web/tema.tsx`, ler e gravar `localStorage` na chave `mo-tema`, valores `light`, `dark` ou `system`. Ausente ou outro texto trata como `system`. O estado inicial do React não lê `localStorage` no render. `definirModo` grava a chave e põe `data-theme` em `light` ou `dark` já resolvido. No modo `system`, ouvir `prefers-color-scheme` e atualizar `data-theme` sem gravar `light` ou `dark` por cima da chave. Na montagem, não substituir o `data-theme` que o script já definiu por outro valor
- [X] T007 [P] [US1] Em `src/app/layout.tsx`, trocar `Roboto` de `next/font/google` por `next/font/local` em `packages/design-system/fonts/Manrope-VariableFont_wght.ttf`, peso `200 800`, `display: 'swap'`, variável `--font-manrope`, classe no `<html>`. Se o build não resolver esse caminho, copiar o mesmo arquivo para `public/fonts/` e apontar o `next/font` para a cópia. Não redefinir `--font-roboto`. Pôr `suppressHydrationWarning` no `<html>`. No `<head>`, um script lê `mo-tema` e não grava: `dark` → `data-theme="dark"`; `light` → `data-theme="light"`; `system`, vazio ou outro valor → `dark` se `prefers-color-scheme: dark`, senão `light`. Importar uma vez `@meu-orcamento/design-system/tokens.css` e uma vez `@meu-orcamento/design-system/web.css`. Manter `globals.css` e `MaterialRegistry`

**Checkpoint**: O layout cumpre AC-2, AC-3, AC-4 e AC-5. As telas de produto continuam as atuais. Os oito componentes ainda não existem.

---

## Phase 4: User Story 2 - Completar o catálogo de ícones (Priority: P2)

**Goal**: Cada nome novo existe em `IconName`, tem caminho e aparece em `docs/design/ICONES.md`.

**Independent Test**: `npm test --prefix packages/design-system` falha se algum nome de `IconName` tiver caminho vazio, e a lista dos onze nomes não compila se faltar no mapa.

### Tests for User Story 2 ⚠️

> **NOTE: Write these tests FIRST, ensure they FAIL before implementation**

- [X] T008 [US2] Criar `packages/design-system/tests/icones.test.ts` (ambiente node, sem jsdom). O teste percorre `IconName` e falha se o caminho for vazio. A lista `edit`, `add`, `search`, `close`, `filter_list`, `logout`, `more_vert`, `expand_more`, `expand_less`, `arrow_upward`, `arrow_downward` é `satisfies readonly IconName[]`. Rodar o teste e confirmar que falha antes de T009

### Implementation for User Story 2

- [X] T009 [P] [US2] Acrescentar em `packages/design-system/src/core/icons-paths.ts` os onze nomes de T008, com caminho do Material Icons preenchido, viewBox 24, no mesmo estilo de `delete`. Não desenhar caminho à mão e não acrescentar outro nome. `delete` permanece
- [X] T010 [P] [US2] Acrescentar em `docs/design/ICONES.md` uma linha por nome de T008, com o nome, o ícone Material e o uso (editar, incluir, busca, fechar, filtrar, sair, gatilho de menu, expandir, recolher, subir, descer)

**Checkpoint**: AC-9 passa sem os componentes novos. `MenuAcoes` ainda não existe, mas `more_vert` já tem caminho.

---

## Phase 5: User Story 3 - Ter os componentes que as telas vão usar (Priority: P2)

**Goal**: `ShellApp`, `Tabela`, `CampoBusca`, `CampoData`, `Switch`, `MenuAcoes`, `BotaoIcone` e `Avatar` têm contrato, versão web, export e teste. A grade ganha só 76 e 960.

**Independent Test**: `packages/design-system/tests/web/componentes-5.test.tsx` cobre AC-10, e `tokens.css` contém `--bottom-bar-height: 76px` e `--content-max-width: 960px`. Nenhum desses componentes é montado nas rotas de produto.

### Tests for User Story 3 ⚠️

> **NOTE: Write these tests FIRST, ensure they FAIL before implementation**

- [X] T011 [US3] Criar `packages/design-system/tests/web/componentes-5.test.tsx` com `// @vitest-environment jsdom` na primeira linha, no estilo de `packages/design-system/tests/web/componentes.test.tsx`. O arquivo falha até T023: `Switch` expõe `aria-checked` e alterna, e desabilitado não alterna; `MenuAcoes` abre, fecha com Esc, não renderiza ação destrutiva fora do menu, e o callback destrutivo só corre depois de confirmar; `CampoData` com erro liga a mensagem por `aria-invalid="true"` e `aria-describedby`; `Tabela` exige `caption` e marca a linha de `selecionadaId` com `aria-selected="true"`. Cobrir também `CampoBusca` (`type="search"`, botão limpar, `aria-controls`), `BotaoIcone` (`aria-label`) e `Avatar` (`aria-hidden` quando o nome está ao lado). `ShellApp` renderiza `NavegacaoPrincipal` com o id `ativa` recebido

### Implementation for User Story 3

- [X] T012 [US3] Declarar em `packages/design-system/src/base/contratos.ts` as props de `ShellApp`, `Tabela`, `CampoBusca`, `CampoData`, `Switch`, `MenuAcoes`, `BotaoIcone` e `Avatar`. Restrições literais: `Tabela.caption` é string obrigatória; colunas têm `id`, `rotulo` e `tipo` `texto` ou `numero`; `selecionadaId` opcional marca `aria-selected="true"`; sem `onSelecionar`, a linha não é botão de seleção; a célula é string já formatada. `CampoBusca.valor` é string, botão limpar com nome acessível padrão "Limpar", `aria-controls` aponta o id do resultado. `CampoData.valor` é `AAAA-MM-DD` ou vazio. `Switch.marcado` é boolean. `BotaoIcone.rotulo` é obrigatório. `Avatar` leva `iniciais` de até duas letras; com o nome ao lado o círculo é `aria-hidden`. `MenuAcoes.acoes` têm `id`, `rotulo`, `destrutivo?` e `onEscolher`. `ShellApp` recebe `abas`, `ativa`, `onNavegar`, `cabecalho` e `children`, e não recalcula `ativa`
- [X] T013 [P] [US3] Em `packages/design-system/src/core/tokens.ts`, acrescentar a `grid` só `bottomBarHeight: 76` e `contentMaxWidth: 960`. Em `packages/design-system/src/core/css.ts`, emitir `--bottom-bar-height` e `--content-max-width`. Não reintroduzir `@font-face`. Não criar campo para 390 nem 1280. Rodar `npm run gen:css`. Em `packages/design-system/tests/tokens-sync.test.ts`, exigir as duas variáveis com `76px` e `960px`
- [X] T014 [P] [US3] Criar `packages/design-system/src/web/shell-app.tsx` com `'use client'`. Classes `mo-shell`, `mo-shell__cabecalho`, `mo-shell__conteudo`, `mo-shell__nav`. A navegação é `NavegacaoPrincipal`. Abaixo de 720 px a barra inferior usa a altura 76; a partir de 720 px a barra lateral usa a largura 240; o conteúdo no desktop não passa de 960. `ativa` é o id recebido. O shell não olha a URL
- [X] T015 [P] [US3] Criar `packages/design-system/src/web/tabela.tsx` com `'use client'` se houver seleção clicável. Classe `mo-tabela`. `caption` vira `<caption>`. Cada `<th>` tem `scope="col"`. Coluna `numero` usa a classe `mo-tabela__numero` (direita, dígitos tabulares). Com `selecionadaId`, a linha correspondente tem `aria-selected="true"`. Sem `onSelecionar`, a linha não é controle. A tabela não converte centavos e não soma
- [X] T016 [P] [US3] Criar `packages/design-system/src/web/campo-busca.tsx` com `'use client'`. Reusar `mo-campo` e `mo-campo__entrada`. `<input type="search">`, rótulo visível, `aria-controls` no id informado. Botão `mo-campo-busca__limpar` com nome acessível padrão "Limpar", que esvazia o valor
- [X] T017 [P] [US3] Criar `packages/design-system/src/web/campo-data.tsx` com `'use client'`. Reusar `mo-campo` e `mo-campo__erro`. `<input type="date" lang="pt-BR">`, rótulo visível, valor `AAAA-MM-DD` ou vazio. Erro não vazio: mensagem abaixo, `aria-invalid="true"`, `aria-describedby` apontando a mensagem. Sem erro, esses atributos saem. Não criar um segundo input mascarado
- [X] T018 [P] [US3] Criar `packages/design-system/src/web/switch.tsx` com `'use client'`. Classe `mo-switch`. Botão `role="switch"` e `aria-checked` igual ao estado. Ativar chama `onMudar` com o booleano oposto. Desabilitado não alterna
- [X] T019 [P] [US3] Criar `packages/design-system/src/web/menu-acoes.tsx` com `'use client'`, depois de T009. Classes `mo-menu-acoes` e `mo-menu-acoes__lista`. Gatilho com ícone `more_vert` e `aria-label` obrigatório. Esc fecha e devolve o foco ao gatilho. Ação sem `destrutivo` chama `onEscolher` e fecha. Ação com `destrutivo` não é renderizada fora do menu; escolhê-la abre o `Dialogo` já existente com `tipoConfirmar` `destrutivo`, título e texto de confirmar iguais ao `rotulo` da ação, e `textoCancelar` "Cancelar". Cancelar não chama `onEscolher`. Confirmar chama
- [X] T020 [P] [US3] Criar `packages/design-system/src/web/botao-icone.tsx` com `'use client'`. Classe `mo-botao-icone`. Só o ícone. `rotulo` obrigatório no tipo e vira `aria-label`
- [X] T021 [P] [US3] Criar `packages/design-system/src/web/avatar.tsx`. Classe `mo-avatar`, iniciais em `mo-avatar__iniciais`, nome em `mo-avatar__nome`. Círculo com fundo `--md-selected` e texto `--md-on-selected`. Quando o nome está ao lado, o círculo tem `aria-hidden="true"` e o nome é o texto. Sem o nome ao lado, o círculo tem nome acessível. Sem evento, sem estado e sem `window`, o arquivo não leva `'use client'`
- [X] T022 [P] [US3] Em `packages/design-system/src/web/base.css`, acrescentar as classes citadas em T014–T021 usando só variáveis de `tokens.css`. A barra do shell só muda dentro de `.mo-shell`; não alterar `.mo-nav` solto. Não inventar medida fora de 76, 960, 720 e 240
- [X] T023 [US3] Exportar os oito componentes e os tipos novos em `packages/design-system/src/web.ts`. Não exportar versão nativa e não editar `src/native.ts`

**Checkpoint**: AC-6, AC-7 e AC-10 passam no pacote. As rotas Resumo, Orçamento, Lançamentos, Ano, Ajustes e Entrada não importam esses componentes.

---

## Phase 6: User Story 4 - Prender e devolver o foco (Priority: P2)

**Goal**: `Dialogo` e `FormularioContainer` prendem Tab e Shift+Tab e, ao fechar, devolvem o foco a quem abriu.

**Independent Test**: `packages/design-system/tests/web/foco.test.tsx` em jsdom, sem subir o Next.

### Tests for User Story 4 ⚠️

> **NOTE: Write these tests FIRST, ensure they FAIL before implementation**

- [X] T024 [US4] Criar `packages/design-system/tests/web/foco.test.tsx` com `// @vitest-environment jsdom`. Para `Dialogo` e para `FormularioContainer`: com `aberto`, Tab no último focoável volta ao primeiro e Shift+Tab no primeiro vai ao último; ao fechar, o foco volta ao botão que estava ativo quando o painel abriu. Confirmar que o teste falha antes de T026

### Implementation for User Story 4

- [X] T025 [US4] Criar `packages/design-system/src/web/foco.ts` com `'use client'`. Ao abrir, guardar `document.activeElement`, focar o primeiro focoável do painel e circular Tab e Shift+Tab só dentro do painel. Ao fechar, devolver o foco ao elemento guardado se ele ainda estiver no documento. Não exportar esse módulo em `src/web.ts`
- [X] T026 [P] [US4] Ligar `packages/design-system/src/web/dialogo.tsx` a `foco.ts`. Escape continua chamando `onCancelar`. Manter `'use client'`
- [X] T027 [P] [US4] Ligar `packages/design-system/src/web/formulario-container.tsx` a `foco.ts`. Escape continua chamando `onCancelar`. Manter `'use client'`

**Checkpoint**: AC-8 passa. Esta história não depende dos componentes novos nem dos ícones.

---

## Phase 7: User Story 5 - Gravar capturas sem aprovar baseline (Priority: P3)

**Goal**: Cada componente novo é fotografado em claro e escuro, a 390 px e a 1280 px, e o teste não compara baseline.

**Independent Test**: `npx playwright test -c tests/visual/playwright.config.ts` termina sem erro, grava 32 PNG em `tests/visual/out/` e não cria `tests/visual/__snapshots__`.

### Tests for User Story 5 ⚠️

- [X] T028 [P] [US5] Acrescentar `tests/visual/out/` ao `.gitignore` sem apagar as outras linhas do arquivo
- [X] T029 [P] [US5] Criar `tests/visual/playwright.config.ts` com `testDir` neste diretório, sem `webServer` e sem reutilizar `playwright.config.ts` de `e2e/`
- [X] T030 [P] [US5] Criar `tests/visual/catalogo.spec.ts`. Para cada um dos oito componentes, renderizar com `react-dom/server`, aplicar `packages/design-system/src/core/tokens.css` e `packages/design-system/src/web/base.css`, e gravar `{componente}-light-390.png`, `{componente}-dark-390.png`, `{componente}-light-1280.png` e `{componente}-dark-1280.png` em `tests/visual/out/`. `data-theme` é `light` ou `dark`. Não usar `toMatchSnapshot`. Não criar `tests/visual/__snapshots__`. O teste só falha se a renderização ou a gravação falhar

**Checkpoint**: AC-11 está pronto para o PM olhar as imagens. O comando não entra em `npm test` nem em `npm run test:e2e`.

---

## Phase 8: Polish & Cross-Cutting Concerns

**Purpose**: O portão da spec e a conferência de que o recorte não vazou.

- [X] T031 [P] Procurar `console.log`, `any` e `TODO` introduzidos por esta história nos arquivos de T004–T030 e remover os que ela criou
- [X] T032 [P] Conferir que `src/domain` não mudou de regra, que `android/` não entrou no diff desta história, e que `src/app/globals.css`, `src/app/material-theme.css` e `@material/web` continuam. As rotas de Resumo, Orçamento, Lançamentos, Ano, Ajustes e Entrada não foram reescritas
- [X] T033 Seguir o portão de `specs/040-ds-integrado-next/quickstart.md` na raiz, nesta ordem: `npm test`, `npm test --prefix packages/design-system`, `npx tsc --noEmit`, `npm run build`. Os quatro terminam sem erro
- [X] T034 Rodar `npx playwright test -c tests/visual/playwright.config.ts`. Existem 32 PNG em `tests/visual/out/` e não existe `tests/visual/__snapshots__`

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: começa agora
- **Foundational (Phase 2)**: depende do Setup e bloqueia todas as histórias
- **Histórias**: dependem da fundação
- **Polish (Phase 8)**: depende das histórias que entrarem na entrega. O portão completo pede as cinco

### User Story Dependencies

- **User Story 1 (P1)**: depois da fundação. Não depende das outras
- **User Story 2 (P2)**: depois da fundação. Não depende das outras
- **User Story 3 (P2)**: T019 (`MenuAcoes`) depende de T009 (`more_vert`). O restante da história 3 não depende da história 2. A história 3 não depende da história 4: a confirmação usa o `Dialogo` que já existe
- **User Story 4 (P2)**: depois da fundação. Não depende das histórias 1, 2 ou 3
- **User Story 5 (P3)**: depende da história 3, porque fotografa os oito componentes

### Within Each User Story

- Teste de AC-8, AC-9 e AC-10 falha antes da implementação correspondente
- Contrato (T012) antes dos arquivos de componente
- `web.ts` (T023) depois dos oito arquivos
- Captura (T030) depois dos componentes e do CSS (T022)

### Parallel Opportunities

- T001, T002 e T003 em paralelo
- Depois de T004: histórias 1, 2 e 4 em paralelo
- T005, T006 e T007 em paralelo
- T009 e T010 em paralelo, depois de T008
- T013 e T014–T022 em paralelo, depois de T012; T019 espera T009
- T026 e T027 em paralelo, depois de T025
- T028, T029 e T030 em paralelo entre si, depois da história 3
- T031 e T032 em paralelo, antes de T033

---

## Parallel Example: User Story 1

```bash
Task: "T005 css.ts sem @font-face e --font-family com var(--font-manrope)"
Task: "T006 ThemeProvider grava mo-tema"
Task: "T007 layout.tsx com next/font/local, script e os dois CSS"
```

## Parallel Example: User Story 3

```bash
# Depois de T012, e de T009 no caso do menu:
Task: "T014 shell-app.tsx"
Task: "T015 tabela.tsx"
Task: "T016 campo-busca.tsx"
Task: "T017 campo-data.tsx"
Task: "T018 switch.tsx"
Task: "T019 menu-acoes.tsx"
Task: "T020 botao-icone.tsx"
Task: "T021 avatar.tsx"
Task: "T022 base.css"
```

## Parallel Example: User Story 4

```bash
# Depois de T025:
Task: "T026 dialogo.tsx usa foco.ts"
Task: "T027 formulario-container.tsx usa foco.ts"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Completar Phase 1 e Phase 2
2. Completar Phase 3 (tema e Manrope)
3. **STOP and VALIDATE**: os passos de tema e fonte do `quickstart.md`
4. As telas atuais seguem no ar, com a fonte nova no layout

### Incremental Delivery

1. Setup + fundação
2. História 1 → tema sem flash (MVP)
3. História 2 → ícones, em paralelo com a história 4 (foco)
4. História 3 → oito componentes, com o menu depois do ícone `more_vert`
5. História 5 → 32 capturas para o PM
6. Phase 8 → os quatro comandos do AC-12

### Parallel Team Strategy

1. Todos fecham Setup e fundação
2. Em seguida: uma pessoa na história 1, outra na 2, outra na 4
3. A história 3 começa nos componentes que não são o menu; `MenuAcoes` espera a história 2
4. A história 5 espera a história 3

---

## Notes

- [P] = arquivos diferentes, sem depender de tarefa incompleta
- Spec `ready`. A pasta `specs/040-replicar-front-prototipo` continua Cancelled e não recebe tarefa
- Não criar rota pública de catálogo, biblioteca de foco, versão nativa dos oito componentes, nem alias `--font-roboto`
- Parar em qualquer checkpoint e provar só aquela história
