# Meu Orçamento — One-pager (v1.0)

**Para:** Dev · Design · Stakeholders  
**Produto:** Victor · **Data:** 08/11/2026

---

## Em uma frase

App de orçamento pessoal que substitui a planilha “Vida Financeira”: planejar por item/mês, lançar gastos (com cartão e parcelas), acompanhar consumo e importar planilha/PDF — no celular primeiro.

---

## Para quem

Adulto que já controla finanças em planilha, usa cartão de crédito, fecha o mês manualmente e quer **menos atrito** sem perder a visão por categoria.

**Não é para:** investimentos, Open Finance, controle familiar compartilhado (v1).

---

## Problema

Planilha quebra no celular, cartão/parcela é manual, não há alerta antes do estouro, lançar é lento → abandono intermitente.

---

## Solução (5 telas)

| Tela | Valor |
|------|-------|
| **Resumo** | Situação do período + filtros + gráficos |
| **Orçamento** | “Ainda posso gastar?” por categoria |
| **Ano** | Visão Jan–Dez planejado vs realizado |
| **Lançamentos** | CRUD, busca, parcelas |
| **Ajustes** | Cartões, alertas, importação, conta |

**Hierarquia:** Tipo → Categoria → Item → Lançamento.

---

## Diferenciais vs. planilha

1. **Competência por fatura** (não só data da compra)  
2. **Parcelas com centavos exatos** e edição por escopo  
3. **Alertas 80% / 100%** configuráveis  
4. **Importação** planilha + PDF com prévia (Release B)

---

## Métricas de sucesso (MVP)

| KPI | Meta |
|-----|------|
| Fechar o mês | &lt; 10 min |
| Qualidade dos lançamentos | ≥ 90% sem edição após 7 dias (60d de uso) |
| North star (pesquisa) | Deixou a planilha por 3 meses |

---

## Releases

```text
Release A (Sprints 1–6)     →  Planejar + lançar + acompanhar + alertas
Release B (Sprints 7–9)     →  Importar planilha + PDF + export
```

**Go-live Release A** quando MO-1102 (reconciliação) passar.

---

## Regras que não negociam

- Valores em **centavos** (inteiro) em todo o stack  
- **Saldo do período** = orçado − gasto (Resumo) ≠ **Saldo final** = receitas − despesas (Ano)  
- Competência, parcelas e alertas: **uma regra**, todas as telas  
- Importação: **sempre prévia** antes de gravar  

---

## Stack / referências

| Artefato | Onde |
|----------|------|
| PRD v1.0 | `PRD_Meu_Orcamento_v1_0.txt` |
| Protótipo UX | `Meu_Orcamento_prototipo_v3.html` |
| Histórias + CSV | `HISTORIAS_Meu_Orcamento_v1_0.md` / `.csv` |
| Decisões assumidas | `DECISOES_ASSUMIDAS_v1_0.md` |
| Sprint 1 / 2 | `SPRINT1_Release_A.md` / `SPRINT2_Release_A.md` |

---

## Design (direção)

- Mobile-first; navegação inferior / topo desktop (como protótipo Itaú-like)  
- Realizado em destaque; planejado secundário  
- Status: texto + cor (nunca só cor)  
- Toque ≥ 48px · empty states com CTA  
- pt-BR · Roboto  

**Não entra:** seção Insights / coaching de saldo (protótipo `vGuia`).

---

## Próximas 4 semanas

| Semana | Entrega |
|--------|---------|
| 1–2 | Sprint 1: auth + catálogo + centavos |
| 3–4 | Sprint 2: planejamento + cartões + competência |
| 5–6 | Sprint 3: lançamentos e parcelas *(a planejar)* |

---

## Abertos (revisar se necessário)

- Q-05/Q-06/Q-07 → ver `DECISOES_ASSUMIDAS_v1_0.md`  
- Autenticação: JWT vs. sessão (tech lead)  
- Repo / hospedagem: a definir  

---

*Documento vivo — atualizar ao fim de cada sprint.*
