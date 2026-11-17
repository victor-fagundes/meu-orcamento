# Implementation Plan: Resumo no Android

**Branch**: `031-android-resumo` | **Date**: 2026-11-17 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `/specs/031-android-resumo/spec.md`

## Summary

`ResumoScreen` deixa de ser uma lista e passa a abrir com "Ainda pode gastar", a frase da parcela gasta, os dias restantes no mês corrente e as quatro linhas de tipo. Os centavos vêm de `totais` na resposta de `GET /api/v1/resumo`, já calculados por `totaisDoMes`. Tocar a linha grava o tipo na casca e abre o Orçamento. Sem `totais`, a tela avisa e não soma no aparelho.

Depende da casca 030 e dos números da 028. Spec `draft`.

## Technical Context

**Language/Version**: Kotlin, Compose. O cálculo continua TypeScript em `src/domain/resumo-mes.ts`.

**Primary Dependencies**: Cliente HTTP já usado pela tela. Sem biblioteca nova.

**Storage**: N/A

**Testing**: Os testes de `totaisDoMes` continuam a prova dos centavos. O aparelho confere a frase, os dias e o toque, no `quickstart.md`.

**Target Platform**: Android 14+

**Project Type**: App nativo

**Performance Goals**: Uma leitura do resumo por mês.

**Constraints**: Não filtrar pagamento. Não recalcular ainda pode gastar no cliente. Receita não entra nesse número.

**Scale/Scope**: Uma tela.

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- **I. Domain purity**: Passa. O aparelho só exibe `totais`. Os dias restantes são calendário civil, não competência.
- **II. Integer money**: Passa. Formatação de centavos inteiros, inclusive negativos, com `formatCentavos`.
- **III. Spec-driven**: Passa com ressalva. `draft` até `ready`.
- **IV. Vertical slice**: Passa. A tela usa a resposta que a 028 já entrega.
- **V. Simplicity**: Passa. Sem campo novo na API.

**Revisão pós-design**: Passa.

## Project Structure

### Documentation (this feature)

```text
specs/031-android-resumo/
├── plan.md
├── research.md
├── data-model.md
├── quickstart.md
├── contracts/
│   └── resumo-android.md
└── tasks.md
```

### Source Code (repository root)

```text
android/app/src/main/java/app/meuorcamento/ui/resumo/ResumoScreen.kt
android/app/src/main/java/app/meuorcamento/ui/navigation/AppNav.kt
```

**Structure Decision**: Só a tela e o tipo compartilhado da casca. `src/domain/resumo-mes.ts` não muda.

## Complexity Tracking

Nenhuma violação. Tabela não se aplica.
