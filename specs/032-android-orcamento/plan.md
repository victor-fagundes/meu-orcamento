# Implementation Plan: Orçamento no Android

**Branch**: `032-android-orcamento` | **Date**: 2026-11-17 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `/specs/032-android-orcamento/spec.md`

## Summary

O Orçamento no Android mostra o que ainda cabe no tipo, os grupos com movimento e "Sem movimento neste mês". A frase de estado sai do domínio que o computador já usa, anexada à resposta do resumo, para o aparelho não copiar o limiar. O item abre um sheet no valor do mês, grava pelo `PUT /api/v1/plano` em centavos e cancela sem gravar. Arquivar diz o nome e chama o `DELETE /api/v1/itens?id=` que já arquiva.

Depende da 028, da 030 e do tipo da 031. Spec `draft`.

## Technical Context

**Language/Version**: Kotlin na tela. TypeScript só para anexar a frase já existente em `src/domain/consumo.ts`.

**Primary Dependencies**: Compose, cliente HTTP, rotas `resumo`, `plano` e `itens` já publicadas.

**Storage**: N/A. Plano e arquivamento usam as ações atuais.

**Testing**: Vitest garante que a frase do grupo é a mesma de `textoConsumoDespesa` ou `textoConsumoReceita`. O sheet, o foco e o arquivar seguem `quickstart.md` no aparelho.

**Target Platform**: Android 14+

**Project Type**: App nativo mais um campo na resposta que já existe

**Performance Goals**: Uma leitura do resumo por mês. Salvar plano é um PUT.

**Constraints**: Centavos inteiros. Não usar o amarelo da marca na barra de perto do limite. Não apagar lançamentos ao arquivar. Foco no valor, sem selecionar o texto.

**Scale/Scope**: Uma tela, um sheet, o controle de arquivar.

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- **I. Domain purity**: Passa. A frase chama `textoConsumoDespesa` e `textoConsumoReceita`. O aparelho só mostra a string.
- **II. Integer money**: Passa. O PUT manda `mesesCentavos` inteiros. O texto digitado vira centavos na borda, sem float no domínio.
- **III. Spec-driven**: Passa com ressalva. `draft` até `ready`.
- **IV. Vertical slice**: Passa. Tela, sheet e a frase na mesma resposta.
- **V. Simplicity**: Passa. Nenhum endpoint novo. Um campo `frase` nos totais que já descem.

**Revisão pós-design**: Passa. O campo novo não altera a fórmula da 028.

## Project Structure

### Documentation (this feature)

```text
specs/032-android-orcamento/
├── plan.md
├── research.md
├── data-model.md
├── quickstart.md
├── contracts/
│   └── orcamento-android.md
└── tasks.md
```

### Source Code (repository root)

```text
src/app/api/v1/resumo/route.ts
src/domain/resumo-mes.ts
src/domain/resumo-mes.test.ts
android/app/src/main/java/app/meuorcamento/ui/orcamento/OrcamentoScreen.kt
```

**Structure Decision**: Totais e frase no servidor. Itens do grupo saem de `itens` e `lancamentos` que o resumo já manda. Plano e arquivamento usam as rotas atuais.

## Complexity Tracking

Nenhuma violação. Tabela não se aplica.
