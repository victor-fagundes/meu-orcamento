# Contract: Auth & Session (Android ↔ Better Auth)

## Purpose

Uma conta de produção autentica o app Android e o web no mesmo orçamento.

## Endpoints (existing)

| Method | Path | Use |
|--------|------|-----|
| POST | `/api/auth/sign-in/email` | Email + senha |
| POST | `/api/auth/sign-up/email` | Cadastro (paridade web) |
| POST | `/api/auth/sign-out` | Encerra sessão |
| GET | `/api/auth/get-session` | Valida sessão persistida |
| * | fluxos de reset já no web | Abrir URL HTTPS de produção ou fluxo in-app equivalente (FR-008) |

Exact Better Auth paths follow the installed better-auth version; client must use the same base URL as `BETTER_AUTH_URL` in production.

## Session rules

1. After successful sign-in, persist cookies (or bearer if enabled) securely.
2. App restart without sign-out → still signed in if server session valid.
3. Sign-out or 401 on API → clear local session; require credentials before private data.
4. No `demo@local.test` path on release APK.
5. Release APK base URL = production only.

## Error UX

| Case | Client behavior |
|------|-----------------|
| Wrong password | Clear error; remain signed out |
| Network down at login | Recoverable error; no fake budget |
| Network down while signed in | Offline/error state on data calls; no local orçamento |
| Server invalidated session | Treat as signed out |

## Privacy

Telemetry (if any) must not include email, names, or raw description text.

## Android notes (027)

- Native OkHttp sends `Cookie` headers to the same host as `BETTER_AUTH_URL`; browser CORS does not apply.
- Server `trustedOrigins` remains the production/dev `BETTER_AUTH_URL` (no Android package origin). Cookie jar persistence is the session store on device.
- API v1 uses `requireApiSession` (401 JSON) — never `redirect("/login")`.
