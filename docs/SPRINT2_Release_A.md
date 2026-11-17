# Sprint 2 — Release A · Planejar

**Duração sugerida:** 2 semanas  
**Objetivo do sprint:** Usuário planeja o ano por item e cadastra cartões com competência por fatura funcionando (sem lançamentos ainda, ou lançamentos mínimos se stretch).

**Pronto quando:** Criar/editar planejamento Jan–Dez em qualquer item · cadastrar cartão com fechamento · simulador mostra competência correta em prévia.

**Pré-requisito:** Sprint 1 concluído (MO-101, 102, 103, 201).

---

## Comprometido (Sprint 2)

| ID | História | Tamanho | Notas |
|----|----------|---------|-------|
| MO-202 | CRUD de itens (criar e arquivar) | **M** | |
| MO-203 | Planejamento mensal (12 meses) | **M** | Core da planilha |
| MO-301 | Cadastro de cartões | **M** | |
| MO-302 | Competência por fatura | **L** | Risco central — reservar tempo para testes |

**Capacidade:** ~5–6 pts efetivos (302 é o gargalo).

---

## Detalhamento por ticket

### MO-202 · CRUD de itens `M`

**Tarefas**
- [x] Server actions criar / arquivar (tipo, categoria, nome)
- [x] Soft-archive `arquivado=1`
- [x] Categoria: datalist existente ou texto livre (novo grupo no tipo)
- [x] UI: botão “Novo item” na tela Orçamento (chip de tipo ativo)
- [x] Arquivado: ocultar em Orçamento + helper seletor; listar em Ajustes

**Critérios de aceite (teste manual)**
1. Criar “Assinaturas” em Variáveis · Habitação  
2. Arquivar item sem lançamentos → some de “novo item”  
3. Item arquivado com lançamento futuro (seed teste) ainda aparece na lista do mês  

**DoD:** 3 testes API + screenshot protótipo alinhado

---

### MO-203 · Planejamento mensal `M`

**Tarefas**
- [ ] PATCH `/itens/:id/plano` — array 12 inteiros (centavos)
- [ ] UI sheet/modal: 12 inputs Jan–Dez
- [ ] Ações: “Aplicar a todos”, “Copiar mês anterior”, “Copiar ano anterior”
- [ ] Validação: ≥ 0, máx. 2 casas na UI
- [ ] Orçamento mensal (MO-401) só exibe leitura neste sprint — ou stub simples

**Critérios de aceite**
1. Salário R$ 6.500 em todos os meses via “Aplicar a todos”  
2. Copiar mês anterior preenche só o mês corrente  
3. Valores persistem após logout/login  

**DoD:** Teste unitário de merge de `plano[]`

---

### MO-301 · Cadastro de cartões `M`

**Tarefas**
- [ ] Schema `cartoes`: apelido, fechamento (1–28 opcional), vencimento, instituição, últimos4, ativo
- [ ] CRUD em Ajustes; inativar em vez de DELETE se `lanc` existir (preparar FK)
- [ ] Aviso UI se fechamento ausente

**Critérios de aceite**
1. Dois cartões cadastrados; inativar um remove de select futuro  
2. Sem fechamento: copy de aviso visível  

**DoD:** Migração DB versionada

---

### MO-302 · Competência por fatura `L`

**Tarefas**
- [ ] Função pura `competencia(dataCompra, cartao)` → `YYYY-MM`
- [ ] Regra D-04: dia fechamento inclusivo → próximo mês
- [ ] Parcelas: competência N = primeira + (N-1) meses
- [ ] Gravar `competencia` no lançamento (campo separado de data se necessário — PRD 5.8)
- [ ] Testes com tabela de casos da seção 6 do PRD

**Casos obrigatórios (automatizar)**

| Fechamento | Compra | Competência |
|------------|--------|-------------|
| 25 | 10/05 | 2026-05 |
| 25 | 26/05 | 2026-06 |
| 25 | 26/05 3× | jun, jul, ago |
| — | 15/05 (sem fech.) | 2026-05 + aviso |

**DoD:** ≥ 15 casos em teste unitário; zero divergência Resumo/Orçamento/Ano (quando existirem)

---

## Stretch (Sprint 2)

| ID | História | Tamanho | Se entrar… |
|----|----------|---------|------------|
| MO-303 | Criar lançamento (só à vista) | **M** | Cortar parcelas para S3; só deb/pix/din |
| MO-401 | Orçamento mensal (só leitura) | **S** | Barras com plano vs realizado=0 |

---

## Riscos

| Risco | Mitigação |
|-------|-----------|
| 302 atrasa sprint | Não puxar MO-303 para comprometido |
| “Copiar ano anterior” sem histórico | Se ano anterior vazio, copiar zeros ou desabilitar botão |
| Mobile: 12 campos apertados | Grid 3×4 + scroll no modal |

---

## Demo Sprint 2 (roteiro 5 min)

1. Login → Orçamento → criar item “Netflix” em Lazer  
2. Planejar R$ 55 em todos os meses  
3. Ajustes → cartão “Inter” fechamento 25  
4. (Opcional stretch) Lançamento débito R$ 40 em Alimentação → ver no mês  

---

## Refino Sprint 3 (agendar na semana 2)

- MO-303, 304, 305, 306 — foco em parcelas e undo  
- Revisar protótipo v3 como referência de modais
