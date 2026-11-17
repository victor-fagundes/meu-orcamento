# Feature Specification: Um item só no Orçamento

**Feature Branch**: `022-item-unico`

**Created**: 2026-11-16

**Status**: `verified`

**Input**: User description: "GAP-005 — o plano importado da seção Despesas Fixas grava no item do catálogo (Moradia / Aluguel), não cria um segundo grupo com o nome da aba. O Novo lançamento não abre no item vazio. Grupos sem plano e sem gasto não ficam acima do grupo que tem o dinheiro."

**Related**: Emenda o comportamento de `015-import-planejamento` (MO-804) e a leitura desse plano em `011-orcamento-mensal` e `007-lancamentos`. Não reabre a 020. GAP-006 (gráfico do Resumo) e GAP-007 (teclado do sheet) ficam de fora.

## Clarifications

### Session 2026-11-16

- Q: Quando o nome existe no catálogo em outro tipo (Luz na seção Despesas Fixas, e a única Luz do catálogo é Habitação, variável), qual classificação vale? → A: O catálogo vence. O plano entra nesse item e o tipo não muda.
- Q: O que fazer com o par já gravado (Aluguel em Moradia com plano zero e outro Aluguel num grupo com o nome da aba)? → C: Fundir o plano no item do catálogo e arquivar o extra. O histórico do extra permanece.
- Q: Quando a conta já tem o item do catálogo e outro item ativo com o mesmo nome, em que momento o plano é fundido e o extra é arquivado? → A: Sozinha, na primeira vez que a pessoa abre esse orçamento depois desta entrega.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Plano cai no item do catálogo (Priority: P1)

Quem importa a planilha de gastos precisa ver o Aluguel de R$ 1.700 em Moradia, dentro de Despesas fixas. A seção “Despesas Fixas” da planilha só diz que as linhas seguintes são despesa fixa. Ela não vira uma categoria com o mesmo nome da aba.

**Why this priority**: Hoje o plano inteiro fica num grupo chamado “Despesas Fixas”, no fim da lista, e Moradia / Aluguel continua em zero. Lançar no item errado não move a barra que a pessoa está olhando.

**Independent Test**: Importar uma planilha cuja seção “Despesas Fixas” tem a linha Aluguel com valor no mês. Na prévia e, depois de confirmar, no Orçamento, existe um único Aluguel, em Moradia, com esse valor. Não existe grupo “Despesas Fixas”.

**Acceptance Scenarios**:

1. **Given** o catálogo já tem Despesas fixas / Moradia / Aluguel sem plano neste mês, **When** a pessoa confirma uma planilha com a seção “Despesas Fixas” e a linha Aluguel preenchida, **Then** o plano desse mês entra em Moradia / Aluguel e nenhum segundo Aluguel é criado.
2. **Given** a prévia dessa planilha, **When** a pessoa lê a linha Aluguel, **Then** a categoria mostrada é Moradia, não “Despesas Fixas”.
3. **Given** a pessoa cancela a confirmação, **When** ela volta ao Orçamento, **Then** nenhum plano mudou.
4. **Given** a planilha traz um mês vazio ou zero para um item que já tem plano, **When** a importação confirma, **Then** esse mês permanece como já estava (a regra de merge da 020 continua valendo).
5. **Given** o catálogo só tem Luz em Habitação, como despesa variável, **When** a pessoa confirma uma linha Luz sob a seção Despesas Fixas, **Then** o plano entra em Habitação / Luz e Luz continua variável. Não nasce Luz em Despesas fixas.

---

### User Story 2 - Achar o plano e lançar nele (Priority: P1)

Na tela Orçamento do mês, a categoria que tem dinheiro aparece antes das categorias zeradas. Ao registrar um lançamento, o formulário abre no item que tem plano, não num item vazio de mesmo nome.

**Why this priority**: A conta demo já tem os dois Aluguéis. A lista ativa precisa ficar com um só, e o formulário precisa abrir no item que tem plano.

**Independent Test**: Na conta com Moradia / Aluguel em zero e outro Aluguel orçado num grupo chamado “Despesas Fixas”, abrir Despesas fixas mostra um único Aluguel ativo, em Moradia, com o plano. O outro está em Ajustes, arquivado. Novo lançamento abre no Aluguel de Moradia.

**Acceptance Scenarios**:

1. **Given** o mês tem um grupo com plano ou gasto e outros grupos em zero nos dois, **When** a pessoa abre Despesas fixas, **Then** o grupo com valor aparece acima dos grupos zerados.
2. **Given** existem dois itens chamados Aluguel e só um tem plano neste mês, **When** a pessoa abre Novo lançamento, **Then** o item selecionado é o que tem plano.
3. **Given** todos os grupos do tipo estão zerados no mês, **When** a pessoa abre a aba, **Then** a lista continua utilizável e o botão de novo item segue visível.
4. **Given** um grupo zerado neste mês, **When** a pessoa ainda quer incluir um item nele, **Then** o grupo continua na lista, só não ocupa o topo.
5. **Given** Moradia / Aluguel está com plano zero e existe outro Aluguel ativo, com plano, num grupo de mesmo nome da aba, **When** a pessoa abre esse orçamento pela primeira vez depois desta entrega, **Then** cada mês com valor no item extra e zero no item do catálogo passa para Moradia / Aluguel antes da tela aparecer. Mês em que o catálogo já tem valor positivo não é substituído.
6. **Given** essa abertura, **When** a pessoa vê Despesas fixas, **Then** o item extra não aparece. Em Ajustes, ele está na lista de arquivados. Abrir de novo não arquiva nem copia plano outra vez.
7. **Given** o item extra já tem lançamentos, **When** ele é arquivado, **Then** esses lançamentos continuam gravados nele, com o mesmo valor e a mesma competência, e somem do seletor de novos lançamentos.

---

### User Story 3 - Itens que a planilha não encontra no catálogo (Priority: P2)

Nomes que não existem no catálogo (por exemplo FIES, Ajuda mãe, Streaming) ainda precisam entrar no orçamento, sem inventar uma categoria com o nome da aba.

**Why this priority**: Sem isso, a próxima importação recria o grupo “Despesas Fixas” para tudo que não é Aluguel.

**Independent Test**: Confirmar uma linha “Streaming” que não existe no catálogo. O Orçamento ganha um Streaming novo, fora de um grupo chamado “Despesas Fixas”, “Despesas Variáveis”, “Receitas” ou “Anuais”.

**Acceptance Scenarios**:

1. **Given** o nome da linha não corresponde a nenhum item do catálogo, **When** a pessoa confirma a importação, **Then** nasce um item com esse nome, no tipo da seção (fixa, variável, anual ou receita) e no grupo Outros desse tipo.
2. **Given** a prévia, **When** a pessoa lê essa linha, **Then** ela vê o grupo Outros sugerido antes de confirmar.
3. **Given** o nome difere do catálogo por mais do que maiúsculas ou acento (NET/Claro e Internet / TV), **When** a prévia é montada, **Then** a linha não é colada no item do catálogo.

---

### Edge Cases

- Vários itens do catálogo com o mesmo nome (há “Outros” em mais de um grupo): a prévia não escolhe sozinha. A linha só confirma depois que a pessoa indica o grupo.
- Comparação de nome ignora maiúsculas e acentos. Não aproxima nomes parecidos.
- Célula negativa ou ilegível continua zerando aquele mês, como na 020. Célula vazia ou zero literal não apaga plano já gravado.
- Grupo com plano em outro mês e zero no mês aberto desce na lista daquele mês.
- Na correção do par já gravado, o lançamento não muda de item. O item extra é arquivado e o plano é que muda de dono. Lançamento já salvo continua na lista de Lançamentos, como na spec 003.
- A correção automática roda uma vez por orçamento, na primeira abertura depois desta entrega. Se não houver par para fundir, nada muda. A segunda abertura não copia plano de novo nem rearquiva.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: Quando a linha da planilha tem o mesmo nome de um único item do catálogo deste orçamento, o plano MUST atualizar esse item. O grupo e o tipo permanecem os do catálogo. A seção da planilha MUST NOT virar o nome do grupo.
- **FR-002**: A prévia MUST mostrar o grupo em que o plano vai cair, antes da confirmação.
- **FR-003**: Cancelar a confirmação MUST NOT alterar plano nem criar item.
- **FR-004**: A regra de merge da 020 (mês vazio ou zero não apaga; mês com valor positivo substitui; negativo ou ilegível zera aquele mês) MUST continuar valendo.
- **FR-005**: No Orçamento, grupos com plano ou gasto no mês aberto MUST aparecer antes dos grupos sem plano e sem gasto nesse mês. Grupos zerados MUST continuar acessíveis.
- **FR-006**: Novo lançamento MUST abrir no item de mesmo nome que tem plano no mês da competência. Se nenhum tiver plano nesse mês, abre no item que tenha plano em algum mês do ano. Se nenhum tiver, mantém a escolha atual.
- **FR-007**: Nome que não existe no catálogo MUST criar item no tipo da seção e no grupo Outros desse tipo. A prévia MUST mostrar esse grupo. MUST NOT criar grupo “Despesas Fixas”, “Despesas Variáveis”, “Receitas” ou “Anuais”.
- **FR-008**: Se mais de um item do catálogo tem o mesmo nome, a linha MUST NOT ser confirmada até a pessoa escolher o grupo na prévia.
- **FR-009**: Quando o único item de mesmo nome está em outro tipo, o plano MUST entrar nesse item do catálogo. O tipo e o grupo MUST NOT mudar. A seção da planilha não promove Luz a despesa fixa.
- **FR-010**: Na primeira vez que a pessoa abre esse orçamento depois desta entrega, e antes da tela aparecer, se existe um item do catálogo com aquele nome e outro item ativo de mesmo nome num grupo que repete o nome da aba, a correção MUST copiar para o item do catálogo os meses em que o extra tem valor positivo e o catálogo está em zero. Mês em que o catálogo já tem valor positivo permanece. O item extra MUST ser arquivado: sai da lista ativa e do seletor, aparece em Ajustes, e os lançamentos já gravados nele permanecem. A abertura seguinte MUST NOT repetir a cópia nem o arquivamento.

### Key Entities

- **Item de orçamento**: nome, tipo (receita, fixa, variável, anual) e grupo do catálogo. O plano do mês vive nesse item.
- **Linha de planejamento**: nome, tipo sugerido pela seção da planilha, valores dos meses e o grupo em que a prévia diz que o plano vai cair.
- **Grupo**: conjunto de itens dentro de um tipo. Não é a aba (Despesas fixas, Despesas variáveis, Receitas, Anuais).

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Depois de confirmar a planilha de exemplo com Aluguel sob a seção Despesas Fixas, o Orçamento mostra um único Aluguel, em Moradia, com o valor da planilha, e zero grupos chamados “Despesas Fixas”.
- **SC-002**: Na conta que hoje tem Aluguel orçado no grupo “Despesas Fixas” e Moradia / Aluguel em zero, a primeira abertura desse orçamento, sem botão e sem nova importação, deixa a lista ativa com um Aluguel, em Moradia, com esse plano. O outro Aluguel está arquivado em Ajustes, com os lançamentos que já tinha.
- **SC-003**: Novo lançamento, nessa mesma conta, abre no Aluguel de Moradia. Grupos zerados no mês continuam na lista, abaixo dos grupos que têm plano ou gasto.
- **SC-004**: Uma linha com nome inédito aparece na prévia com grupo Outros e, após confirmar, não cria grupo com o nome da aba.

## Assumptions

- O catálogo padrão continua a fonte dos grupos (Moradia, Educação, Habitação, e o Outros de cada tipo).
- “Mesmo nome” ignora maiúsculas e acentos e não tenta adivinhar sinônimos.
- Nome inédito cai em Outros do tipo da seção. A pessoa vê isso na prévia e pode cancelar.
- Esta história não muda o gráfico do Resumo, o texto “Saldo do período”, o foco do teclado nos sheets, nem o rótulo acessível de Arquivar (GAP-006 e GAP-007).
- Valores seguem em centavos no domínio. A spec fala em reais só na leitura da tela.
