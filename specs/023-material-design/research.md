# Research: Material Design

## 1. De onde vem o design system

**Decision**: Instalar `@material/web` pelo npm. Ícones pela fonte Material Symbols no `next/font`. Não conectar MCP.

**Rationale**: É a biblioteca oficial do Material 3 para a web. O workspace não tem conector do Google para design system. Um zip solto ficaria fora do build.

**Alternatives considered**: MUI. Rejeitado: não é o design system do Google. Copiar o CSS do protótipo sem o pacote. Rejeitado: o PM pediu o design system, não só a paleta. Baixar o kit do Figma. Rejeitado: este app não consome Figma no build.

## 2. Paleta

**Decision**: Gravar em `src/app/material-theme.css` os papéis do protótipo (claro e escuro) a partir da semente `#0057B8`. O amarelo `#FFE600` é fixo na marca, no alerta preventivo e na série Realizado. Não gera terciária automática, porque a terciária do azul sairia marrom e apagaria a marca.

**Rationale**: A cor já foi escolhida no protótipo e na spec. Um gerador em tempo de execução aumentaria o bundle sem mudar o resultado.

**Alternatives considered**: `@material/material-color-utilities` no cliente. Rejeitado: a semente não muda em runtime e não há seletor de tema. Roxo padrão do Material. Rejeitado na spec.

## 3. O que vira componente oficial e o que fica link

**Decision**: Botão preenchido, contornado e de texto, campo, select, checkbox, chip de filtro, botão de ícone, ícone, progresso linear e o diálogo largo vêm de `@material/web`. Abas do computador e a barra do celular continuam `<Link>` do Next, desenhadas com os tokens (indicador, pílula, ícone, nome).

**Rationale**: As abas oficiais são botões. Trocar a navegação por elas perderia a rota de verdade, o link de abrir em outra aba e o estado ativo pela URL. React 19 já encaminha evento de clique para custom element, então os botões oficiais funcionam dentro dos client components.

**Alternatives considered**: `md-tabs` e `md-navigation-bar` no lugar dos links. Rejeitado pelo motivo acima. Estilizar todo controle na mão. Rejeitado: aí não estaríamos usando o pacote.

## 4. Servidor e hidratação

**Decision**: Um client component `register.tsx` importa os módulos `@material/web/...` . O layout do servidor não importa o pacote. `next.config.ts` ganha `transpilePackages: ["@material/web", "lit"]`.

**Rationale**: Os custom elements tocam `window` e `HTMLElement`. Importá-los num server component quebra o render. O Tailwind não entra no shadow DOM desses controles; o tema entra pelas variáveis `--md-sys-color-*` no `:root`, que o pacote já lê.

**Alternatives considered**: `ssr: false` na página inteira. Rejeitado: as páginas de dados continuam no servidor. Reescrever os controles em React. Rejeitado: duplica o design system.

## 5. Sheet no celular

**Decision**: Um único `sheet.tsx`. A partir de 720px usa `md-dialog`. Abaixo disso, uma folha pela base com alça, os mesmos filhos e os mesmos botões oficiais. Escape, toque fora e devolução do foco ficam nesse wrapper.

**Rationale**: `@material/web` não traz bottom sheet. A spec pede os dois formatos. O ponto 720px já é o da navegação atual.

**Alternatives considered**: `md-dialog` também no celular. Rejeitado: não tem alça nem entra pela base. Manter o sheet CSS antigo com botões novos só no celular e o diálogo só no largo. É esta a decisão; o wrapper evita duas cópias do formulário.

## 6. Novo lançamento em toda seção

**Decision**: `src/app/app/layout.tsx` chama `listItensAtivosParaLancamento` e `listCartoesAtivos` e passa ao chrome. O mês do sheet é o `mes` da URL, ou o mês corrente se o parâmetro for inválido. A gravação continua `criarLancamentoAction`. A página de Lançamentos pode manter a própria leitura.

**Rationale**: O layout do App Router não recebe `searchParams`. O cliente lê a query sem regra nova. Repetir a leitura no layout é mais simples do que um cache compartilhado.

**Alternatives considered**: Deixar o botão só em Lançamentos. Rejeitado pela spec (FR-004). Buscar itens num endpoint novo. Rejeitado: a função de aplicação já existe.

## 7. O que não se mexe

**Decision**: `src/domain/**` intacto. Gráficos e a tabela do ano ficam em CSS com os tokens. Vitest atual é a rede de segurança de que o número não mudou. Não há teste de domínio novo.

**Rationale**: A spec trava cálculo, competência, parcelas, importação e exportação. Os testes de UI por classe (`auth-btn`) não existem no repositório; o aceite é o quickstart.
