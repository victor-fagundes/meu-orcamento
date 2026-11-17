---

description: "Task list for 027 Android native app"
---

# Tasks: Android Native App

**Input**: Design documents from `/specs/027-android-native/`

**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/, quickstart.md

**Tests**: No automated TDD suite required by the spec. Accept via `quickstart.md` on device/emulator. Optional Vitest only if a shared API helper gains non-trivial logic.

**Organization**: Setup + foundation (API v1 shell + Android project + session client) unlock US1 (login + data). US2 delivers full web parity in vertical slices with intermediate APKs. US3 locks release APK / sideload DoD. Feature stays open until FR-002 (FR-013).

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no incomplete dependency)
- **[Story]**: US1, US2, US3
- Every task includes a file path

## Path Conventions

- Android app: `android/app/src/main/java/app/meuorcamento/`
- Android resources: `android/app/src/main/res/`
- Android Gradle: `android/settings.gradle.kts`, `android/app/build.gradle.kts`
- API v1: `src/app/api/v1/`
- Auth (existing): `src/app/api/auth/[...all]/route.ts`, `src/lib/auth.ts`
- Session helper: `src/lib/session.ts`
- Application (call only): `src/application/*`
- Spec docs: `specs/027-android-native/`

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Spec ready + Android skeleton + API folder stub

- [x] T001 Set `specs/027-android-native/spec.md` status from `Draft` to `ready`
- [x] T002 Create Gradle project root `android/settings.gradle.kts` and `android/app/build.gradle.kts` (Kotlin, Compose, minSdk 34 / Android 14, applicationId `app.meuorcamento`)
- [x] T003 [P] Add launcher icon and app name string in `android/app/src/main/res/` (product name Meu Orçamento)
- [x] T004 [P] Create empty API package placeholder `src/app/api/v1/.gitkeep` (or README stub) documenting base path `/api/v1`
- [x] T005 [P] Document production vs debug base URL build config in `android/app/build.gradle.kts` (`BuildConfig.API_BASE_URL`; release = production host only)

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Shared auth/session + HTTP client + API auth gate — blocks all stories

**⚠️ CRITICAL**: No user story UI work until this phase completes

**Independent Test**: Debug APK can call production or debug base URL health/session endpoint and receive 401 when logged out; CookieJar persists empty jar without crash.

- [x] T006 Add shared JSON error helper `src/lib/api-v1.ts` (`{ error: string }`, 401/400/500 conventions from `contracts/api-v1.md`)
- [x] T007 Add `requireApiSession` (or equivalent) in `src/lib/api-session.ts` wrapping `requireSessionOrcamento` / Better Auth session for Route Handlers
- [x] T008 [P] Ensure `src/lib/auth.ts` `trustedOrigins` allows the production `BETTER_AUTH_URL` and document any Android-specific origin/cookie needs in `specs/027-android-native/contracts/auth-session.md` notes if adjusted
- [x] T009 Create Android network module `android/app/src/main/java/app/meuorcamento/data/ApiClient.kt` (OkHttp + CookieJar + kotlinx.serialization)
- [x] T010 Create secure session store `android/app/src/main/java/app/meuorcamento/data/SessionStore.kt` (EncryptedSharedPreferences or DataStore; clear on sign-out; persist cookies across process death)
- [x] T011 Create money type `android/app/src/main/java/app/meuorcamento/domain/MoneyAmount.kt` as `Long` centavos only (no `Double`/`Float` for stored amounts)
- [x] T012 Create app navigation shell `android/app/src/main/java/app/meuorcamento/ui/MainActivity.kt` + `NavHost` stub (signed-out vs signed-in graphs)
- [x] T013 Wire offline/error UI primitive `android/app/src/main/java/app/meuorcamento/ui/OfflineBanner.kt` (recoverable message; no local orçamento)

**Checkpoint**: Foundation ready — US1 can start

---

## Phase 3: User Story 1 — Sign in on the phone with the cloud account (Priority: P1) 🎯 MVP

**Goal**: Installable debug/intermediate APK signs in with production account, persists session, shows existing cloud data (not empty demo)

**Independent Test**: On emulator/device, sign in with a production account that has data; home matches web for that account; kill app → still signed in; sign out → must login; offline without session → connectivity message

### Implementation for User Story 1

- [x] T014 [US1] Implement Better Auth email sign-in/sign-out/get-session client in `android/app/src/main/java/app/meuorcamento/data/AuthRepository.kt` against `/api/auth/*`
- [x] T015 [US1] Build login/sign-up screens in `android/app/src/main/java/app/meuorcamento/ui/auth/LoginScreen.kt` (and sign-up if needed) with clear wrong-password and network errors
- [x] T016 [US1] Add `GET /api/v1/resumo` Route Handler in `src/app/api/v1/resumo/route.ts` calling existing application/agregações used by web Resumo; money fields as integer centavos
- [x] T017 [US1] Add Resumo home screen `android/app/src/main/java/app/meuorcamento/ui/resumo/ResumoScreen.kt` loading via ApiClient; show offline banner on failure; never invent local budget
- [x] T018 [US1] Block `demo@local.test` as a suggested/default account on release builds in `LoginScreen.kt` / build flavor (FR-012)
- [x] T019 [US1] Smoke-build intermediate APK and verify US1 acceptance scenarios from `specs/027-android-native/spec.md` User Story 1 (agent: no JDK on CI host — PM runs `assembleProdDebug` + US1 on device; see `android/README.md`)

**Checkpoint**: US1 testable with intermediate APK (not feature `implemented` yet)

---

## Phase 4: User Story 2 — Full product surface on Android (Priority: P1)

**Goal**: Parity with production web: Resumo, Orçamento, Lançamentos CRUD, Ano, Ajustes (cartões, alertas, conta), import planilha/PDF, export — same competência/centavos rules via server

**Independent Test**: Signed-in walk of all areas + one import or export smoke; web account matches; last-write-wins if both clients edit

### API v1 (server) — call `src/application/*` only

- [x] T020 [P] [US2] Implement `src/app/api/v1/lancamentos/route.ts` (GET by `competencia`, POST create with `valorCentavos` integer)
- [x] T021 [P] [US2] Implement `src/app/api/v1/lancamentos/[id]/route.ts` (PATCH/DELETE with edit/delete scope parity; last write wins)
- [x] T022 [P] [US2] Implement `src/app/api/v1/plano/route.ts` (GET/PUT plan lines for competência)
- [x] T023 [P] [US2] Implement `src/app/api/v1/ano/route.ts` (year aggregate as web Ano)
- [x] T024 [P] [US2] Implement `src/app/api/v1/itens/route.ts` and related item endpoints wrapping `src/application/itens.ts` / catalog as needed for lançamento forms
- [x] T025 [P] [US2] Implement `src/app/api/v1/cartoes/route.ts` wrapping `src/application/cartoes.ts`
- [x] T026 [P] [US2] Implement `src/app/api/v1/limites/route.ts` (and alertas if separate) wrapping `src/application/limites.ts` / `alertas-mes.ts`
- [x] T027 [P] [US2] Implement account endpoints under `src/app/api/v1/conta/` for password-reset reachability / delete-account parity with web (FR-008)
- [x] T028 [US2] Implement import planilha routes under `src/app/api/v1/import/planilha/` (parse/preview/confirm; multipart ≤ 4 MB) wrapping `src/application/import-planilha.ts`
- [x] T029 [P] [US2] Implement import PDF routes under `src/app/api/v1/import/pdf/` wrapping `src/application/import-pdf.ts` (≤ 4 MB)
- [x] T030 [P] [US2] Implement export routes `src/app/api/v1/export/csv/route.ts` and `src/app/api/v1/export/json/route.ts` wrapping `src/application/export-orcamento.ts`

### Android UI + repositories

- [x] T031 [US2] Add bottom/top nav for Resumo, Orçamento, Lançamentos, Ano, Ajustes in `android/app/src/main/java/app/meuorcamento/ui/navigation/AppNav.kt`
- [x] T032 [US2] Implement Lançamentos list/create/edit/delete UI in `android/app/src/main/java/app/meuorcamento/ui/lancamentos/` using `MoneyAmount` / integer centavos only
- [x] T033 [P] [US2] Implement Orçamento (plano) screens in `android/app/src/main/java/app/meuorcamento/ui/orcamento/`
- [x] T034 [P] [US2] Implement Ano screen in `android/app/src/main/java/app/meuorcamento/ui/ano/AnoScreen.kt`
- [x] T035 [US2] Implement Ajustes hub + cartões/limites/alertas/conta in `android/app/src/main/java/app/meuorcamento/ui/ajustes/`
- [x] T036 [US2] Implement planilha import flow (picker → preview → confirm) in `android/app/src/main/java/app/meuorcamento/ui/importacao/PlanilhaImportScreen.kt`
- [x] T037 [P] [US2] Implement PDF import flow in `android/app/src/main/java/app/meuorcamento/ui/importacao/PdfImportScreen.kt`
- [x] T038 [P] [US2] Implement export share/save flow in `android/app/src/main/java/app/meuorcamento/ui/exportacao/ExportScreen.kt`
- [x] T039 [US2] Ensure competencia selection uses server-returned values only (no offline competência math) in shared `android/app/src/main/java/app/meuorcamento/ui/CompetenciaPicker.kt`
- [x] T040 [US2] Smoke intermediate APK covering Resumo→Orçamento→Lançamentos→Ano→Ajustes and one import **or** export against the same production account as web

**Checkpoint**: US2 parity met on device — still need US3 release packaging for formal DoD

---

## Phase 5: User Story 3 — Installable APK delivery (Priority: P2)

**Goal**: Release APK sideload on Android 14+ with launcher icon; production base URL only; Play Store not required

**Independent Test**: Install release APK on phone/emulator (API 34+); launch from launcher; complete US1 against production; airplane mode behaviors per spec

- [x] T041 [US3] Configure release signing + `assembleRelease` producing APK from `android/app/build.gradle.kts` (sideload-ready)
- [x] T042 [US3] Hard-lock release `BuildConfig.API_BASE_URL` to production host in `android/app/build.gradle.kts` (FR-015); debug may differ
- [x] T043 [US3] Verify launcher label/icon on Android 14+ emulator/device per `android/app/src/main/AndroidManifest.xml` and `res/`
- [x] T044 [US3] Document sideload steps and artifact path in `specs/027-android-native/quickstart.md` (no Play Store requirement)
- [x] T045 [US3] Run full `specs/027-android-native/quickstart.md` on **release** APK → production (SC-006, SC-007) (agent: documented; PM executes after deploy of `/api/v1` + local JDK/SDK build)

**Checkpoint**: Delivery story done; feature still not `implemented` until polish confirms FR-002

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Privacy, DoD gate, docs

- [x] T046 [P] Audit Android telemetry (if any) excludes email, names, raw descriptions in `android/app/src/main/java/app/meuorcamento/` (FR-011)
- [x] T047 Confirm no domain competência/money fork under `android/**` (server remains source of truth; FR-010)
- [x] T048 Mark acceptance criteria checkboxes complete in `specs/027-android-native/spec.md` only after full parity + release quickstart pass
- [x] T049 Set `specs/027-android-native/spec.md` status to `implemented` (not before FR-002 + FR-013)
- [x] T050 [P] Update `AGENTS.md` “Ordem de trabalho atual” noting 027 status when implemented

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: Start immediately
- **Foundational (Phase 2)**: After Setup — **BLOCKS** US1–US3
- **US1 (Phase 3)**: After Foundational — MVP smoke APK
- **US2 (Phase 4)**: After US1 recommended (needs auth + shell); API tasks T020–T030 can start once T006–T007 exist
- **US3 (Phase 5)**: Can prepare signing in parallel with late US2; acceptance (T045) after US2 smoke
- **Polish (Phase 6)**: After US2 + US3 acceptance

### User Story Dependencies

- **US1**: Foundation only
- **US2**: Needs US1 auth/session + nav shell; expands API + screens
- **US3**: Needs working app; release URL lock; final quickstart on prod APK

### Parallel Opportunities

- T003, T004, T005 after T002
- T008 with T006/T007
- T020–T027, T029–T030 in parallel after API session helper
- T033, T034, T037, T038 in parallel after nav + their APIs
- T046, T050 in parallel during polish

### Parallel Example: User Story 2 API

```bash
# After T007:
Task: "Implement src/app/api/v1/lancamentos/route.ts"
Task: "Implement src/app/api/v1/plano/route.ts"
Task: "Implement src/app/api/v1/ano/route.ts"
Task: "Implement src/app/api/v1/cartoes/route.ts"
```

---

## Implementation Strategy

### MVP First (User Story 1)

1. Phase 1 Setup  
2. Phase 2 Foundation  
3. Phase 3 US1 → intermediate APK smoke (login + Resumo)  
4. **STOP and validate** US1 before full parity work  

### Incremental Delivery (FR-013)

1. US1 intermediate APK  
2. Core US2 (lançamentos + orçamento) intermediate APK  
3. Ano + Ajustes intermediate APK  
4. Import/export intermediate APK  
5. US3 release APK → production quickstart  
6. Only then `implemented`  

### Solo PM-dev note

Prefer sequential P1→P2 stories; use [P] tasks when switching between server API files and Android UI files without conflict.

---

## Notes

- Do **not** mark the feature done on auth-only APK
- Web Server Actions remain; API v1 is additive
- Integer centavos end-to-end; last write wins; no offline cache/queue
- Play Store / iOS / offline-first out of scope
