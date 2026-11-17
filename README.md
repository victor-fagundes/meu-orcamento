# Meu Orçamento

Aplicativo de planejamento e controle orçamentário pessoal.

**Workspace Cursor:** `C:\Users\victo\.cursor\projects\meu-orcamento`  
**Método:** Spec-Driven Development (SDD)  
**Stack:** Next.js 15 · TypeScript · Drizzle · PostgreSQL · Better Auth · Vitest · Playwright

---

## Pastas

| Pasta | Conteúdo |
|-------|----------|
| `docs/` | PRD, arquitetura, SDD, sprints, histórias |
| `specs/` | Specs SDD (fonte operacional) |
| `prototype/` | Protótipo HTML de referência UX |
| `src/` | Código (após scaffold) |

## Começar

```bash
# Requer Node.js 20+
copy .env.example .env.local
npm install
npm test
```

**Rodar o app no Windows (fora do Cursor):** dê dois cliques em `start-dev.bat`  
ou no PowerShell/CMD: `npm run dev` na pasta do projeto.

Abra http://localhost:3000 → **Criar conta** → cai em `/app/resumo`.

**Teste local:** PGlite (Postgres WASM em memória).  
**Produção (depois):** Neon/Postgres — mesma schema Drizzle + Better Auth.

1. Ler `docs/ONEPAGER_Meu_Orcamento.md`
2. Ler `docs/SDD_Meu_Orcamento.md`
3. Spec: `specs/001-foundation/` (Auth ok no teste local)

## Releases

- **A** — planejar, lançar, acompanhar, alertas  
- **B** — import planilha + PDF
