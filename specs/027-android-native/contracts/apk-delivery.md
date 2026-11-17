# Contract: APK Delivery

## Purpose

Installable Android client without Play Store in this feature.

## Requirements

| Item | Rule |
|------|------|
| Format | Release **APK** (sideload / emulator) |
| minSdk | API 34 (Android 14+) |
| Launcher | Product name + icon |
| Release base URL | Production only (`BETTER_AUTH_URL` / live site) |
| Debug base URL | May use localhost or tunnel; **not** for DoD acceptance |
| Intermediate APKs | Allowed for smoke (auth, core, …) |
| `implemented` | Only when FR-002 full parity is met |
| Play Store | Out of scope |

## Acceptance APK

1. Built as release (or equivalent signed APK used for PM smoke).
2. Points at production cloud.
3. Installs on Android 14+ device or emulator.
4. Completes quickstart scenarios against a real production account.

## Artifacts location

APKs and signing material stay in the workspace/CI paths agreed in tasks — **not** loose under user `Downloads` as the only copy of source; distribution copy for the PM phone may be copied intentionally for sideload.
