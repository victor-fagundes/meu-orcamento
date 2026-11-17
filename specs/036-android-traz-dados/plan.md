# Implementation Plan: Trazer e levar dados no Android

**Branch**: `036-android-traz-dados` | **Date**: 2026-11-17 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `/specs/036-android-traz-dados/spec.md`

## Summary

Planilha e PDF passam a mostrar a prévia que o servidor já calcula, e só gravam no confirmar. Cancelar não chama a confirmação. A confirmação de lançamentos devolve `abrirCompetencia`, calculada no servidor com `competenciaDestinoImport`, e o app abre esse mês. Exportar continua nas rotas de CSV e JSON, e um arquivo incompleto não é oferecido. Não há parser no aparelho.

A entrada vem de Ajustes, spec 035. Spec `draft`.

## Technical Context

**Language/Version**: Kotlin na tela. TypeScript só para incluir `abrirCompetencia` na resposta de confirmação, chamando a função de domínio que já existe.

**Primary Dependencies**: Rotas `import/planilha/parse`, `import/planilha/preview`, `import/planilha/confirm`, `import/pdf/parse`, `import/pdf/confirm`, `export/csv`, `export/json`

**Storage**: N/A. O servidor não persiste o arquivo enviado.

**Testing**: `src/domain/navegacao-mes.test.ts` cobre o destino do mês. O aparelho segue `quickstart.md` com uma planilha e um PDF já aceitos no computador.

**Target Platform**: Android 14+

**Project Type**: App nativo mais um campo na resposta de confirmação

**Performance Goals**: Prévia antes de qualquer gravação. Arquivo acima do limite recusado no aparelho, como hoje, em 4 MB, alinhado ao que a rota recusa.

**Constraints**: Não reescrever parser. Não gravar pela metade. Escolha de grupo ausente não grava aquela linha.

**Scale/Scope**: Três telas já existentes.

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- **I. Domain purity**: Passa. O destino do mês é `competenciaDestinoImport`. O parser continua no servidor.
- **II. Integer money**: Passa. Centavos nascem no parser do servidor. O aparelho não converte a planilha.
- **III. Spec-driven**: Passa com ressalva. `draft` até `ready`.
- **IV. Vertical slice**: Passa. Prévia, confirmação e a abertura do mês na mesma entrega.
- **V. Simplicity**: Passa. Um campo na resposta. As telas deixam de confirmar no escuro.

**Revisão pós-design**: Passa. O campo não muda a regra de importação.

## Project Structure

### Documentation (this feature)

```text
specs/036-android-traz-dados/
├── plan.md
├── research.md
├── data-model.md
├── quickstart.md
├── contracts/
│   └── traz-dados-android.md
└── tasks.md
```

### Source Code (repository root)

```text
android/app/src/main/java/app/meuorcamento/ui/importacao/PlanilhaImportScreen.kt
android/app/src/main/java/app/meuorcamento/ui/importacao/PdfImportScreen.kt
android/app/src/main/java/app/meuorcamento/ui/exportacao/ExportScreen.kt
src/app/api/v1/import/planilha/confirm/route.ts
src/domain/navegacao-mes.ts
```

**Structure Decision**: O aparelho chama parse, depois preview, depois confirm. O destino do mês é calculado uma vez, no confirm, com a função que a spec 025 já fixou.

## Complexity Tracking

Nenhuma violação. Tabela não se aplica.
