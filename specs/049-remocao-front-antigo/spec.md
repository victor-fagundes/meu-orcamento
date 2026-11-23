# Feature Specification: Remoção do front antigo

**Feature Branch**: `049-remocao-front-antigo`

**Created**: 2026-11-23

**Status**: implemented

**Input**: User description: "/speckit-specify 049"

**Related**: No computador, Resumo, Orçamento, Lançamentos, Ano, Ajustes e Entrada passam a ser a única interface. A biblioteca e o tema antigos saem. A aparência continua a das histórias 042–048, já verificadas. O app do celular fica para a história 057.

## Referências visuais e de DS

- Identidade: `docs/identidade-visual/decisoes/DECISOES_identidade_visual.md` (seções aplicáveis: 1 Marca, 5 Layout, 7 Estados e mensagens, 9 Acessibilidade). Esta história não redesenha tela.
- Telas de referência: as mesmas já aceitas em 042–048. Casca em `docs/identidade-visual/telas-web/web-resumo-dados.dc.html`. Resumo, Orçamento, Lançamentos, Ano, Ajustes e Entrada permanecem nos artboards citados em cada uma dessas histórias.
- Componentes do DS usados: os já usados em 042–048. Nenhum controle da biblioteca antiga.
- Tokens: apenas os de `packages/design-system/src/core/tokens.ts`

## Critérios de aceite visuais

- AC-V1: hierarquia e textos iguais aos das telas já verificadas em 042–048. Esta história não registra diferença intencional de aparência.
- AC-V2: todos os componentes visíveis vêm do DS. A biblioteca antiga não aparece.
- AC-V3: estados vazio, erro e carregando permanecem os já aceitos em cada tela.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - As seis áreas continuam no computador (Priority: P1)

A pessoa abre Resumo, Orçamento, Lançamentos, Ano, Ajustes e Entrada nos mesmos endereços de antes. Cada área mostra a mesma hierarquia, os mesmos textos e os mesmos estados já aceitos. A casca com as cinco áreas continua em volta de Resumo, Orçamento, Lançamentos, Ano e Ajustes. Entrada continua sem essa casca. O claro, o escuro e a redução de movimento permanecem. O disponível do mês não muda para os mesmos lançamentos.

**Why this priority**: Tirar o visual antigo só vale se o orçamento continuar utilizável. Sem estas telas, a limpeza quebra o produto.

**Independent Test**: Abrir as seis áreas, no claro e no escuro, e repetir o caminho principal já aceito em cada uma. Comparar o disponível do mês antes e depois, com os mesmos lançamentos.

**Acceptance Scenarios**:

1. **Given** a pessoa tem sessão e um mês com lançamentos, **When** ela abre Resumo, Orçamento, Lançamentos, Ano e Ajustes, **Then** cada área abre no endereço atual, com a casca das cinco áreas, e o disponível desse mês é o mesmo de antes desta história.
2. **Given** a pessoa não tem sessão, **When** ela abre Entrada, **Then** vê a entrada já aceita na história 048, sem a casca das cinco áreas.
3. **Given** uma área está vazia, carregando ou em erro, **When** a pessoa a abre, **Then** vê o estado já aceito nessa história, com o mesmo texto.
4. **Given** o tema do sistema está claro, escuro, ou com menos movimento, **When** a pessoa percorre as seis áreas, **Then** a leitura permanece a das telas já verificadas. Com menos movimento, a transição não anima.

---

### User Story 2 - A biblioteca antiga sai do computador (Priority: P1)

O web não traz mais a biblioteca de componentes antiga nem o tema antigo. Nenhuma tela mostra controle, diálogo ou estilo dessa biblioteca. O que a pessoa vê vem da identidade visual. Uma menção antiga em documento ou spec pode continuar, desde que não recoloque a biblioteca na tela. Peça que já pertence à identidade visual permanece.

**Why this priority**: Duas interfaces no mesmo computador fazem a pessoa ver um produto que já foi substituído. A história existe para ficar uma só.

**Independent Test**: Percorrer as seis áreas e não encontrar controle da biblioteca antiga. Conferir que o web não instala nem carrega essa biblioteca, e que menção antiga em documento não altera a tela.

**Acceptance Scenarios**:

1. **Given** as histórias 043–048 estão verificadas, **When** a pessoa abre qualquer uma das seis áreas, **Then** não vê controle, diálogo nem tema da biblioteca antiga.
2. **Given** a limpeza terminou, **When** se confere o que o web instala e o que as telas carregam, **Then** a biblioteca antiga não está incluída e nenhuma tela a importa.
3. **Given** um documento ou uma spec antiga ainda cita essa biblioteca, **When** a pessoa abre o produto, **Then** a tela não muda por causa dessa citação.
4. **Given** a identidade visual usa um nome parecido no próprio sistema, **When** se revê o web, **Then** essa peça permanece e a biblioteca antiga continua fora.

---

### User Story 3 - O aparelho permanece como está (Priority: P2)

O app do celular não muda nesta história. As telas do aparelho, o tema delas e os dados que elas mostram continuam os de antes. A retirada desse tema fica para a história 057.

**Why this priority**: O computador já tem interface nova. O aparelho ainda não. Mexer nos dois ao mesmo tempo mistura duas entregas.

**Independent Test**: Abrir o app do celular antes e depois e ver as mesmas telas, sem arquivo do aparelho alterado por esta história.

**Acceptance Scenarios**:

1. **Given** o app do celular está como a última história do aparelho o deixou, **When** esta história termina no computador, **Then** o app abre as mesmas telas, com o mesmo tema.
2. **Given** a pessoa compara o aparelho antes e depois, **When** ela olha os arquivos dessa entrega, **Then** nada do app do celular foi alterado.

---

### Edge Cases

- Mês sem lançamento continua no estado vazio já aceito. Mês com lançamento mantém o mesmo disponível, o mesmo gasto e a mesma sobra.
- Endereço já usado de Resumo, Orçamento, Lançamentos, Ano, Ajustes ou Entrada abre a tela nova. Não volta a tela antiga.
- A casca some em Entrada e permanece nas outras cinco áreas, como já verificado.
- Claro, escuro e menos movimento não trazem o tema antigo de volta.
- Citação histórica da biblioteca em spec ou documento não a recoloca na tela. Peça da identidade visual que use nome parecido permanece.
- O estilo global pode guardar só o que a identidade ainda precisa. Sem isso, as seis áreas continuam com a aparência já aceita.
- Conta, sessão, categorias e lançamentos gravados permanecem. Nada é apagado nem recalculado por esta história.
- Spec antiga permanece no repositório. Esta história não reescreve o passado das histórias já verificadas.
- A história 057 é que retira o tema do aparelho. Se o app do celular ainda mostra o tema atual, esta história está correta.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: Resumo, Orçamento, Lançamentos, Ano, Ajustes e Entrada MUST permanecer nos endereços atuais. A aparência e os estados MUST ser os já aceitos nas histórias 042–048. Esta história MUST NOT redesenhar essas telas.
- **FR-002**: Com sessão, Resumo, Orçamento, Lançamentos, Ano e Ajustes MUST continuar dentro da casca das cinco áreas. Sem sessão, Entrada MUST NOT mostrar essa casca.
- **FR-003**: Para o mesmo mês e os mesmos lançamentos, o disponível, o gasto e a sobra MUST ser os mesmos antes e depois. Regras de centavos, competência e categoria MUST NOT mudar.
- **FR-004**: O web MUST NOT exibir controle, diálogo ou tema da biblioteca antiga. Toda peça visível MUST vir da identidade visual já usada nas histórias 042–048.
- **FR-005**: O web MUST NOT instalar nem carregar a biblioteca antiga. O tema antigo MUST sair. O que ainda for necessário à identidade no estilo global MAY permanecer.
- **FR-006**: Uma revisão do web MUST encontrar a marca da biblioteca antiga só na identidade visual, ou como menção histórica que não carrega a biblioteca. Menção em spec ou documento MUST NOT recolocar a biblioteca na tela.
- **FR-007**: Conta, sessão, categorias, lançamentos gravados e o acesso à própria conta MUST permanecer. Dado de outra conta MUST NOT aparecer.
- **FR-008**: O app do celular MUST permanecer como está. Esta história MUST NOT alterar as telas nem o tema do aparelho. Essa retirada permanece na história 057.
- **FR-009**: Specs já publicadas MUST permanecer. Esta história MUST NOT apagá-las.
- **FR-010**: Claro, escuro e menos movimento MUST continuar legíveis como nas telas já verificadas. Com menos movimento, a transição MUST NOT animar. A regra de tokens nas telas do computador MUST continuar valendo.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: A pessoa abre as seis áreas nos endereços atuais e conclui, em cada uma, o caminho principal já aceito. No claro e no escuro, as seis permanecem legíveis. Entrada segue sem a casca. As outras cinco seguem com a casca.
- **SC-002**: Nas seis áreas, zero controles da biblioteca antiga aparecem. Uma revisão do web não encontra essa biblioteca instalada nem carregada por uma tela.
- **SC-003**: Para um mês com os mesmos lançamentos, o disponível antes e depois é o mesmo valor. Mês vazio continua no estado vazio já aceito.
- **SC-004**: O app do celular fica com zero telas alteradas. Ele abre como antes desta história.
- **SC-005**: Citação antiga da biblioteca em documento não muda nenhuma das seis telas. A regra de tokens das telas do computador continua passando.

## Assumptions

- A spec curta anterior, com status `ready`, já fechava o escopo: a biblioteca antiga sai do web, junto com a declaração dela, o tema antigo, os componentes antigos e o CSS antigo do estilo global. As telas 043–048 continuam nas rotas atuais, só com a identidade visual. O app do celular fica para a história 057. Specs antigas permanecem. Domínio, banco, conta e API não mudam. Nenhuma regra de centavos, competência ou categoria muda. Esta versão guarda essas decisões e descreve o que a pessoa confere.
- A spec curta nomeou o que sai: a dependência `@material/web`, `src/types/material-web.d.ts`, `src/app/material-theme.css`, `src/components/material/**` e o CSS antigo de `src/app/globals.css`. O que sobrar no estilo global são os tokens da identidade, se as telas ainda precisarem deles. Esses nomes são o limite já aceito, não uma tela nova.
- O gate da spec curta era o `verified` das histórias 043–048. Em 23 nov 2026 essas histórias estão `verified`, junto com 041 e 042. A limpeza pode ser planejada. Não marcar `verified` nesta spec: isso é do PM, depois da revisão.
- A branch de trabalho é `rebuild-web`. A fase do celular, histórias 050–057, não começa aqui. A 057 é a que retira o tema do aparelho. Até lá, o app do celular permanece.
- `git grep "md-"` no web só pode achar o que pertence à identidade visual. `git grep "material"` só pode achar a identidade visual, ou menção histórica em spec ou documento que não carrega a biblioteca. Essa busca é a conferência da spec curta para o FR-006.
- A conferência desta história repete a já aceita em 043–048 e confirma que a biblioteca antiga não volta. A regra de tokens continua nas telas do computador. Não entra registro de depuração, tipo frouxo nem pendência nova.
- Não há diferença intencional em relação aos artboards. Se uma tela divergir do que foi verificado em 042–048, isso é falha desta história, não um desenho novo.
