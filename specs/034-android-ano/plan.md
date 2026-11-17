# Implementation Plan: Ano no Android

**Branch**: `034-android-ano` | **Date**: 2026-11-17 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `/specs/034-android-ano/spec.md`

## Summary

`AnoScreen` mostra planejado e realizado do ano que `GET /api/v1/ano?ano=` já devolve, em lista nativa de borda a borda, com os doze meses acessíveis na horizontal. A pessoa troca o ano. Ano sem valores ganha frase. Falha de rede não mostra outro ano como se fosse o pedido.

Não usa o seletor de mês da casca. Spec `draft`.

## Technical Context

**Language/Version**: Kotlin, Compose

**Primary Dependencies**: `GET /api/v1/ano` já publicado

**Storage**: N/A

**Testing**: Conferência de dez células contra o computador no `quickstart.md`. Sem fórmula nova para testar no Vitest.

**Target Platform**: Android 14+

**Project Type**: App nativo

**Performance Goals**: Um GET por ano.

**Constraints**: Não recalcular competência. Não copiar os cartões do site. Nome longo não esconde o valor.

**Scale/Scope**: Uma tela.

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- **I. Domain purity**: Passa. A grade é a resposta do servidor, montada com `parsePlanoFromJson` e os lançamentos da conta.
- **II. Integer money**: Passa. A tela formata os inteiros recebidos.
- **III. Spec-driven**: Passa com ressalva. `draft` até `ready`.
- **IV. Vertical slice**: Passa. A tela e a rota existente.
- **V. Simplicity**: Passa. Sem campo novo.

**Revisão pós-design**: Passa.

## Project Structure

### Documentation (this feature)

```text
specs/034-android-ano/
├── plan.md
├── research.md
├── data-model.md
├── quickstart.md
├── contracts/
│   └── ano-android.md
└── tasks.md
```

### Source Code (repository root)

```text
android/app/src/main/java/app/meuorcamento/ui/ano/AnoScreen.kt
```

**Structure Decision**: Só a tela. O ano não entra no estado de mês da casca 030.

## Complexity Tracking

Nenhuma violação. Tabela não se aplica.
