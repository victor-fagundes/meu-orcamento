# Implementation Plan: Aparência Material no Android

**Branch**: `038-material-android` | **Date**: 2026-11-17 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `/specs/038-material-android/spec.md`

## Summary

O app instalado passa a mostrar a hierarquia do modo Android do protótipo de 17 de novembro, com as cores do Material já aceito. A barra de cima é o mês (ou o ano, ou "Ajustes"). O valor principal usa tamanho de display. As listas alinham o valor à direita. A navegação marca o destino com pílula e nome. A entrada mostra a marca amarela, um botão preenchido e "Criar conta" como texto. Claro e escuro seguem o aparelho.

Nenhuma rota, nenhum cálculo e nenhuma tela do computador mudam. Spec `draft` até `ready`.

## Technical Context

**Language/Version**: Kotlin, Jetpack Compose, minSdk 34, Material3 já no módulo `android/`

**Primary Dependencies**: `MaterialTheme`, `NavigationBar`, `ModalBottomSheet`, `FilterChip`, `Button` e `TextButton`. Sem biblioteca visual nova.

**Storage**: N/A. Nenhum cache de orçamento e nenhuma preferência de tema gravada.

**Testing**: Roteiro do aparelho em `quickstart.md`. `corBarra` continua a função pura já existente; não se cria suíte de screenshot.

**Target Platform**: Android 14+, o mesmo pacote de produção (`app.meuorcamento`) que fala com o site publicado.

**Project Type**: App nativo sobre a API existente.

**Performance Goals**: Trocar de destino e de tema sem novo pedido além dos que as telas já fazem ao abrir.

**Constraints**: Não alterar centavos, competência, parcelas, importação, exportação nem o computador. Não criar botão flutuante. Não mover "Esqueci a senha" para a entrada. Amarelo `#FFE600` só na marca. Aviso `#8A7000` no claro e `#D7B07A` no escuro. Azul de ação `#0058BE`.

**Scale/Scope**: Tema, barra do mês, cinco destinos, Resumo, entrada, Orçamento com painel, Lançamentos, Ano e Ajustes. Importar e exportar só herdam a barra de título.

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- **I. Domain purity**: Passa. Nenhuma função de `src/domain` é reescrita. O app continua exibindo os totais que a API já manda.
- **II. Integer money**: Passa. `formatCentavos` e `reaisParaCentavos` permanecem a borda. A história não soma.
- **III. Spec-driven**: Passa com ressalva. Status `draft`. Implementar só depois de `ready`.
- **IV. Vertical slice**: Passa. A entrega é a interface usável nas telas já ligadas à API. Não há API nova.
- **V. Simplicity**: Passa. Um tema e barras compartilhadas. As telas existentes mudam de composição, sem atividade nova.

**Revisão pós-design**: Passa. O contrato é de apresentação. O modelo não cria entidade persistida.

## Project Structure

### Documentation (this feature)

```text
specs/038-material-android/
├── plan.md
├── research.md
├── data-model.md
├── quickstart.md
├── contracts/
│   └── aparencia-android.md
└── tasks.md
```

### Source Code (repository root)

```text
android/app/src/main/java/app/meuorcamento/ui/theme/Tema.kt
android/app/src/main/java/app/meuorcamento/ui/MainActivity.kt
android/app/src/main/java/app/meuorcamento/ui/CompetenciaPicker.kt
android/app/src/main/java/app/meuorcamento/ui/navigation/AppNav.kt
android/app/src/main/java/app/meuorcamento/ui/auth/LoginScreen.kt
android/app/src/main/java/app/meuorcamento/ui/resumo/ResumoScreen.kt
android/app/src/main/java/app/meuorcamento/ui/orcamento/OrcamentoScreen.kt
android/app/src/main/java/app/meuorcamento/ui/lancamentos/LancamentosScreen.kt
android/app/src/main/java/app/meuorcamento/ui/ano/AnoScreen.kt
android/app/src/main/java/app/meuorcamento/ui/ajustes/AjustesScreen.kt
```

**Structure Decision**: `Tema.kt` concentra cor, tipo do valor e a marca. `CompetenciaPicker` vira a barra do mês, usada por Resumo, Orçamento e Lançamentos. O ano confirmado continua dentro de `AnoScreen`, porque a grade só troca depois da resposta. `AppNav` só ajusta a pílula da barra de baixo. Importar planilha, PDF e exportar ganham o mesmo título de barra, sem fluxo novo.

## Complexity Tracking

Nenhuma violação. Tabela não se aplica.
