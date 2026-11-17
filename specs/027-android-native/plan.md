# Implementation Plan: Android Native App

**Branch**: `027-android-native` | **Date**: 2026-11-17 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `/specs/027-android-native/spec.md`

## Summary

Entregar um cliente **Android nativo** (Kotlin + Jetpack Compose) com **paridade total** com o web de produção (`https://meu-orcamento-victor.vercel.app` / `BETTER_AUTH_URL`), autenticando na mesma conta Better Auth e operando o mesmo orçamento na nuvem. O app web hoje fala com o domínio via **Server Actions**, não via REST; esta feature adiciona uma **API JSON fina** (`/api/v1/*`) que só encaminha para `src/application/*` (sem fork de regras). Distribuição: APK sideload; APKs intermediários para smoke; DoD só com FR-002. Release APK → produção apenas. Sem offline-first; last-write-wins; sessão persistente até sign-out.

## Technical Context

**Language/Version**: Kotlin 2.x (Android), JVM 17; TypeScript/Next.js 15 no servidor (API v1 + Better Auth existentes)

**Primary Dependencies**: Android — Jetpack Compose, Material 3, Navigation Compose, OkHttp (CookieJar) ou Ktor Client, kotlinx.serialization. Server — Route Handlers Next.js wrapping `src/application/*`, Better Auth (`/api/auth/*`)

**Storage**: Nenhum orçamento local de verdade. Sessão/cookies em armazenamento seguro do app (EncryptedSharedPreferences ou DataStore + cookie jar). Dados de produto só via cloud (Neon via app Next em produção).

**Testing**: JUnit + Compose UI smoke onde couber; Vitest nos handlers/helpers da API v1 se houver lógica de borda; aceite PM via [quickstart.md](./quickstart.md) no emulador/aparelho com APK → produção

**Target Platform**: Android 14+ (API 34+); APK release aponta só para produção. Debug pode apontar para localhost/túnel.

**Project Type**: Mobile app + thin HTTP API no monorepo Next existente

**Performance Goals**: Login + home utilizável &lt; 3 min (SC-001); lançamento Android → web &lt; 1 min (SC-002); walk Resumo→…→import/export &lt; 30 min (SC-005)

**Constraints**: Centavos inteiros (`Long` no cliente; JSON integer); domínio só em `src/domain` (servidor); sem WebView como UI principal; sem Play Store; sem offline cache/queue; trustedOrigins/auth alinhados a produção; import ≤ 4 MB

**Scale/Scope**: Um usuário (PM) + convites; superfície completa do produto web atual; um módulo Gradle `android/`; fatias de APK intermediário até paridade

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Gate | Status | Notes |
|------|--------|-------|
| I. Domain Purity | PASS | Regras de competência/centavos/import permanecem em `src/domain` + `src/application`. Android e `/api/v1` não reimplementam parsers nem math; só UI + transporte. |
| II. Integer Money | PASS | Contrato JSON usa centavos inteiros; Kotlin usa `Long`; proibido `Double`/`Float` para valores persistidos. |
| III. Spec-Driven Delivery | PASS | Spec 027 ativa; status sobe a `ready` antes de código de produto; DoD = FR-002; tasks via `/speckit-tasks`. |
| IV. Vertical Slice | PASS (com fatias) | Cada fatia de implementação entrega API necessária + telas Android usáveis (auth→core→ajustes→import/export). Intermediários OK (FR-013); `implemented` só na paridade. |
| V. Simplicity & Isolation | PASS | Um cliente Android + API fina no Next. Sem segundo banco. Sessão/orcamentoId continua no servidor. Escopo sem iOS/Play/offline-first. |

**Post-design re-check**: PASS. Contratos cobrem auth session, API v1 resources, e entrega APK. Complexidade do projeto `android/` justificada abaixo.

## Project Structure

### Documentation (this feature)

```text
specs/027-android-native/
├── plan.md
├── research.md
├── data-model.md
├── quickstart.md
├── contracts/
│   ├── auth-session.md
│   ├── api-v1.md
│   └── apk-delivery.md
└── tasks.md                 # /speckit-tasks — não criado aqui
```

### Source Code (repository root)

```text
android/                              # novo projeto Gradle
├── app/
│   ├── src/main/java/.../            # Compose UI, navigation, ViewModels
│   ├── src/main/res/                 # ícone launcher, strings
│   └── build.gradle.kts
├── gradle/
└── settings.gradle.kts

src/app/api/auth/[...all]/route.ts   # Better Auth (existente)
src/app/api/v1/                       # novo: JSON Route Handlers
│   ├── resumo/route.ts
│   ├── lancamentos/route.ts
│   ├── ...                           # espelha application/*
src/application/                      # inalterado nas regras; chamado pela API
src/domain/                           # intocado (fonte da verdade)
src/lib/session.ts                    # requireSessionOrcamento reutilizado
```

**Structure Decision**: Monorepo com app Next atual + pasta `android/` no root. A API v1 vive no mesmo deploy Vercel de produção; o APK release embute a base URL de produção. Não criar um backend separado.

## Complexity Tracking

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| Segundo “projeto” no repo (`android/`) | FR-006 exige UI nativa Android, não WebView do site | PWA/WebView rejeitados na spec (paridade nativa total) |
| Nova superfície HTTP `/api/v1` | Server Actions não são consumíveis de forma estável por app nativo | Chamar Server Actions do OkHttp é frágil e não contratual; duplicar domínio no Kotlin viola constituição |
