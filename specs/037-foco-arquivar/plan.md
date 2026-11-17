# Implementation Plan: Foco do diálogo e Arquivar no computador

**Branch**: `037-foco-arquivar` | **Date**: 2026-11-17 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `/specs/037-foco-arquivar/spec.md`

**Note**: This template is filled in by the `/speckit-plan` command; its definition describes the execution workflow.

## Summary

No computador, abrir um diálogo leva o foco ao campo certo sem selecionar o texto. Escape continua fechando e devolve o foco a quem abriu. O primeiro Arquivar permanece com o texto curto "Arquivar" e anuncia o nome do item. A confirmação visível passa a "Arquivar {nome}?", e só um item fica armado. Resumo, Orçamento, Lançamentos e Ano ganham uma região principal, com um salto "Ir para o conteúdo" no chrome do app.

Não há regra nova de dinheiro, competência ou arquivamento. A spec permanece `draft` até o PM marcar `ready`. Este plano não autoriza código antes disso.

## Technical Context

**Language/Version**: TypeScript no app web existente (Next.js App Router)

**Primary Dependencies**: React nos componentes de diálogo, campo e botão já usados no computador. Sem biblioteca nova.

**Storage**: N/A. Nenhum dado novo é gravado. Arquivar continua na ação que já existe.

**Testing**: Vitest para o texto visível e o nome anunciado de Arquivar, e para o índice do mês aberto. O foco, o Escape e o salto ao conteúdo são verificação manual no navegador, descrita em `quickstart.md`. Não há suíte e2e no repositório.

**Target Platform**: Computador, navegador. Android fica na spec 032.

**Project Type**: Web app

**Performance Goals**: O foco entra no destino no mesmo instante em que o diálogo aparece. Sem pedido de rede extra.

**Constraints**: Não selecionar texto já preenchido. Não criar diálogo extra. Não mudar centavos, competência nem o desenho dos cartões. Não aninhar duas regiões principais. Status `draft` bloqueia implementação.

**Scale/Scope**: Cinco diálogos (plano, novo item, novo lançamento, editar lançamento, alertas) e quatro telas com região principal. Um usuário por sessão.

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- **I. Domain purity**: Passa. Não há regra de competência, parcela, alerta ou saldo. O índice do mês aberto sai da competência `YYYY-MM` que a tela já tem. O texto de Arquivar fica na interface.
- **II. Integer money**: Passa. Nenhum valor é convertido nem recalculado.
- **III. Spec-driven**: Passa com ressalva de processo. A spec existe e está `draft`. Planejar é permitido. Implementar só depois de `ready`.
- **IV. Vertical slice**: Passa. A entrega inteira é o que a pessoa vê e opera. Não há metade de API adiada, porque a ação de arquivar e a de salvar já existem.
- **V. Simplicity**: Passa. Um ponto de foco no diálogo compartilhado, um item armado na lista do Orçamento, uma região principal por tela e um salto no chrome.

**Revisão pós-design**: Passa. `research.md`, `data-model.md`, `contracts/foco-e-arquivar.md` e `quickstart.md` não introduzem domínio, dinheiro fracionário nem superfície Android.

## Project Structure

### Documentation (this feature)

```text
specs/037-foco-arquivar/
├── plan.md
├── research.md
├── data-model.md
├── quickstart.md
├── contracts/
│   └── foco-e-arquivar.md
└── tasks.md              # ainda não existe; vem de /speckit-tasks
```

### Source Code (repository root)

```text
src/components/material/sheet.tsx          # ao abrir, foca o alvo e não seleciona texto
src/components/material/ui.tsx             # campo e botão aceitam ser o alvo do foco
src/components/plano-sheet.tsx             # alvo = valor do mês aberto
src/components/novo-item-sheet.tsx         # alvo = nome do item
src/components/novo-lancamento-sheet.tsx   # alvo = valor
src/components/editar-lancamento-sheet.tsx # alvo = valor
src/components/alert-banner.tsx            # alvo = Fechar
src/components/arquivar-item-button.tsx    # texto curto, confirmação com nome, um armado
src/components/orcamento-view.tsx          # guarda qual item está armado e passa o mês
src/components/app-chrome.tsx              # salto "Ir para o conteúdo"
src/app/app/resumo/page.tsx                # região principal
src/app/app/orcamento/page.tsx
src/app/app/lancamentos/page.tsx
src/app/app/ano/page.tsx
src/app/app/ajustes/page.tsx               # região que já existe ganha o destino do salto
src/components/arquivar-rotulo.ts          # texto visível e nome anunciado
src/components/arquivar-rotulo.test.ts
```

**Structure Decision**: Tudo fica nos componentes do computador que já desenham o diálogo e as quatro telas. Ajustes não ganha outra região. O chrome não vira região principal, para não aninhar com a de Ajustes. Nenhum arquivo Android entra nesta fatia.

## Complexity Tracking

Nenhuma violação da constituição. Tabela não se aplica.
