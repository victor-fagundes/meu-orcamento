# Research: Entrada web

## 1. Onde a entrada está hoje

**Decision**: `/login`, `/cadastro` e `/esqueci-senha` deixam de usar `AuthShell`, `MdTextField` e `MdFilledButton`. A marca e o formulário passam para `EntradaMoldura` com `Campo`, `Botao` e `Banner`. `AuthShell`, o CSS `.auth-*` e a home `/` ficam no repositório até a história 049. A home não é redesenhada aqui.

**Rationale**: As três rotas já existem e os testes entram por `/login`. A spec troca a apresentação, não o endereço. A home ainda usa as classes antigas e não está na spec.

**Alternatives considered**: Estilizar o `AuthShell` atual. Rejeitado: o texto da marca é outro ("Planeje. Lance. Acompanhe.") e os controles são Material. Criar um prefixo novo de rota. Rejeitado: Ajustes já aponta Esqueci a senha para `/esqueci-senha`, e o middleware já manda `/app` para `/login`.

## 2. Campo de senha e estado sem frase

**Decision**: `CampoProps` ganha dois opcionais, com o padrão de hoje quando ausentes. `tipo`: `texto`, `email` ou `senha`. `completar`: `nome`, `email`, `senha-atual` ou `senha-nova`. No web, isso vira `type`, `inputMode` e `autocomplete`. No nativo, `senha` usa entrada oculta e `email` usa o teclado de e-mail. Quem já usa `Campo` não muda.

O `id` do campo também vira o `name` no web. Entrar usa `email` e `password`. Cadastro usa `name`, `email` e `password`. Esqueci usa `email`.

Credencial recusada não passa `erro` nos dois campos, porque isso escreveria a frase duas vezes. Passa `invalido`, também opcional. Com `invalido` e sem `erro`, o campo fica `aria-invalid`, a borda e o rótulo usam a cor de erro, e não há frase no campo. A frase fica só no `Banner` `erro`. Senha curta no cadastro usa `erro` com "Use pelo menos 8 caracteres."

Enquanto a ação corre, o `Botao` fica `disabled` e o rótulo permanece Entrar, Cadastrar ou Enviar link. Não se usa `loading`, porque o DS troca o rótulo para "Carregando…".

**Rationale**: O `Campo` de hoje é sempre texto visível e só mostra erro quando recebe uma frase. A spec pede senha oculta, uma frase só na credencial e o estado desenhado nos dois campos. O contrato é único para web e nativo. Props opcionais não mudam Orçamento, Lançamentos nem Ajustes. O `name` igual ao `id` mantém o preenchimento que os E2E já fazem em `input[name="email"]` e `input[name="password"]`.

**Alternatives considered**: Um componente só de senha. Rejeitado: a spec manda o `Campo` do DS, e o nativo teria um contrato diferente. Colocar a frase de credencial no `erro` dos dois campos. Rejeitado: a spec proíbe frase própria no campo. Usar `loading` no botão. Rejeitado: o rótulo do artboard sumiria.

## 3. Largo, estreito e a marca

**Decision**: O layout é `.mo-entrada` em `packages/design-system/src/web/base.css`, no mesmo corte `min-width: 720px` da casca. Abaixo disso, uma coluna: marca centralizada, Meu Orçamento, "O que ainda cabe neste mês." e o formulário com título. A partir de 720 px, duas colunas. A esquerda acrescenta "Entre para ver o que ainda cabe no mês." O formulário tem `max-width: var(--entrada-largura)`. O token novo é `--entrada-largura: 400px` em `tokens.css`, e `entradaLargura: 400` em `grid` dentro de `tokens.ts`. Nenhum estilo novo em `src/app` usa cor, espaço ou `px` solto.

A marca é o desenho do artboard, com `var(--md-brand-yellow)`, `var(--md-text)` e `var(--md-action)`. O SVG é `aria-hidden`. O nome visível é o texto Meu Orçamento. O título do formulário usa `--type-title-lg-size` (28). A frase grande do largo usa `--type-display-md-size` (40). Não há token de 44 px.

**Rationale**: 720 px já é o corte em que a casca troca de barra. A spec pede duas colunas em 720 e 1280 e uma coluna em 719 e 390. O bloco de 400 px do artboard precisa viver num token, senão o estilo novo quebra a regra de literais. O display médio é o degrau que existe para essa frase.

**Alternatives considered**: Medir 400 px no componente com `style`. Rejeitado: a regra de tokens vale para estilo novo. Esconder o título Entrar em 390 px, como o artboard do app. Rejeitado: a spec mantém o título para os três formulários continuarem nomeados.

## 4. Sessão vencida, sair e quem já entrou

**Decision**: Três entradas distintas.

- Abrir `/login` ou `/cadastro` com sessão válida redireciona para `/app/resumo`. `/esqueci-senha` não redireciona e não chama `signOut`.
- Sem cookie de sessão e sem a marca `mo-teve-sessao`, o middleware continua mandando `/app` para `/login?next=`, sem aviso. É o caso de quem nunca entrou.
- A área logada grava `mo-teve-sessao=1` neste navegador, sem segredo e sem ser a sessão. `Sair` em `dialogo-sair.tsx` e a exclusão em `excluir-tela.tsx` apagam essa marca e abrem `/login` sem query. O diálogo de Sair não muda o texto.
- Sem cookie de sessão e com a marca ainda presente, o middleware manda para `/login?sessao=expirada`, apaga a marca na resposta e mantém `next` quando houver. A página mostra o `Banner` `atencao` com "Sua sessão expirou. Entre de novo para continuar. Nada do que você digitou foi perdido." A senha começa vazia. Nada de formulário não salvo é restaurado.

`requireSessionOrcamento` passa a redirecionar para `/login?sessao=expirada` quando não há sessão. Esse caminho só ocorre se o middleware deixou passar um cookie que a sessão já não reconhece.

`src/lib/auth.ts` e `src/app/api/auth/**` não mudam.

**Rationale**: Hoje todo mundo sem cookie cai em `/login`, e o Sair voluntário também. A spec separa quem nunca entrou, quem saiu e quem teve a sessão vencida. O cookie de sessão some junto com o vencimento, então ele sozinho não guarda essa diferença. A marca não autentica. Apagá-la no Sair e na exclusão impede o aviso falso na visita seguinte a `/app`.

**Alternatives considered**: Aviso em todo redirect de `/app`. Rejeitado: quem nunca entrou leria que a sessão expirou. Só avisar quando `getSession` falha com cookie presente. Rejeitado: no vencimento real o cookie já foi embora e o aviso não apareceria. Mudar o prazo do token no Better Auth. Rejeitado: a spec mantém o mecanismo e não inclui a tela de nova senha.

## 5. Credencial, cadastro e link

**Decision**: As frases e a validação ficam em `src/domain/entrada.ts`. A tela chama essas funções e não reescreve a regra.

- E-mail vazio: "Informe o e-mail." E-mail que, depois do trim das pontas, não tem um `@` com texto dos dois lados e um ponto no lado direito: "Informe um e-mail válido."
- Senha vazia em Entrar: "Informe a senha." Nome vazio ou só com espaço: "Informe o nome."
- Senha nova com menos de 8 caracteres, sem tirar espaços: "Use pelo menos 8 caracteres." Essa checagem só roda no cadastro, antes de chamar o cliente. Se o servidor ainda recusar por tamanho, a mesma frase volta no campo.
- Credencial recusada, inclusive senha de 7 caracteres: só "E-mail ou senha incorretos. Confira os dados e tente de novo." A mensagem crua do cliente não aparece.
- E-mail já usado: "Já existe uma conta com esse e-mail." Os três campos continuam. Não se cria outra conta.
- Falha de rede ou resposta que não é recusa de credencial, tamanho nem e-mail usado: "Não foi possível salvar. Os campos continuam preenchidos."

O e-mail enviado ao cliente já está sem espaços nas pontas. A senha vai como foi digitada. Maiúsculas e minúsculas do e-mail continuam por conta do mecanismo já entregue.

O link enviado é estado da própria página `/esqueci-senha`, não uma rota nova. Sucesso e resposta de e-mail desconhecido mostram o mesmo `Banner` `atencao`: "Enviamos o link para {e-mail}. Confira também o spam.", o título Verifique seu e-mail e "O link vale por 30 minutos. Se não chegar, você pode pedir outro." O endereço é o digitado, já aparado. Reenviar repete o pedido e fica nessa confirmação. Falha de rede mostra a frase de falha e não troca o texto para dizer se a conta existe.

Cadastro concluído abre `/app/resumo`. Entrar concluído abre `next` se for um caminho interno que começa com `/` e não com `//`; senão, `/app/resumo`. Um segundo clique enquanto o primeiro não voltou não dispara outra chamada.

**Rationale**: A spec fecha as frases e a diferença entre senha curta no cadastro e credencial na entrada. O domínio puro evita a regra na tela e no cliente ao mesmo tempo. Não há artboard para a página de nova senha, e o prazo real do token fica no mecanismo que esta história não altera. A frase de 30 minutos é o texto que a pessoa lê.

**Alternatives considered**: Mostrar `err.message`. Rejeitado: a mensagem distingue causa e pode vir em outra língua. Rota `/esqueci-senha/enviado`. Rejeitado: a confirmação não precisa de endereço próprio e o reenvio continua na mesma vista. Tratar e-mail desconhecido como erro. Rejeitado: a spec exige a mesma confirmação.

## 6. Teste

**Decision**: Vitest em `src/domain/entrada.test.ts` para vazio, e-mail inválido, trim das pontas, senha de 7 e de 8 com espaço, e nome só com espaço. Playwright novo em `e2e/entrada.spec.ts`: senha errada com os campos conservados, cadastro com senha curta, envio de esqueci a senha até a confirmação, `/login` sem aviso e `/login?sessao=expirada` com o aviso, 1280 px com duas colunas e 390 px com uma, sem a navegação Principal. A captura final vai para `tests/visual/out/`. Os E2E que já entram com `demo@local.test` / `demo1234` permanecem, porque o botão continua "Entrar" e os `name` continuam `email` e `password`.

**Rationale**: A spec pede esses três fluxos na prova de ponta a ponta e a inspeção visual sem comparação de pixel bloqueante. O domínio cabe em teste rápido, sem navegador.

**Alternatives considered**: Só Playwright. Rejeitado: a regra de e-mail e de tamanho ficaria sem um teste que não depende da tela. Pixel-diff bloqueante. Rejeitado: a história 048, como as anteriores do rebuild, deixa a inspeção para o PM.
