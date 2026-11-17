# Implementation Plan: Casca nativa do Android

**Branch**: `030-android-casca` | **Date**: 2026-11-17 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `/specs/030-android-casca/spec.md`

## Summary

A casca que já existe em `AppNav.kt` continua com os cinco destinos na base, ícone e texto. O mês aberto passa a ser um só para Resumo, Orçamento e Lançamentos, mostrado pelo nome civil em português, e trocá-lo não navega nem zera o tipo. O conteúdo ocupa a largura da janela. Falha de rede mostra o aviso e conserva o último conteúdo, em vez de uma lista zerada.

Login permanece. O miolo de cada módulo fica nas specs 031–036. Spec `draft`.

## Technical Context

**Language/Version**: Kotlin, Jetpack Compose, minSdk 34

**Primary Dependencies**: Material3 `NavigationBar` e `Scaffold` já no app. `java.time` com `Locale` pt-BR para o nome do mês.

**Storage**: N/A. Sem cache de orçamento.

**Testing**: O nome do mês e o deslocamento `YYYY-MM` num teste JVM do módulo Android, se o módulo já roda unit test. Senão, o roteiro do aparelho em `quickstart.md`.

**Target Platform**: Android 14+

**Project Type**: App nativo ligado à API já existente

**Performance Goals**: Trocar de destino sem recarregar a conta.

**Constraints**: Não desenhar o miolo das telas. Não criar orçamento local. Não mudar a regra de competência do servidor.

**Scale/Scope**: Uma barra, um estado de mês, um estado de tipo, cinco destinos.

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- **I. Domain purity**: Passa. `shiftMonth` só avança o rótulo `YYYY-MM`. Qual competência um lançamento usa continua no servidor.
- **II. Integer money**: Passa. A casca não soma valor.
- **III. Spec-driven**: Passa com ressalva. `draft` até `ready`.
- **IV. Vertical slice**: Passa. A casca é a entrega. Os módulos já abrem.
- **V. Simplicity**: Passa. Um estado compartilhado no `AppNav`, em vez de cinco meses independentes.

**Revisão pós-design**: Passa.

## Project Structure

### Documentation (this feature)

```text
specs/030-android-casca/
├── plan.md
├── research.md
├── data-model.md
├── quickstart.md
├── contracts/
│   └── casca-android.md
└── tasks.md
```

### Source Code (repository root)

```text
android/app/src/main/java/app/meuorcamento/ui/navigation/AppNav.kt
android/app/src/main/java/app/meuorcamento/ui/CompetenciaPicker.kt
android/app/src/main/java/app/meuorcamento/ui/OfflineBanner.kt
```

**Structure Decision**: O estado mora no `AppNav` e desce para as telas. As specs 031–036 consomem esse estado. Não se cria atividade nova.

## Complexity Tracking

Nenhuma violação. Tabela não se aplica.
