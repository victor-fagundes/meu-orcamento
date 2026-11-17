# Meu Orçamento — Android (spec 027)

Native Kotlin + Jetpack Compose client. **minSdk 34 (Android 14+)**.

## Flavors

| Flavor | `API_BASE_URL` |
|--------|----------------|
| `dev` | `http://10.0.2.2:3000` (emulator → host Next) |
| `prod` | `https://meu-orcamento-victor.vercel.app` (release / acceptance) |

## Build (requires JDK 17+ and Android SDK)

```bash
cd android
# First time: install Android Studio or cmdline-tools, then:
./gradlew :app:assembleProdDebug    # intermediate smoke
./gradlew :app:assembleProdRelease  # acceptance APK (FR-015)
```

APK output (typical):

- `android/app/build/outputs/apk/prod/release/app-prod-release-unsigned.apk`

Sign for device install if needed (`apksigner` / Android Studio Generate Signed Bundle).

## Sideload

1. Enable install from unknown sources on Android 14+.
2. Install the **prod** release APK.
3. Sign in with a production account (not `demo@local.test`).
4. Follow `specs/027-android-native/quickstart.md`.

Play Store is out of scope for this feature.
