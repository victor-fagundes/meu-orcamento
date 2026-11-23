# Implementation Plan: Acabamento do Android

**Branch**: `039-acabamento-android` | **Date**: 2026-11-17 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `/specs/039-acabamento-android/spec.md`

## Summary

O app instalado passa a repetir `prototype/2026-11-17-acabamento.html`: ícone M no amarelo, splash da mesma marca, entrada com a frase, número principal mais pesado, linha com valor à direita, medidor com trilha e Ajustes com os mesmos menus e ícones do site.

A regra de competência, o plano de exemplo e a lista de arquivados continuam no servidor. O aparelho não recalcula fatura. Três entradas novas na API existente cobrem o que o site hoje faz só na página: simular, listar arquivados e carregar exemplo. Excluir conta usa o `DELETE /api/v1/conta` que já existe. O computador e o login do site não mudam.

Spec `Draft` até `ready`. Sem `ready`, não implementar.

## Technical Context

**Language/Version**: Kotlin, Jetpack Compose, minSdk 34, compile/target 35. API em Next.js 15 e TypeScript.

**Primary Dependencies**: Material3 e ícones estendidos já no módulo `android/`. Fonte Manrope (OFL) em `res/font`. Splash nativa do Android 12+, sem biblioteca extra. Nenhuma dependência nova de rede.

**Storage**: N/A no aparelho. Nenhum cache de orçamento e nenhuma preferência de tema. Exemplo e exclusão gravam pelos mesmos casos de uso do site.

**Testing**: Roteiro do aparelho em `quickstart.md`. A regra de competência já tem teste de domínio. As rotas novas são envoltório. Não se cria suíte de screenshot.

**Target Platform**: Android 14+, pacote de produção `app.meuorcamento`, API `https://meu-orcamento-victor.vercel.app` no sabor prod.

**Project Type**: App nativo sobre a API existente, com três entradas novas que chamam funções já existentes.

**Performance Goals**: Abrir Ajustes lista os menus sem esperar a rede. Cada menu pede dados ao ser aberto. A splash entrega a primeira tela sem flash branco.

**Constraints**: Centavos, competência, parcelas, importação, exportação e o computador ficam como estão. Sem Google, biometria, notificação, seletor de tema ou botão flutuante. Amarelo `#FFE600` só na marca, no ícone e na splash. Azul de ação `#0058BE`. Aviso `#8A7000` / `#D7B07A`. Erro `#BA1A1A` / `#FFB4AB`. `versionCode` sobe de 1 para 2 para a entrega instalar por cima.

**Scale/Scope**: Ícone, splash, tema com tipo, seis telas e os destinos de Ajustes. Quatro menus ainda não existem no app: simulador, arquivados, exemplo e excluir conta.

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- **I. Domain purity**: Passa. `competenciaCartao` e `competenciasParcelas` continuam em `src/domain/competencia.ts`. O app recebe a lista pronta. `applyExamplePlans` e `listItensArquivados` continuam na aplicação.
- **II. Integer money**: Passa. O exemplo grava centavos inteiros pelo caso de uso que o site já usa. O app não soma.
- **III. Spec-driven**: Passa com ressalva. Status `Draft`. Implementar só depois de `ready`.
- **IV. Vertical slice**: Passa. Menus novos chegam com a tela e com a entrada de API na mesma história. Não se fecha “só rota”.
- **V. Simplicity**: Passa. Importar, exportar, cartões e limites reaproveitam as telas atuais. A exclusão reaproveita `DELETE /api/v1/conta`.

**Revisão pós-design**: Passa. O contrato de API é o mínimo para o aparelho não copiar a regra. O modelo não cria tabela.

## Project Structure

### Documentation (this feature)

```text
specs/039-acabamento-android/
├── plan.md
├── research.md
├── data-model.md
├── quickstart.md
├── contracts/
│   ├── aparencia-android.md
│   └── ajustes-api.md
└── tasks.md
```

### Source Code (repository root)

```text
android/app/src/main/AndroidManifest.xml
android/app/src/main/res/values/themes.xml
android/app/src/main/res/mipmap-anydpi-v26/
android/app/src/main/res/font/
android/app/src/main/java/app/meuorcamento/ui/theme/Tema.kt
android/app/src/main/java/app/meuorcamento/ui/MainActivity.kt
android/app/src/main/java/app/meuorcamento/ui/navigation/AppNav.kt
android/app/src/main/java/app/meuorcamento/ui/auth/LoginScreen.kt
android/app/src/main/java/app/meuorcamento/ui/resumo/ResumoScreen.kt
android/app/src/main/java/app/meuorcamento/ui/orcamento/OrcamentoScreen.kt
android/app/src/main/java/app/meuorcamento/ui/lancamentos/LancamentosScreen.kt
android/app/src/main/java/app/meuorcamento/ui/ano/AnoScreen.kt
android/app/src/main/java/app/meuorcamento/ui/ajustes/AjustesScreen.kt
android/app/build.gradle.kts
src/app/api/v1/competencia/simular/route.ts
src/app/api/v1/itens/route.ts
src/app/api/v1/catalogo/exemplo/route.ts
```

**Structure Decision**: A aparência fica em `Tema.kt`, no ícone adaptativo e no tema da janela. Ajustes vira a lista de menus. Cartões, limites, importar e exportar continuam nos destinos que já existem, abertos a partir da lista, com Ajustes selecionado na barra de baixo. Simulador, arquivados, exemplo e excluir conta são destinos novos no mesmo pacote de UI. A API nova só existe onde o site hoje não oferece rota para o app.

## Complexity Tracking

Nenhuma violação. Tabela não se aplica.
