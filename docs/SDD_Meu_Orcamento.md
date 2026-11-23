# Spec-Driven Development — Meu Orçamento

**Definição operacional:** nenhuma feature entra em código sem spec versionada; nenhuma história fecha sem verificação dos critérios de aceite.

---

## 1. Por que SDD neste produto

O domínio (competência, parcelas, centavos, dois saldos) **não tolera “código primeiro”**.  
Já temos PRD + histórias MO-xxx — SDD transforma isso em **contrato executável** entre produto e implementação.

```text
PRD (produto)  →  Spec (feature)  →  Tasks  →  Implement  →  Verify (AC)
                      ↑_______________________________|
                         falhou? atualiza spec ou código
```

---

## 2. Ciclo por história (obrigatório)

### Fase 0 — Escolher história
Ex.: `MO-302 Competência por fatura` (Release A, Sprint 2).

### Fase 1 — Spec (`specs/NNN-slug/spec.md`)
Conteúdo mínimo:

```markdown
# Spec: MO-302 Competência por fatura
Status: draft | ready | implemented | verified
Release: A
Sprint: 2
PRD: 5.7, D-01, D-04

## Context
...

## Referências visuais e de DS
- Identidade: `docs/identidade-visual/decisoes/DECISOES_identidade_visual.md` (seções aplicáveis: ...)
- Tela de referência: `docs/identidade-visual/telas-web/web-<nome>.dc.html`
- Componentes do DS usados: `Botao`, `Campo`, ... (liste)
- Tokens: apenas os de `packages/design-system/src/core/tokens.ts`

## Critérios de aceite visuais
- AC-V1: hierarquia e textos iguais à tela de referência.
- AC-V2: todos os componentes vêm do DS.
- AC-V3: estados (vazio, erro, carregando) iguais aos da referência.

## Goals
...

## Non-goals
...

## Domain rules
(tabela de casos)

## Acceptance criteria
- [ ] AC-1 ...
- [ ] AC-2 ...

## Test plan
Unit: domain/competencia.test.ts
E2E: (se aplicável)

## Open questions
(none — Q-05 fechada em DECISIONS)
```

**Gate:** spec `ready` antes de abrir PR de código.

### Fase 2 — Design técnico (`design.md`) — só se necessário
Obrigatório quando:
- muda schema DB
- novo use-case com side effects
- integração externa (auth, storage, PDF)

Pode ser omitido em mudanças puras de `domain/` com testes.

### Fase 3 — Tasks (`tasks.md`)
Lista ordenada, cada item mapeado a AC:

```markdown
- [ ] T1: função competencia(data, cartao) — AC-1, AC-2
- [ ] T2: testes tabela PRD §6 — AC-1
- [ ] T3: gravar competencia no insert — AC-3
```

### Fase 4 — Implement (fatia vertical)
- Cada história MO-xxx = **back + front na mesma entrega**.
- Ordem interna sugerida: domínio/testes → persistência/API → **UI completa do fluxo** (não placeholder).
- Não marcar Done com tela “em breve” se o card promete experiência de usuário.
- Commits: `feat(MO-302): ...` ou `test(MO-302): ...`

### Fase 5 — Verify
- [ ] Todos os AC marcados
- [ ] Testes relacionados verdes
- [ ] Spec status → `verified`
- [ ] Atualizar CSV de histórias → Done

**Se AC falhar:** corrigir código **ou** mudar spec com justificativa (ADR curto) — nunca “achar que está ok”.

---

## 3. Mapa Spec ↔ Sprint (Release A)

| Spec folder | Histórias | Sprint |
|-------------|-----------|--------|
| `001-foundation` | MO-101, 102, 103 | 1 |
| `002-catalog` | MO-201, 202 | 1–2 |
| `003-planning` | MO-203 | 2 |
| `004-cards-competencia` | MO-301, 302 | 2 |
| `005-lancamentos` | MO-303–306 | 3 |
| `006-orcamento-alertas` | MO-401, 701, 702 | 4 |
| `007-resumo-ano` | MO-501, 601, 602 | 5 |
| `008-qa-reconciliacao` | MO-1102 | 6 |

Release B: `009-import-planilha`, `010-import-pdf`, `011-export-telemetry`.

---

## 4. Regras para o agente (AGENTS.md — resumo)

1. Ler `specs/*/spec.md` da história atual **antes** de editar código.
2. Não inventar regra de negócio fora do PRD/spec.
3. Domínio em `src/domain` sem import de Next/DB.
4. Preferir teste que falha → implementação → verde.
5. Ao terminar task: marcar checkbox em `tasks.md` e AC em `spec.md`.
6. Importação (B) não entra em Release A.

---

## 5. Definition of Done (história)

Uma história só é Done se:

1. Spec `verified`
2. AC 100% checados
3. **Back + front** do fluxo entregues juntos (fatia vertical)
4. Testes unitários dos casos da seção 6 (quando aplicável)
5. Nenhum float em caminho monetário
6. Isolamento por usuário preservado (se tocar API)
7. CSV/histórico de stories atualizado
8. UI alinhada ao protótipo o suficiente para o usuário completar o fluxo sem “em construção”

---

## 6. Anti-padrões (proibidos)

| Anti-padrão | Fazer em vez disso |
|-------------|-------------------|
| Codar UI sem regra de competência | Spec + `domain/competencia` primeiro |
| “Ajustar depois o centavo” | Teste de parcela no mesmo PR |
| Spec gigante de 10 histórias | 1 spec folder por épico/sprint |
| Mudar comportamento sem atualizar AC | ADR + bump da spec |
| Implementar PDF no Sprint 1 | Fora — Release B |

---

## 7. Ferramentas do dia a dia

| Uso | Ferramenta |
|-----|------------|
| Specs + tasks | Markdown em `/specs` (repo) |
| Execução | Cursor Agent com `AGENTS.md` |
| Testes domínio | `pnpm test` (Vitest) |
| E2E | `pnpm test:e2e` (Playwright) |
| Tracking | `HISTORIAS_*.csv` ou Linear/Jira import |

Não obrigatório: Spec Kit CLI. O processo acima **é** SDD; a pasta `/specs` é o artefato.

---

## 8. Primeira spec a escrever (Kickoff)

Ao criar o repo, a primeira entrega SDD é:

**`specs/001-foundation/spec.md`** cobrindo MO-101 + MO-102 + MO-103  
→ depois `tasks.md` → scaffold Next + Drizzle + Better Auth → Verify.

Ordem rígida: **Spec ready → scaffold → código**.
