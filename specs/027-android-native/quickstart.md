# Quickstart: Android Native validation

Validate FR/SC against **production** with a **release APK** (SC-007). Intermediate debug APKs may be used earlier for smoke only.

## Prerequisites

- Production app up (`BETTER_AUTH_URL`, e.g. `https://meu-orcamento-victor.vercel.app`)
- Account that already has lançamentos on web
- Android 14+ emulator or physical device with “install unknown apps” allowed
- JDK 17+ and Android SDK (see `android/README.md`)
- Release APK: `cd android && ./gradlew :app:assembleProdRelease` → `android/app/build/outputs/apk/prod/release/`
- API v1 must be deployed to production (same Vercel app) before prod APK acceptance
- Optional: second browser session logged into the same account on web

## 1. Install

1. Install the **prod** release APK (sideload).
2. Confirm launcher shows **Meu Orçamento**.

**Expect**: SC-006 — app launches without Play Store.

## 2. Sign-in (US1)

1. Open app **online**.
2. Sign in with the production account (not `demo@local.test`).
3. Confirm Resumo/home shows existing data (matches web spot-check).
4. Force-stop and relaunch → still signed in.
5. Sign out → relaunch → must sign in again.
6. Airplane mode with no session → clear message that connectivity is required (no empty fake budget).

**Expect**: SC-001 (&lt; 3 minutes after APK installed); FR-001; FR-012.

## 3. Core + parity walk (US2)

While signed in (online):

1. Resumo — note ≥ 3 totals; compare to web same competência (SC-003).
2. Orçamento — open plan for the month.
3. Lançamentos — create one lançamento (integer cents).
4. On web, refresh within 1 minute → same lançamento (SC-002).
5. Edit or delete on Android → last write wins if you also touch web.
6. Ano → opens and shows year data consistent with web.
7. Ajustes → cartões / alertas / conta reachable.
8. Import **or** export smoke (planilha/PDF within 4 MB, or CSV/JSON export).

**Expect**: SC-004 (no float money); SC-005 (&lt; 30 minutes); FR-002 / FR-007.

## 4. Offline while signed in

1. Enable airplane mode.
2. Try to load or change data.

**Expect**: Recoverable offline/error; no local-only orçamento (FR-009).

## 5. DoD gate

Code delivery for 027 is `implemented`. PM marks **`verified`** after this quickstart passes on a **prod** release APK against production (and after `/api/v1` is deployed on Vercel).

## References

- [contracts/auth-session.md](./contracts/auth-session.md)
- [contracts/api-v1.md](./contracts/api-v1.md)
- [contracts/apk-delivery.md](./contracts/apk-delivery.md)
- [data-model.md](./data-model.md)
