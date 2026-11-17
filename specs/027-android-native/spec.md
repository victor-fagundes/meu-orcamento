# Feature Specification: Android Native App

**Feature Branch**: `027-android-native`

**Created**: 2026-11-17

**Status**: implemented

**Input**: User description: "o android nativo"

**Related**: Production cloud already live (Vercel + Neon, spec 024). Web app remains the product of record for rules (competência, centavos, import). This feature adds a **full-parity native Android** client so the PM uses the same cloud account and the same product surface as the web. Does not close GAP-003/006/007 by itself. Does not add Open Finance, OCR of photos, or iOS. First distribution is sideload APK only (Play Store later).

## Clarifications

### Session 2026-11-17

- Q: Forma do app (casco WebView vs nativo parcial vs nativo total)? → A: **C** — Paridade total nativa com o web.
- Q: Escopo de telas/fluxos no v1? → A: **C** — Paridade com o web (inclui import/PDF/export e Ajustes).
- Q: Distribuição nesta feature? → A: Por enquanto **só APK** (sideload / emulador); Play Store fora desta fatia.
- Q: A feature só fecha com paridade total, ou APKs intermediários valem para smoke? → A: **B** — APKs intermediários OK para teste; `implemented` / DoD só com paridade total (FR-002).
- Q: Edição concorrente do mesmo lançamento no web e no Android? → A: **A** — Last write wins; sem tela de merge.
- Q: Sessão permanece após reiniciar o app? → A: **A** — Continua autenticado até sign-out explícito (ou invalidação no servidor).
- Q: Já autenticado mas sem rede — o que o app permite? → A: **B** — Sem uso offline dos dados; estado recuperável de offline/erro até a rede voltar.
- Q: APK de release/aceitação aponta só para produção? → A: **A** — APK de release/aceitação → produção apenas.
- Q: Versão mínima do Android? → A: **Android 14** (API 34); abaixo disso fora de escopo.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Sign in on the phone with the cloud account (Priority: P1)

As the product owner on Android, I install the app, sign in with the same account I use on the web production site, and see my existing orçamento — not a second empty local budget.

**Why this priority**: Without shared cloud login, native Android forks the product away from 024.

**Independent Test**: On an Android device or emulator, open the app, sign in with a production account that already has data, and confirm the home/summary matches the web app for that account.

**Acceptance Scenarios**:

1. **Given** a valid production account with lançamentos, **When** the user signs in on Android, **Then** the app shows that account’s data (not demo-only local data).
2. **Given** wrong password or network failure, **When** sign-in is attempted, **Then** the user sees a clear error and is not left in a half-logged state.
3. **Given** the user signs out, **When** they open the app again, **Then** they must sign in again before seeing private data.
4. **Given** a successful sign-in, **When** the user kills and relaunches the app without signing out, **Then** they remain authenticated and see their orçamento (unless the server invalidated the session).

---

### User Story 2 - Full product surface on Android (Priority: P1)

As the product owner, on Android I can do everything I do on the web production app in this product version: Resumo, Orçamento, Lançamentos (criar/editar/excluir/listar), Ano, Ajustes (cartões, alertas, conta), importação de planilha e PDF, e exportação — with the same rules for competência and money.

**Why this priority**: PM chose full parity (not a daily-only subset); a thin shell would not meet that choice.

**Independent Test**: From a signed-in Android session, complete at least one path in each major area (summary, orçamento, create lançamento, open Ano, open Ajustes, run one import or export smoke), then confirm the same account on web still matches.

**Acceptance Scenarios**:

1. **Given** a signed-in user, **When** they use Resumo, Orçamento, Lançamentos, and Ano for a competência, **Then** totals and lists match the web for that account and month.
2. **Given** catalog and cartões already set on web, **When** the user creates, edits, or deletes a lançamento on Android, **Then** the change is visible on web with correct centavos and competência.
3. **Given** a supported planilha or PDF (within existing product limits), **When** the user imports on Android with preview and confirm, **Then** the result matches the web import rules (including duplicates and plan merge behavior already in product).
4. **Given** existing data, **When** the user exports from Android, **Then** they obtain the same kind of export the web offers for that account.

---

### User Story 3 - Installable APK delivery (Priority: P2)

As the product owner, I install Meu Orçamento from an APK (sideload or emulator), with a launcher icon — without requiring Play Store in this feature.

**Why this priority**: Installable presence is required; store listing can wait.

**Independent Test**: Install the APK on a physical Android phone or emulator, launch from the launcher, and complete User Story 1.

**Acceptance Scenarios**:

1. **Given** the release APK for this feature, **When** the user installs it on Android 14+, **Then** the app appears in the launcher with the product name.
2. **Given** the app is installed, **When** the user launches it offline without a prior session, **Then** they see that sign-in requires connectivity (no silent empty fake budget).
3. **Given** a signed-in user loses network, **When** they try to load or change orçamento data, **Then** the app shows a recoverable offline/error state and does not present a local-only orçamento.
4. **Given** this feature’s scope, **When** delivery is complete, **Then** Play Store publication is not required to call the feature done.
5. **Given** intermediate APKs built during implementation, **When** smoke tests run (auth, core flows, etc.), **Then** those installs are allowed for progress — but the feature is not `implemented` until full parity (FR-002) is met.

---

### Edge Cases

- What happens when the production site or API is down?
  → Sign-in and sync fail with a recoverable message; no local-only “shadow” orçamento is created.
- Signed in but phone offline (or API unreachable)?
  → No offline use of orçamento data for this feature; show a recoverable offline/error until network returns. No read-cache guarantee and no write queue.
- What happens when web and Android disagree on a rule?
  → Web/cloud product rules win; Android must not invent different competência or money math.
- What happens on first open with no account?
  → User can reach sign-up or sign-in consistent with production auth (including password reset if already available on web).
- What happens if a web-only capability appears later?
  → Parity target is the production web surface as of this feature’s acceptance; new web-only experiments need an explicit follow-up to land on Android.
- Large import files on mobile network?
  → Same size/format limits as web; clear error if over limit or network fails mid-upload.
- Same lançamento edited on web and Android near the same time?
  → Last write wins; no merge UI on Android. The later successful save replaces the earlier one.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The Android app MUST authenticate against the same production identity as the web cloud app so one account shares one orçamento. After a successful sign-in, the session MUST persist across app restarts until the user explicitly signs out or the server invalidates the session.
- **FR-002**: After sign-in, the Android app MUST provide **full feature parity** with the production web app for this product version: Resumo, Orçamento, Lançamentos (list/create/edit/delete), Ano, Ajustes (including cartões and alerts), planilha import, PDF import, and export.
- **FR-003**: Monetary amounts MUST remain whole centavos end-to-end; the Android client MUST NOT introduce fractional currency in stored values.
- **FR-004**: Competência for cartão and other means MUST follow the same product rules as the web (PRD 5.7 / D-04); Android MUST NOT use a separate offline rule set.
- **FR-005**: The Android app MUST be installable as a launcher application on **Android 14 or newer** (API 34+) via **APK sideload** (emulator or device); older Android versions and Play Store listing are OUT OF SCOPE for this feature.
- **FR-006**: The Android app MUST be a **native** client experience (not a WebView shell of the production site as the primary UI). Native means Android UI and navigation owned by the app, talking to the same cloud product.
- **FR-007**: Import and export on Android MUST honor the same acceptance rules already verified on web (file limits, preview/confirm, duplicates, plan merge, PDF text-only limits).
- **FR-008**: Password reset and account flows already available on production web MUST be reachable from Android at parity (or equivalent in-app flow that hits the same backend).
- **FR-009**: iOS, push notifications, biometric unlock as a required gate, offline-first sync (including read-cache guarantees and offline write queues), Open Finance, and OCR of photographed bills are OUT OF SCOPE for this feature. When signed in without network, the app MUST show a recoverable offline/error state instead of serving a local-only orçamento.
- **FR-010**: This feature MUST NOT replace or fork the domain money/competência rules into a second source of truth; cloud/web product rules remain authoritative.
- **FR-011**: Telemetry on Android, if present, MUST exclude email, names, and raw description content (same privacy bar as web).
- **FR-012**: Demo local user (`demo@local.test`) MUST NOT be required for production Android; production accounts only.
- **FR-013**: Intermediate APKs MAY be used for smoke during development; the feature MUST NOT be marked `implemented` until FR-002 full parity is satisfied.
- **FR-014**: Concurrent edits of the same record from web and Android MUST resolve as **last write wins**; the Android app MUST NOT introduce a conflict-merge UI in this feature.
- **FR-015**: The release/acceptance APK MUST target the **production** cloud only. Non-production backends MAY exist in debug builds during development, but they MUST NOT be how this feature is accepted as done.

### Key Entities

- **Cloud account**: Same user identity as production web.
- **Orçamento session**: Tenant scope already used on web; Android operates inside it after sign-in.
- **Lançamento / plano / cartão / import job**: Same concepts the user already knows on web.
- **Android APK install**: Packaged app with launcher icon, distributed outside Play Store for this feature.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: A production account with existing data is usable on Android after sign-in in under 3 minutes (APK already installed).
- **SC-002**: Creating one lançamento on Android shows up on the web production app within 1 minute without manual database edits.
- **SC-003**: Summary totals for the current competência on Android match web for the same account in a spot-check of at least 3 visible totals.
- **SC-004**: Zero accepted lançamentos store non-integer centavos.
- **SC-005**: PM can walk Resumo → Orçamento → Lançamentos → Ano → Ajustes on Android and complete one import **or** one export smoke in one sitting under 30 minutes on a real phone or emulator.
- **SC-006**: Installation succeeds from the project’s APK on Android 14+ without a Play Store listing.
- **SC-007**: Acceptance of this feature is performed with a release APK that talks to production (same backend as the live web app), not a staging-only environment.

## Assumptions

- Production URL and Neon-backed auth from spec 024 remain the backend of record; release/acceptance APK targets production only (debug may use other backends during build, not for DoD).
- “Paridade total nativa” means product capability parity with web, delivered with a native Android UI — not a WebView wrapper as the main experience.
- Full parity increases delivery size; still one vertical feature for SDD, implemented in slices with intermediate APKs for smoke; DoD / `implemented` is full parity (FR-002), not a daily-only subset.
- Web remains available; Android is an additional client, not a cutover that deletes the web app.
- Solo PM-dev; Play Store, iOS, and offline-first are deferred.
- Architecture’s earlier rejection of mobile frameworks is superseded for Android by this PM decision; tooling choice belongs in `/speckit-plan`, not in this spec.
