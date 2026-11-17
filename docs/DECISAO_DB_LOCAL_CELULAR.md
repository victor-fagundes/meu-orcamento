# Decisão — Ambiente de teste vs produção

**Data:** 08/11/2026  
**Status:** Clarificada (substitui interpretação “só no celular”)

## Decisão (D-06 revisada)

| Ambiente | Onde rodam os dados |
|----------|---------------------|
| **Teste / dev** | **PGlite** (Postgres em WASM em `data/pglite`) — sem Neon, sem Docker |
| **Produção (futuro)** | **PostgreSQL na nuvem** (Neon/Vercel) — arquitetura original |

- Arquitetura **mantida**: Next.js + Drizzle + Better Auth + domínio em centavos.
- “Local” no teste = máquina/dev, **não** “só IndexedDB no celular”.
- App mobile (PWA/loja) e sync multi-aparelho ficam para quando a nuvem estiver no ar.

## Produção

Publicado em 2026-11-17 pela spec 024: app em `https://meu-orcamento-victor.vercel.app` (Vercel, `gru1`) e Postgres no Neon `aws-sa-east-1`, projeto `meu-orcamento`. Desenvolver continua sem Neon, no PGlite.

## Não fazer no desenvolvimento

- Conta Neon obrigatória para desenvolver
- Pivot para PWA-only / DB só no aparelho
