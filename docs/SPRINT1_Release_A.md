# Sprint 1 — Release A · Fundação

**Duração sugerida:** 2 semanas  
**Objetivo do sprint:** Usuário autenticado com catálogo inicial, centavos no backend e orçamento vazio persistido.

**Pronto quando:** Login → ver catálogo padrão → planejamento zerado → recarregar página → dados no servidor.

---

## Comprometido (Sprint 1)

| ID | História | Tamanho | Dono sugerido |
|----|----------|---------|---------------|
| MO-101 | Cadastro e login | **L** | Full-stack |
| MO-102 | Isolamento na API | **M** | Backend |
| MO-103 | Modelo em centavos | **M** | Backend |
| MO-201 | Catálogo inicial vazio | **M** | Full-stack |

**Capacidade orientativa:** 2 devs × 2 sem ≈ 8–10 pts → comprometido **~5 pts** (folga para setup de repo, CI, design tokens).

---

## Detalhamento por ticket

### MO-101 · Cadastro e login `L`

**Tarefas técnicas**
- [ ] Schema `users` + auth (JWT ou sessão — à escolha do tech lead)
- [ ] POST `/auth/register`, `/auth/login`, `/auth/forgot-password`
- [ ] Telas mobile-first: login, cadastro, esqueci senha
- [ ] Redirect pós-login → Resumo vazio (placeholder até Sprint 5)

**DoD**
- Fluxo manual e 1 teste E2E feliz (cadastro → login → redirect)

---

### MO-102 · Isolamento na API `M`

**Tarefas técnicas**
- [ ] Middleware `user_id` em todas as rotas de orçamento
- [ ] Testes: cross-tenant 404
- [ ] `created_at` / `updated_at` nas entidades do sprint

**DoD**
- Suite de testes de autorização verde no CI

---

### MO-103 · Modelo em centavos `M`

**Tarefas técnicas**
- [ ] `INTEGER` para valores monetários no DB
- [ ] DTO: API aceita/recebe string BRL ou centavos (documentar)
- [ ] Helper de parcelamento (floor + resto nas primeiras) — teste unitário

**DoD**
- Teste: 10000 centavos / 3 = 3334+3333+3333

---

### MO-201 · Catálogo inicial `M`

**Tarefas técnicas**
- [ ] Seed server-side na criação do orçamento (tipos R,F,V,E + itens PRD 5.9)
- [ ] `plano[12]` zerado por item
- [ ] Sem lançamentos automáticos
- [ ] GET `/orcamento` retorna estrutura completa

**DoD**
- Novo usuário vê mesmas categorias do protótipo; totais = R$ 0

---

## Stretch (se sobrar tempo)

| ID | História | Tamanho |
|----|----------|---------|
| MO-202 | Criar item + arquivar (início) | S |

---

## Fora do Sprint 1

MO-203 (planejamento), MO-301+ (cartões/lançamentos) → **Sprint 2**

---

## Riscos do sprint

| Risco | Mitigação |
|-------|-----------|
| Auth demora mais que L | Usar provider gerenciado (Auth0, Supabase Auth) |
| Schema de catálogo refeito no S2 | Alinhar modelo `Item` com hierarquia Tipo→Cat→Item já no S1 |

---

## Cerimônias sugeridas

- **Refino Sprint 2** na semana 2 (MO-203, 301, 302)
- **Demo:** login + inspecionar catálogo no network tab (centavos + user_id)
