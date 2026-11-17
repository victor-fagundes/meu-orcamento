# Implementation Plan: Ajustes no Android

**Branch**: `035-android-ajustes` | **Date**: 2026-11-17 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `/specs/035-android-ajustes/spec.md`

## Summary

Ajustes mostra o e-mail da sessão, sai da conta, lista e cria cartões, desativa com confirmação e grava o limite de alerta entre 1 e 100. As rotas já existem: `GET /api/v1/conta`, `GET` e `POST /api/v1/cartoes`, a inativação que a rota de cartões já expõe, e `GET` e `PUT /api/v1/limites`. Apelido vazio e limite inválido não chamam a API. Importar e exportar entram como linhas desta tela, e os fluxos ficam na spec 036.

Spec `draft`.

## Technical Context

**Language/Version**: Kotlin, Compose

**Primary Dependencies**: Rotas de conta, cartões e limites. `AuthRepository` para sair.

**Storage**: N/A

**Testing**: Roteiro `quickstart.md` cruzado com o computador. Validação de limite pode ser uma função pura no módulo Android.

**Target Platform**: Android 14+

**Project Type**: App nativo

**Performance Goals**: Abrir Ajustes com as três leituras atuais.

**Constraints**: Não criar outro método de senha. Não apagar lançamentos ao desativar cartão. Limite fora de 1 a 100 não grava.

**Scale/Scope**: Uma tela e três destinos que só navegam para a 036.

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- **I. Domain purity**: Passa. Limite e cartão são gravados pelas funções que o computador já usa.
- **II. Integer money**: Passa. Esta tela não mexe em centavos. O limite é percentual inteiro.
- **III. Spec-driven**: Passa com ressalva. `draft` até `ready`.
- **IV. Vertical slice**: Passa. A tela e as rotas existentes. A 036 é outra spec, e aqui só há a entrada.
- **V. Simplicity**: Passa. Os três botões soltos no `AppNav` descem para esta tela.

**Revisão pós-design**: Passa.

## Project Structure

### Documentation (this feature)

```text
specs/035-android-ajustes/
├── plan.md
├── research.md
├── data-model.md
├── quickstart.md
├── contracts/
│   └── ajustes-android.md
└── tasks.md
```

### Source Code (repository root)

```text
android/app/src/main/java/app/meuorcamento/ui/ajustes/AjustesScreen.kt
android/app/src/main/java/app/meuorcamento/ui/navigation/AppNav.kt
```

**Structure Decision**: A navegação para planilha, PDF e exportação continua as rotas que o `AppNav` já tem. Ajustes só deixa de desenhar esses botões fora da tela.

## Complexity Tracking

Nenhuma violação. Tabela não se aplica.
