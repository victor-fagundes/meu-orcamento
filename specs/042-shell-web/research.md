# Research: Shell da aplicação

## 1. Onde a casca está hoje

**Decision**: `src/app/app/layout.tsx` deixa de renderizar `AppChrome` e passa a renderizar `ShellApp`. `requireSessionOrcamento` continua no layout. Sem sessão, o redirect para `/login` permanece.

**Rationale**: `ShellApp` e `NavegacaoPrincipal` já existem no pacote (`packages/design-system/src/web/shell-app.tsx`). A casca logada de hoje é `src/components/app-chrome.tsx`: barra no topo, `AppNav`, “Novo lançamento” e um botão flutuante. A spec pede a lateral e a inferior do pacote, não essa barra de cima. O PRD 5.1 fala em navegação superior; a spec 042 já escolheu a lateral.

**Alternatives considered**: Estilizar `AppNav` até bater 240 px e 76 px. Rejeitado: manteria a segunda navegação e o botão flutuante. Recriar a barra no app, sem `ShellApp`. Rejeitado: a história 040 entregou o componente para esta história usar.

## 2. Endereço e aba atual

**Decision**: A tabela das cinco áreas fica numa função pura, `src/components/casca-abas.ts`. Ordem: Resumo `/app/resumo` (`dashboard`), Orçamento `/app/orcamento` (`assignment`), Lançamentos `/app/lancamentos` (`list`), Ano `/app/ano` (`calendar_month`), Ajustes `/app/ajustes` (`settings`). `abaAtiva` ignora a query. Qualquer caminho que começa com `/app/ajustes` devolve `ajustes`. Os outros devolvem a área cujo endereço é prefixo do caminho. `onNavegar` faz `router.push` desse endereço. O componente do pacote continua sendo botão com `aria-current="page"`.

**Rationale**: Os ícones são os de `docs/design/ICONES.md`, e os caminhos já estão em `icons-paths.ts`. O app de hoje usa `home` e `wallet`; a ficha de ícones não. A spec pede o endereço que a pessoa já usa e uma aba só. Subtela de Ajustes ainda não existe como rota; o prefixo deixa a regra pronta sem desenhar a história 047. Botão com `onNavegar` é o contrato que a história 040 fechou. Trocar por link mudaria o pacote sem a spec pedir.

**Alternatives considered**: `Link` dentro de uma navegação nova no app. Rejeitado: seria a segunda barra. Marcar Ajustes só na página `/app/ajustes` exata. Rejeitado: a spec cobre o endereço direto de uma tela de dentro de Ajustes.

## 3. Mês no cabeçalho

**Decision**: O cabeçalho é `CabecalhoTela`. As cinco áreas nascem com `pedeMes: false`. O slot existe: quando uma área pedir, o cabeçalho recebe `navegacaoMes` com os nomes “Mês anterior” e “Próximo mês”, o rótulo de `labelCompetencia` e o deslocamento de `shiftCompetencia` em `src/lib/competencia-nav.ts`, gravando `?mes=`. Nesta história nenhuma área pede.

**Rationale**: `CabecalhoTela` já rotula os dois botões. Resumo, Orçamento e Lançamentos ainda desenham o mês no miolo e leem `?mes=`. Ligar o mês na casca agora duplicaria o controle. A spec deixa a decisão para as histórias 043–046 e diz que a conta do mês não muda. `src/domain/competencia.ts` não entra.

**Alternatives considered**: Mover o mês do miolo para o cabeçalho agora. Rejeitado: a spec tira o miolo desta história. Apagar o slot. Rejeitado: a spec exige o controle quando a tela pede.

## 4. Botão flutuante e “Novo lançamento”

**Decision**: A casca não monta o botão flutuante, nem o “Novo lançamento” do topo, nem `NovoLancamentoSheet`. O layout deixa de buscar itens e cartões só para essa folha. Os arquivos da folha e de `AppChrome` permanecem até a história 049. `Fab` do pacote já não renderiza nada no web e não é usado aqui.

**Rationale**: Os dois controles vivem só em `app-chrome.tsx`. A spec proíbe flutuante em 1280 px e em 390 px, e manda o criar para o topo do conteúdo nas histórias 043–048. A frase vazia de Lançamentos ainda cita “Novo lançamento”; trocar essa frase seria miolo da 045.

**Alternatives considered**: Deixar o botão do topo, só tirar o flutuante. Rejeitado: o topo novo é o título da área, não a barra antiga. Construir “Novo lançamento” no topo de Lançamentos agora. Rejeitado: é a história 045.

## 5. Sair

**Decision**: A casca mostra um `Botao` variante `texto`, rótulo “Sair”, fora das cinco abas. O clique continua `authClient.signOut()` e ida a `/login`, como `SignOutButton`. Não abre diálogo.

**Rationale**: Hoje “Sair” só existe na casca. Ajustes ainda não tem essa ação. Tirá-la deixa a pessoa sem saída até a história 047, que é quem coloca Sair em Ajustes, com diálogo. Não é aba nova e não usa `@material/web`.

**Alternatives considered**: Tirar Sair nesta história. Rejeitado: a conta demo fica presa. Implementar o diálogo da 047. Rejeitado: a spec 047 é que define essa confirmação.

## 6. Grade

**Decision**: Ajustar `.mo-shell__conteudo` em `packages/design-system/src/web/base.css`, só com variáveis que `tokens.css` já publica. Abaixo de 720 px: 4 colunas, margem `--grid-margin-mobile`, espaço `--grid-gutter-mobile`, padding inferior `--bottom-bar-height`. A partir de 720 px: 12 colunas, margem `--grid-margin-desktop`, espaço `--grid-gutter-desktop`, padding inferior 0. A largura máxima da caixa é `--content-max-width` mais as duas margens, com `box-sizing: border-box`, para o miolo das colunas não passar de 960 px. Cada filho direto ocupa da primeira à última coluna. O cabeçalho usa a mesma margem lateral e, no largo, a mesma largura máxima, para o título alinhar com o conteúdo. A media query continua `min-width: 720px`, igual a `grid.breakpointDesktop`. Nenhum número novo em `tokens.ts`.

**Rationale**: A conta de `docs/design/GRID.md` fecha em coluna de 58 px quando o miolo tem 960 px e a margem de 40 px fica fora: 12×58 + 11×24 = 960. O CSS de hoje põe `max-width: var(--content-max-width)` sem as doze colunas. Somar padding de 40 px em cima desse máximo encolheria as colunas. `var()` não funciona dentro de media query no navegador desta aplicação; o 720 px literal já está no arquivo e é o mesmo token. Filho em todas as colunas evita esmagar o miolo atual, que não foi escrito em doze faixas. A spec pede que o fim do conteúdo no estreito fique acima da barra; o padding inferior com a altura da barra já é essa folga.

**Alternatives considered**: Grade só no app, com número solto. Rejeitado: a regra de token e a história 040 concentram a medida no pacote. Forçar cada bloco atual a escolher coluna. Rejeitado: isso redesenha as telas 043–048. Criar token novo. Rejeitado: 76, 960, 720, 240, 40, 24, 16 e as contagens de coluna já existem.

## 7. Foco, tema e movimento

**Decision**: O primeiro controle é o skip link “Ir para o conteúdo”, apontando para a região do miolo. Ícone da aba segue decorativo, com o nome da área no botão. Não há transição de rota. Claro e escuro continuam em `data-theme` e nos tokens. Com `prefers-reduced-motion`, `--motion-fast`, `--motion-base` e `--motion-slow` já são 0 ms. A casca não acrescenta animação.

**Rationale**: O skip link já existe em `AppChrome` e atende o teclado. O teste de `ShellApp` já vê `aria-current="page"`. O tema é a história 040; a 047 só muda o controle em Ajustes.

**Alternatives considered**: Animar a troca de área com os tokens de movimento. Rejeitado: a spec pede troca instantânea quando a pessoa prefere menos movimento, e a navegação não precisa de animação.

## 8. O que não muda

**Decision**: Não mexer em `src/domain`, no schema, nas cinco páginas além de continuarem filhas da casca, em `/login`, no Android, em `globals.css` e em `@material/web`. Dois `h1` (o do `CabecalhoTela` e o título que a página ainda desenha) ficam até a história daquela tela tirar o dela.

**Rationale**: Apagar o `h1` da página é miolo. Apagar `globals.css` é a história 049. A entrada é a história 048.

**Alternatives considered**: Esconder o título da página com CSS global. Rejeitado: some texto que a história da tela ainda não entregou de outro jeito.
