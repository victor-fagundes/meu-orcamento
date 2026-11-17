# Implementation Plan: Lançamentos no Android

**Branch**: `033-android-lancamentos` | **Date**: 2026-11-17 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `/specs/033-android-lancamentos/spec.md`

## Summary

A lista de lançamentos deixa de pedir centavos e uma data ISO crua. A pessoa vê valor, data, item e meio, registra em reais, corrige e apaga com confirmação. Criar, corrigir e apagar usam `GET` e `POST /api/v1/lancamentos` e `PATCH` e `DELETE /api/v1/lancamentos/{id}`, que já chamam o domínio do computador. Parcela usa o mesmo `scope` que o computador pergunta. Mês vazio explica e oferece registrar.

Depende do mês da casca 030. Spec `draft`.

## Technical Context

**Language/Version**: Kotlin, Compose

**Primary Dependencies**: Rotas de lançamentos, itens e cartões já publicadas

**Storage**: N/A

**Testing**: O domínio de criar, editar e apagar permanece nos testes existentes. O aparelho segue `quickstart.md`. Um lançamento criado no aparelho é conferido no computador.

**Target Platform**: Android 14+

**Project Type**: App nativo

**Performance Goals**: A lista do mês abre com um GET.

**Constraints**: Centavos inteiros na borda. Valor zero ou negativo não gera POST. Item arquivado não entra no seletor. Sem desfazer, porque o computador não desfaz.

**Scale/Scope**: Uma lista e um formulário de criar e corrigir.

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- **I. Domain purity**: Passa. Competência, parcelas e validação ficam em `createLancamentos`, `updateLancamento` e `deleteLancamentos`.
- **II. Integer money**: Passa. O campo mostra reais. O JSON manda `valorCentavos` inteiro. A conversão é na borda, rejeitando texto ilegível.
- **III. Spec-driven**: Passa com ressalva. `draft` até `ready`.
- **IV. Vertical slice**: Passa. Lista e formulário usam a API que o computador já usa.
- **V. Simplicity**: Passa. Nenhuma rota nova.

**Revisão pós-design**: Passa.

## Project Structure

### Documentation (this feature)

```text
specs/033-android-lancamentos/
├── plan.md
├── research.md
├── data-model.md
├── quickstart.md
├── contracts/
│   └── lancamentos-android.md
└── tasks.md
```

### Source Code (repository root)

```text
android/app/src/main/java/app/meuorcamento/ui/lancamentos/LancamentosScreen.kt
```

**Structure Decision**: Uma tela. O mês vem da casca. As regras não são reescritas em Kotlin.

## Complexity Tracking

Nenhuma violação. Tabela não se aplica.
