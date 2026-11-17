# Spec: 001 — Foundation

**Status:** `verified` *(produção Neon fica para deploy)*  
**Release:** A  
**Sprint:** 1  
**Histórias:** MO-101, MO-102, MO-103  
**PRD:** 5.11, 6, 11

---

## Context

Sem conta, isolamento e centavos, o restante do produto não tem base. Este é o primeiro bloco SDD: autenticação, tenant isolation e modelo monetário.

## Goals

1. Usuário cria conta, faz login e recupera acesso (mínimo: e-mail/senha).
2. Toda operação de dados é isolada por usuário (UI + API).
3. Valores monetários existem só como inteiros (centavos) no domínio e no DB.

## Non-goals

- Open Finance, OAuth social (pode entrar depois).
- Importação de planilha/PDF.
- Telas de Resumo/Orçamento completas (placeholder ok).
- Offline.

## Domain rules

### Centavos (MO-103)

- Entrada UI: string BRL → `toCents(string): number` (inteiro).
- Domínio e DB: `integer` / `bigint`.
- Parcelas: `base = floor(T/N)`, primeiras `resto` parcelas recebem `base+1`.
- Exemplo: 10000 / 3 → 3334, 3333, 3333.

### Isolamento (MO-102)

- Toda query filtra `user_id` / `orcamento.user_id`.
- Recurso de outro usuário → **404**.

### Auth (MO-101)

- Better Auth, e-mail + senha.
- Sessão obrigatória para rotas `/app/*`.
- Pós-login: redirect para área autenticada (placeholder Resumo).

## Acceptance criteria

### MO-101
- [x] AC-101.1 Novo usuário cria conta e acessa área autenticada (signup API + `/app/resumo`).
- [x] AC-101.2 Login / logout funcionam (páginas + SignOut).
- [x] AC-101.3 Fluxo de recuperação de senha existe (stub: link no console do servidor).
- [x] AC-101.4 HTTPS não é requisito em localhost; senha nunca em log.

### MO-102
- [x] AC-102.1 Usuário A não lê/edita/exclui dados de B (teste unitário `require-orcamento.test.ts`).
- [x] AC-102.2 Entidades principais têm `created_at` / `updated_at` (schema Drizzle).

### MO-103
- [x] AC-103.1 Helper `splitParcelas(10000, 3)` = `[3334, 3333, 3333]` (Vitest verde).
- [x] AC-103.2 Nenhum caminho de domínio usa `parseFloat` para dinheiro.
- [x] AC-103.3 Schema DB declara campos monetários como integer (`planoCentavos`).

## Test plan

| Tipo | Onde |
|------|------|
| Unit | `src/domain/money.test.ts` |
| Unit | isolamento (quando houver repos) |
| E2E | cadastro → login → redirect (Playwright, pode ser Sprint 1 final) |

## Open questions

Nenhuma — auth = Better Auth (ARCHITECTURE).

## References

- `docs/SPRINT1_Release_A.md`
- `docs/ARCHITECTURE_Meu_Orcamento.md`
- `docs/HISTORIAS_Meu_Orcamento_v1_0.md` (MO-101–103)
