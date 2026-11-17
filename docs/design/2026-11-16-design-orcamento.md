---
project: Meu Orçamento
ref: docs/PRD_Meu_Orcamento_v1_0.txt (planejar o mês por tipo e grupo; consumo visível)
topic: orcamento
discipline: design
author: pd-ux-design
date: 2026-11-16
status: draft
upstream: []
downstream: [visual, components, qa, handoff]
---

## Summary

A tela Orçamento (`/app/orcamento`) mostra um mês, um tipo por vez (Receitas, Fixas, Variáveis, Anuais) e os grupos desse tipo, com realizado contra planejado. A ação principal da tela é ler o consumo. Abrir o plano de um item e criar item são ações secundárias. Esta spec descreve a tela como está no código em 2026-11-16, não uma tela nova.

## Assumptions

- Não há artefato de fluxo. O Victor aceitou o recorte de uma tela só. A tarefa é: ver o mês, trocar o tipo, abrir um grupo, editar o plano de um item ou criar um item.
- Pesquisa e arquitetura não foram refeitas. A navegação do app (Resumo, Orçamento, Lançamentos, Ano, Ajustes) permanece.
- Sheets de novo item e de plano abrem por cima desta tela. O foco dentro deles não foi retestado aqui.

Learnings applied: L-001

## Tela — Orçamento

Propósito: no mês aberto, mostrar quanto foi realizado e quanto foi planejado no tipo escolhido, por grupo e por item.

Hierarquia: título, mês, faixa de alertas, seletor de tipo, total do tipo, lista de grupos. Um grupo aberto revela os itens. Uma ação de rodapé cria item no tipo atual.

Ação primária da leitura: o total e a lista. Ação primária de edição, quando o grupo está aberto: tocar o item para abrir o plano. "Novo item" fica no fim e não compete com o total.

### Layout

Coluna única, largura da área `.app-content`. Ordem de cima para baixo:

1. `h1` "Orçamento".
2. Navegação de mês: mês anterior, nome do mês, próximo mês.
3. Faixa de alertas do mês, se houver.
4. Quatro filtros de tipo, um selecionado.
5. Cartão do total do tipo: rótulo do tipo e `realizado / planejado`.
6. Grupos. Com plano ou gasto no mês aberto vêm primeiro; o restante em pt-BR. Grupo em zero continua na lista.
7. Botão "Novo item em {tipo}".

Grupo fechado: nome, `realizado / planejado`, barra, frase de consumo. Grupo aberto: os mesmos dados e, abaixo, cada item (nome, marca "dívida" quando houver, subtítulo, valor realizado, arquivar).

### Componentes usados

Nomes reais de `src/components/material/ui.tsx` e do markup desta tela:

| Peça | Nome real |
|---|---|
| Tipo | `MdFilterChip` `label` + `selected` |
| Barra do grupo | `MdProgress` `value` (0–1) `tone` `ok` \| `warn` \| `over` |
| Novo item | `MdOutlinedButton` |
| Mês anterior / próximo | `Link` com classe `orc-mes-btn` (não há botão de ícone no módulo Material) |
| Cabeçalho do grupo | `button.orc-cat-head` |
| Item | `button.orc-item-main` |
| Arquivar | `ArquivarItemButton` |

### Estados

| Estado | O que a tela faz |
|---|---|
| Default com dados | Tipo Fixas selecionado na entrada (`initialTipo`, padrão `F`). Grupos com valor no mês acima dos zerados. |
| Parcial | Alguns grupos em zero e outros com plano. Os dois blocos aparecem. |
| Vazio no tipo | Sem itens daquele tipo: total R$ 0,00 / R$ 0,00, lista vazia, "Novo item" continua. Não há frase de lista vazia. |
| Loading | Não há estado de carregamento dentro da tela. A troca de mês é navegação de página. |
| Erro | Não há estado de erro nesta tela. |
| Sucesso | Não há confirmação na própria lista. Criar ou salvar plano fecha o sheet (fora desta spec). |
| Desabilitado | Os controles desta lista não têm estado disabled. |
| Grupo fechado + barra | A barra e a frase de consumo ficam visíveis com o grupo fechado. |
| Item sem plano e com gasto | Subtítulo "Gasto sem orçamento planejado" e classe `sem-plan`. |
| Alerta do mês | `AlertBanner` acima dos tipos, quando `alertas` não é vazio. |

Combinações: um grupo pode estar aberto e estourado ao mesmo tempo. Um item sem plano pode estar dentro de um grupo que tem plano em outro item. Não há controle ao mesmo tempo desabilitado e em loading.

### Interação

- Trocar o mês leva a `/app/orcamento?mes=YYYY-MM` e registra `navegacao_mes`. O tipo selecionado volta ao padrão da página (Fixas), porque o estado é local.
- O chip selecionado troca o tipo na hora, sem navegação. Os grupos do tipo anterior fecham junto com a troca de lista (o mapa `open` não é limpo, mas as chaves são nomes de grupo).
- Tocar o cabeçalho do grupo alterna aberto/fechado. A seta ▾/▴ acompanha.
- Tocar o item abre o sheet de plano daquele item. Arquivar é outro controle, ao lado, e não abre o plano.
- "Novo item em {tipo}" abre o sheet de criação já no tipo selecionado.

Feedback: a barra e a frase mudam com o estado de consumo (`ok`, preventivo, atingido, estourado, sem planejado). A cor não é o único sinal: a frase diz o que aconteceu.

### Anotações

- Ordem de foco: mês anterior, mês seguinte, chips na ordem Receitas → Fixas → Variáveis → Anuais, cada cabeçalho de grupo, e, se aberto, o botão do item e depois Arquivar, por fim Novo item. A faixa de alerta entra antes dos chips se tiver controle focável (não reaberto aqui).
- Nome acessível dos meses: "Mês anterior" e "Próximo mês". O chip usa o `label` visível. O cabeçalho do grupo não tem nome além do texto visível.
- O contêiner dos chips tem `role="tablist"` e `aria-label="Tipo"`. O controle filho é `md-filter-chip`, não uma aba. O seletor se comporta como filtro de seleção única.
- Alvo do mês: 40×40 px. O botão Novo item e o cabeçalho do grupo ocupam a largura da coluna. O alvo de Arquivar não foi medido nesta passagem.
- Destino do foco ao abrir sheet: não verificado.

## Open questions

- Ao trocar o mês, o tipo deveria permanecer no que a pessoa escolheu? Hoje o estado local se perde na navegação.
- A lista vazia de um tipo precisa de uma frase, ou o total zerado basta?

## Flagged gaps

- Sem `MdIconButton` para o mês. Substituição: `Link.orc-mes-btn`. Não bloqueia. Ver `design-system/SYSTEM-BACKLOG.md`.
- `role="tablist"` em cima de filter chip. Não é peça faltando; é papel errado no markup. Não bloqueia a leitura da tela.
