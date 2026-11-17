# Histórias — Meu Orçamento (PRD v1.0)

Formato: **Contexto → Objetivo → Descritivo → Critérios de aceite**  
Referência: `PRD_Meu_Orcamento_v1_0.txt` (08/11/2026)

## Legenda

| Campo | Significado |
|-------|-------------|
| **Release** | **A** = núcleo (go-live mínimo) · **B** = migração/importação (completa v1.0) |
| **Prioridade** | P0 obrigatório · P1 alto valor · P2 pode esperar |
| **PRD** | Seção do PRD |

---

## Épico 1 — Conta, isolamento e persistência

### MO-101 · Cadastro e login
**Release:** A · **Prioridade:** P0 · **PRD:** 5.11

**Contexto**  
O usuário precisa acessar o orçamento de qualquer aparelho, com dados só seus.

**Objetivo**  
Permitir criar conta, entrar e recuperar acesso com segurança mínima.

**Descritivo**  
- Fluxo de cadastro (e-mail + senha ou provedor — definir no tech design).
- Login e logout.
- Recuperação de senha.
- Sessão expira de forma previsível; usuário não perde dados.

**Critérios de aceite**
- [ ] Novo usuário cria conta e cai no orçamento vazio (5.9).
- [ ] Usuário A não vê dados do usuário B (UI e API).
- [ ] Após refresh e novo login, dados persistem no servidor (11).
- [ ] Recuperação de senha funciona ponta a ponta.
- [ ] HTTPS em todas as rotas; senha não trafega em claro.

**Dependências:** —

---

### MO-102 · Isolamento na API
**Release:** A · **Prioridade:** P0 · **PRD:** 5.11

**Contexto**  
Todo recurso (itens, lançamentos, cartões) pertence a um usuário.

**Objetivo**  
Garantir que nenhuma operação cruza contas.

**Descritivo**  
- Toda query filtra por `user_id`.
- IDs de outro usuário retornam 404 (não 403 com vazamento).

**Critérios de aceite**
- [ ] Testes automatizados: usuário B não lê/edita/exclui recurso de A.
- [ ] Auditoria mínima: created_at, updated_at em entidades principais.

**Dependências:** MO-101

---

### MO-103 · Modelo de dados em centavos
**Release:** A · **Prioridade:** P0 · **PRD:** 6

**Contexto**  
Float quebra totais e parcelas.

**Objetivo**  
Armazenar e calcular valores apenas como inteiros (centavos).

**Descritivo**  
- Conversão na entrada (formulário, importação).
- API e DB em centavos.
- UI formata pt-BR na exibição.

**Critérios de aceite**
- [ ] R$ 100,00 em 3× → 3334 + 3333 + 3333 centavos; soma = 10000 (6).
- [ ] Nenhuma operação intermediária usa float.
- [ ] Export/import preservam centavos (5.11, 5.12).

**Dependências:** MO-101

---

## Épico 2 — Catálogo e planejamento

### MO-201 · Catálogo inicial e primeiro orçamento
**Release:** A · **Prioridade:** P0 · **PRD:** 5.9

**Contexto**  
Substituir planilha com estrutura conhecida (Tipos → Categorias → Itens).

**Objetivo**  
Novo usuário recebe catálogo completo, sem lançamentos e planejamento zerado.

**Descritivo**  
- Seed de tipos R, F, V, E e categorias/itens do PRD 5.9.
- Sem dados de exemplo até ação explícita “Carregar exemplo”.

**Critérios de aceite**
- [x] Primeiro login: catálogo completo, `plano[]` zerado, `lanc` vazio.
- [x] “Carregar exemplo” só por opt-in (não no onboarding automático).

**Dependências:** MO-101, MO-103

---

### MO-202 · CRUD de itens (criar e arquivar)
**Release:** A · **Prioridade:** P0 · **PRD:** 5.9, 5.3

**Contexto**  
Usuário personaliza o orçamento além do catálogo padrão.

**Objetivo**  
Criar item no tipo atual; arquivar sem apagar histórico.

**Descritivo**  
- Criar: tipo, categoria (novo ou existente), nome.
- Arquivar: some de novos lançamentos; histórico permanece.
- Não excluir fisicamente item com lançamentos.

**Critérios de aceite**
- [x] Item criado aparece no orçamento e em “Novo lançamento”.
- [x] Item arquivado não aparece no seletor de novo lançamento.
- [x] Lançamentos antigos do item arquivado permanecem visíveis.

**Dependências:** MO-201

---

### MO-203 · Planejamento mensal por item (12 meses)
**Release:** A · **Prioridade:** P0 · **PRD:** 5.6

**Contexto**  
Planejamento é o coração do produto (substituir colunas Jan–Dez da planilha).

**Objetivo**  
Editar valor planejado por mês para cada item.

**Descritivo**  
- 12 campos (Jan–Dez).
- “Aplicar a todos”.
- “Copiar do mês anterior” (mês corrente).
- “Copiar do ano anterior” (mês a mês).
- Valores ≥ 0, 2 casas na UI.

**Critérios de aceite**
- [x] Alteração reflete no Orçamento e no Resumo após salvar.
- [x] “Aplicar a todos” replica valor nos 12 meses.
- [x] Copiar mês anterior / ano anterior funciona conforme 5.6.

**Dependências:** MO-202

---

## Épico 3 — Cartões, lançamentos e parcelas

### MO-301 · Cadastro de cartões
**Release:** A · **Prioridade:** P0 · **PRD:** 5.7

**Contexto**  
Cartão é forma de pagamento e define competência por fatura.

**Objetivo**  
Cadastrar cartão com apelido e fechamento (recomendado).

**Descritivo**  
- Obrigatório: apelido.
- Recomendado: dia de fechamento.
- Opcional: vencimento, instituição, últimos 4 dígitos.
- Cartão com histórico: inativar, não apagar.

**Critérios de aceite**
- [x] Cartão sem fechamento: aviso + competência = mês da compra (5.7).
- [x] Cartão inativo não aparece em novo lançamento.
- [x] Lançamentos antigos mantêm vínculo ao cartão inativo.

**Dependências:** MO-101

---

### MO-302 · Competência por fatura
**Release:** A · **Prioridade:** P0 · **PRD:** 5.7, D-01, Q-05

**Contexto**  
Usuário pensa no mês da fatura, não na data da compra.

**Objetivo**  
Calcular e gravar competência ao lançar no cartão.

**Descritivo**  
- Regra fechamento (incl. compra no dia do fechamento → próxima fatura).
- Débito/PIX/dinheiro: competência = mês da data.
- Competência gravada no lançamento; mudança de fechamento só vale para novos.

**Critérios de aceite**
- [x] Exemplo PRD: fechamento 25, compra 10/05 → maio; 26/05 → junho (6).
- [x] 26/05 em 3× → jun, jul, ago em todas as telas (6).
- [x] Prévia do novo lançamento mostra competências antes de salvar (5.5).

**Dependências:** MO-301, MO-103

---

### MO-303 · Criar lançamento (simples e parcelado)
**Release:** A · **Prioridade:** P0 · **PRD:** 5.5, 5.8

**Contexto**  
Registrar gasto/receita em &lt; 30 segundos.

**Objetivo**  
Modal de novo lançamento com validação e prévia de parcelas.

**Descritivo**  
- Campos: tipo, item, descrição, valor, data, pagamento, cartão (se crédito), parcelas 1–60.
- Parcelas só no cartão.
- Gravação atômica; divisão em centavos (5.8).

**Critérios de aceite**
- [x] Descrição vazia usa nome do item.
- [x] Prévia mostra valor por parcela e meses de competência.
- [x] R$ 100 / 3× = 33,34 + 33,33 + 33,33 (6).
- [x] Arquivados não aparecem no seletor de item.

**Dependências:** MO-202, MO-302

---

### MO-304 · Listar e buscar lançamentos no mês
**Release:** A · **Prioridade:** P0 · **PRD:** 5.5, Q-03

**Contexto**  
Revisão diária e fechamento do mês.

**Objetivo**  
Lista do mês com busca e filtros rápidos.

**Descritivo**  
- Ordem data decrescente.
- Linha: descrição, data, categoria, item, pagamento, valor, progresso parcela.
- Busca no mês (descrição ou item).
- Filtros: forma de pagamento, tipo.

**Critérios de aceite**
- [x] Busca só no mês selecionado (Q-03).
- [x] Sem resultado: mensagem + ação limpar busca/filtros.
- [x] “Parcela 2 de 6 · restam 4” visível.

**Dependências:** MO-303

---

### MO-305 · Editar lançamento e parcelas (por escopo)
**Release:** A · **Prioridade:** P0 · **PRD:** 5.5

**Contexto**  
Correções não podem quebrar histórico de parcelamento.

**Objetivo**  
Editar com escopo “só esta” ou “esta e as próximas”, com confirmação.

**Descritivo**  
- Valor, descrição, item, pagamento, data.
- Parcelas: escopo + confirmação obrigatória.
- Data nas próximas: +1 mês cada, ajuste último dia do mês.
- Não alterar número de parcelas (excluir grupo e relançar).

**Critérios de aceite**
- [x] Editar 3ª de 6× “só esta”: outras 5 intactas (6).
- [x] “Esta e as próximas”: altera 3ª–6ª apenas (6).
- [x] Valor novo é por parcela, sem recalcular total original (5.5).

**Dependências:** MO-303

---

### MO-306 · Excluir lançamento/parcelas com desfazer
**Release:** A · **Prioridade:** P0 · **PRD:** 5.5

**Contexto**  
Exclusão é frequente e arriscada.

**Objetivo**  
Excluir com escopo, confirmação e undo 10s.

**Descritivo**  
- Escopos: só esta, esta e as próximas, todas do grupo.
- Informar quantos registros serão removidos.
- Desfazer restaura estado exato.

**Critérios de aceite**
- [x] Excluir + desfazer restaura sem duplicar (6).
- [x] Exclusão parcial não deixa grupo inconsistente.
- [x] Após 10s, exclusão é irreversível.

**Dependências:** MO-303

---

## Épico 4 — Orçamento mensal

### MO-401 · Visão Orçamento por tipo e categoria
**Release:** A · **Prioridade:** P0 · **PRD:** 5.3

**Contexto**  
“Ainda posso gastar em alimentação?”

**Objetivo**  
Tela principal de acompanhamento do mês.

**Descritivo**  
- Navegação por mês; chips R, F, V, E.
- Categorias expansíveis: realizado / planejado, barra consumo (máx. 100% visual).
- Textos: “Ainda pode gastar”, “Orçamento atingido”, “Estourou em”.
- Gasto sem planejado: destaque + texto específico.

**Critérios de aceite**
- [x] Estados 80% / 100% / &gt;100% conforme 5.10.
- [x] Toque no item abre planejamento (MO-203).
- [x] Totais do tipo clicáveis (navegação contextual).

**Dependências:** MO-203, MO-303

---

## Épico 5 — Visão anual

### MO-501 · Tabela anual Jan–Dez
**Release:** A · **Prioridade:** P1 · **PRD:** 5.4

**Contexto**  
Visão de longo prazo da planilha.

**Objetivo**  
Tabela por tipo com toggle planejado/realizado.

**Descritivo**  
- Linhas: tipos, total despesas, saldo final (receitas − despesas).
- Expansão: categorias (não itens).
- Scroll horizontal mobile; negativos destacados.

**Critérios de aceite**
- [ ] Mesma competência de cartão que Resumo/Orçamento (5.4).
- [ ] Saldo final ≠ saldo do período (D-02).
- [ ] Totais reconciliam com lançamentos (11).

**Dependências:** MO-302, MO-401

---

## Épico 6 — Resumo

### MO-601 · Cards e filtros do Resumo
**Release:** A · **Prioridade:** P1 · **PRD:** 5.2

**Contexto**  
Tela de entrada: situação do período.

**Objetivo**  
Cards clicáveis com filtros visíveis e “Limpar filtros”.

**Descritivo**  
- Filtros: período, pagamento, categoria (chips + limpar).
- Cards: total orçado, total gasto, saldo do período, por tipo.
- Comportamento quando filtro ≠ Todas (orçado/saldo “—”).

**Critérios de aceite**
- [x] Filtro cartão: total gasto filtrado; orçado/saldo “—” com texto explicativo (6).
- [x] Cards levam a Orçamento ou Lançamentos conforme contexto.
- [x] Total gasto abre Lançamentos na competência do Resumo (spec 025).
- [x] Filtros não alteram dados, só visualização.

**Dependências:** MO-401, MO-304

---

### MO-602 · Gráficos e ritmo do mês
**Release:** A · **Prioridade:** P1 · **PRD:** 5.2

**Contexto**  
Composição de gastos e ritmo diário.

**Objetivo**  
Rosca + barras planejado×realizado + média diária.

**Descritivo**  
- Rosca: máx. 4 categorias + Outros; empty state.
- Barras: filtro pagamento afeta só realizado.
- Média diária e dias restantes quando período inclui mês corrente.

**Critérios de aceite**
- [x] Aria-label e legendas em ambos gráficos.
- [x] Categoria ≠ Todas: rosca escondida ou empty orientativo.
- [x] Média = realizado mês ÷ dia atual.

**Dependências:** MO-601

---

## Épico 7 — Alertas de limite

### MO-701 · Configurar limites global e por categoria
**Release:** A · **Prioridade:** P1 · **PRD:** 5.10, Q-02

**Contexto**  
Usuário define quando quer ser avisado antes do estouro.

**Objetivo**  
Limites em % com override por categoria.

**Descritivo**  
- Global padrão 80%.
- Por categoria opcional.
- Persistência por orçamento.

**Critérios de aceite**
- [ ] Padrão 80% preventivo, 100% atingido (Q-02).
- [ ] Limite categoria sobrescreve global.

**Dependências:** MO-401

---

### MO-702 · Exibir alertas (banner, barra, sininho)
**Release:** A · **Prioridade:** P1 · **PRD:** 5.10

**Contexto**  
Alerta visual sem push no MVP.

**Objetivo**  
Mesmos estados no Resumo e Orçamento.

**Descritivo**  
- Banner com alerta mais crítico + contagem.
- Badge na barra de categoria.
- Sininho com lista do mês.

**Critérios de aceite**
- [ ] Casos da seção 6 (80 / 100 / 105 / sem planejado).
- [ ] Status não depende só de cor (7).
- [ ] Telemetria: evento `alerta_acionado` (épico 11).

**Dependências:** MO-701, MO-601, MO-401

---

## Épico 8 — Importação de planilha (Release B)

### MO-801 · Upload e detecção de layout
**Release:** B · **Prioridade:** P1 · **PRD:** 5.12, D-03

**Contexto**  
Migrar planilhas sem converter manualmente para VF.

**Objetivo**  
Aceitar CSV/XLSX/XLS/ODS até 10 MB e detectar layout.

**Descritivo**  
- Upload em Ajustes.
- Seleção de aba.
- Detectar: lista de lançamentos, VF, orçamento mensal, misto.

**Critérios de aceite**
- [ ] CSV UTF-8 e Latin-1; delimitador `,` e `;`.
- [ ] VF reconhecido automaticamente (preset).
- [ ] Layout desconhecido abre mapeamento manual.

**Dependências:** MO-103, MO-201

---

### MO-802 · Mapeamento de colunas e prévia
**Release:** B · **Prioridade:** P1 · **PRD:** 5.12

**Contexto**  
Planilhas de bancos e pessoais têm cabeçalhos diferentes.

**Objetivo**  
Sugerir mapeamento e mostrar prévia com erros.

**Descritivo**  
- Obrigatório: Data, Valor.
- Opcional: descrição, categoria, item, tipo, pagamento, parcelas.
- Sinônimos pt-BR; usuário corrige.
- Até 200 linhas na prévia; inválidas com motivo.

**Critérios de aceite**
- [ ] Linha inválida: motivo (“data inválida”, “valor inválido”).
- [ ] “Criar itens faltantes” (padrão on) ou item padrão Outros.
- [ ] Nenhuma gravação sem confirmar.

**Dependências:** MO-801

---

### MO-803 · Confirmar importação e relatório
**Release:** B · **Prioridade:** P1 · **PRD:** 5.12, Q-06

**Contexto**  
Reimportação pode duplicar dados.

**Objetivo**  
Importar com relatório e regra de duplicidade.

**Descritivo**  
- Relatório: importados, ignorados, rejeitados, itens criados.
- Duplicidade: data + valor + descrição + cartão (Q-06).
- Hash arquivo + confirmação na reimportação.

**Critérios de aceite**
- [ ] Competência cartão aplicada em linhas de crédito.
- [ ] Reimportação pede confirmação; duplicatas sinalizadas na prévia.
- [ ] Dados existentes não sobrescritos sem confirmação.
- [x] Depois de importar lançamentos, abre o mês civil se ele foi gravado; senão a competência mais recente (spec 025).

**Dependências:** MO-802, MO-302

---

### MO-804 · Importar planejamento (layout mensal)
**Release:** B · **Prioridade:** P2 · **PRD:** 5.12

**Contexto**  
Planilhas com colunas Jan–Dez carregam orçamento, não lançamentos.

**Objetivo**  
Modo orçamento: importar `plano[]` por item/mês.

**Critérios de aceite**
- [ ] Colunas mês detectadas; valores refletem no Orçamento.
- [ ] Requer tipo/categoria/item (ou preset VF).

**Dependências:** MO-801, MO-203

---

## Épico 9 — Importação de fatura PDF (Release B)

### MO-901 · Upload e extração de texto (PDF)
**Release:** B · **Prioridade:** P1 · **PRD:** 5.13, Q-07

**Contexto**  
Digitar fatura manualmente é o maior atrito do fechamento.

**Objetivo**  
Extrair texto de PDF selecionável no servidor.

**Descritivo**  
- Upload em Ajustes; cartão destino obrigatório.
- Processamento em memória; não persistir PDF após import (5.13).
- PDF imagem: mensagem clara “fora do MVP”.

**Critérios de aceite**
- [ ] PDF com texto: linhas extraídas.
- [ ] PDF scan: erro orientativo, sem gravar nada.
- [ ] Log só metadados (emissor, contagem).

**Dependências:** MO-301

---

### MO-902 · Parser por emissor + genérico
**Release:** B · **Prioridade:** P1 · **PRD:** 5.13

**Contexto**  
Layout de fatura varia por banco.

**Objetivo**  
Heurísticas Inter, Nubank, Itaú, Bradesco, C6 + genérico.

**Descritivo**  
- Ignorar totais, juros, IOF, cabeçalhos.
- Detectar parcelas 3/12, “03 de 12”, etc.
- Confiança &lt; 70%: revisão obrigatória linha a linha.

**Critérios de aceite**
- [ ] Golden file: 1 PDF Inter parseado com ≥ 90% linhas corretas (definir fixture).
- [ ] Estorno: usuário escolhe na prévia (receita ou ignorar).
- [ ] Nenhuma linha gravada sem prévia.

**Dependências:** MO-901

---

### MO-903 · Prévia editável e confirmação
**Release:** B · **Prioridade:** P1 · **PRD:** 5.13

**Contexto**  
Parser erra; usuário precisa corrigir antes de gravar.

**Objetivo**  
Prévia com ignorar, editar e sugestão de item por palavra-chave.

**Critérios de aceite**
- [ ] Cada linha: editar descrição, valor, data, item.
- [ ] Confirmar aplica competência fatura (5.7) e parcelas (5.8).
- [ ] Relatório pós-importação.

**Dependências:** MO-902, MO-302

---

## Épico 10 — Exportação e conta

### MO-1001 · Exportar CSV e JSON
**Release:** B · **Prioridade:** P2 · **PRD:** 5.11

**Objetivo**  
Backup e portabilidade em centavos.

**Critérios de aceite**
- [ ] Export inclui lançamentos, itens, planejamento, cartões.
- [ ] Valores em centavos sem perda de precisão.

**Dependências:** MO-103

---

### MO-1002 · Exclusão de conta
**Release:** A · **Prioridade:** P2 · **PRD:** 5.11

**Objetivo**  
Excluir conta com confirmação (prazo máx. 30 dias).

**Critérios de aceite**
- [ ] Fluxo de confirmação com consequência explícita.
- [ ] Dados removidos após prazo definido.

**Dependências:** MO-101

---

## Épico 11 — Telemetria e qualidade

### MO-1101 · Eventos mínimos
**Release:** B · **Prioridade:** P2 · **PRD:** 3

**Objetivo**  
Medir adoção e funil de importação.

**Eventos**
- `lancamento_criado` / `editado` / `excluido`
- `navegacao_mes`
- `sessao_duracao`
- `alerta_acionado`
- `import_planilha_iniciada` / `confirmada` / `abandonada`
- `import_pdf_iniciada` / `confirmada` / `abandonada`

**Critérios de aceite**
- [ ] Eventos ligados aos KPIs da seção 3.
- [ ] Sem PII em logs de importação.

**Dependências:** MO-303, MO-803, MO-903

---

### MO-1102 · Testes de reconciliação (QA transversal)
**Release:** A · **Prioridade:** P0 · **PRD:** 11

**Objetivo**  
Garantir que totais batem em todas as telas.

**Critérios de aceite**
- [ ] Suite com casos da seção 6 automatizados.
- [ ] Resumo + Orçamento + Ano reconciliam com lançamentos.
- [ ] Mobile + desktop nos fluxos principais.

**Dependências:** MO-501, MO-601, MO-306

---

## Sugestão de sprints (resumo)

| Sprint | Histórias | Entrega |
|--------|-----------|---------|
| 1 | MO-101, 102, 103, 201 | Conta + centavos + catálogo vazio |
| 2 | MO-202, 203, 301, 302 | Planejamento + cartões + competência |
| 3 | MO-303, 304, 305, 306 | Lançamentos completos |
| 4 | MO-401, 701, 702 | Orçamento + alertas |
| 5 | MO-501, 601, 602 | Ano + Resumo |
| 6 | MO-1102 + hardening | **Release A** |
| 7 | MO-801, 802, 803 | Import planilha |
| 8 | MO-901, 902, 903 | Import PDF |
| 9 | MO-804, 1001, 1101 | Extras **Release B** |

---

## Pendências de produto (bloqueiam refine)

| ID | Bloqueia histórias |
|----|---------------------|
| Q-05 | MO-302, MO-903 |
| Q-06 | MO-803 |
| Golden files (planilha + PDF) | MO-802, MO-902 |

---

*Gerado a partir do PRD v1.0 — alinhado à ordem da seção 8.*
