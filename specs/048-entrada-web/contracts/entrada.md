# Contract: Entrada web

Quem não tem sessão não vê a navegação Principal. A partir de 720 px a marca fica à esquerda e o formulário no bloco de `--entrada-largura`. Abaixo de 720 px a marca fica centralizada acima do formulário. A frase "Entre para ver o que ainda cabe no mês." só existe no largo. Estilo novo usa token. `src/lib/auth.ts` e `src/app/api/auth/**` não mudam.

## Entrar

`/login` mostra a marca, Meu Orçamento, "O que ainda cabe neste mês.", o título Entrar, E-mail, Senha, Esqueci a senha, Entrar e Criar conta.

E-mail vazio: "Informe o e-mail." Senha vazia: "Informe a senha." E-mail que não é endereço: "Informe um e-mail válido." Nada disso é enviado.

Credencial da própria conta abre `/app/resumo`, ou o `next` interno que começou com `/` e não com `//`. Credencial recusada, inclusive senha de 7 caracteres, mostra só "E-mail ou senha incorretos. Confira os dados e tente de novo." Os dois campos ficam inválidos, sem frase própria, e conservam o que foi digitado. Não há sessão.

Com sessão válida, `/login` abre `/app/resumo`.

`/login?sessao=expirada` mostra o aviso "Sua sessão expirou. Entre de novo para continuar. Nada do que você digitou foi perdido." A senha está vazia. Sem essa query, o aviso não aparece.

## Criar conta

`/cadastro` mostra a mesma marca e o título Criar conta, Nome, E-mail, Senha, Cadastrar e Já tenho conta.

Nome vazio: "Informe o nome." E-mail vazio ou inválido usa as frases de Entrar. Senha com menos de 8 caracteres: "Use pelo menos 8 caracteres." no campo senha, e nada é gravado. Espaço na senha conta. Espaço nas pontas do e-mail não conta.

Nome, e-mail válido e senha de 8 caracteres criam a conta e abrem `/app/resumo`. E-mail já usado: "Já existe uma conta com esse e-mail." Os três campos continuam e não nasce segunda conta.

Um segundo acionamento antes do retorno não dispara outra criação. Com sessão válida, `/cadastro` abre `/app/resumo`.

## Esqueci a senha

`/esqueci-senha` mostra a marca, o título Esqueci a senha, "Enviaremos um link para você criar uma nova senha.", E-mail, Enviar link e Voltar para entrar. Com sessão, a página abre e a sessão continua.

E-mail vazio ou inválido usa as frases de Entrar e não envia. Pedido concluído, com ou sem conta naquele e-mail, mostra "Enviamos o link para {e-mail}. Confira também o spam.", o título Verifique seu e-mail, "O link vale por 30 minutos. Se não chegar, você pode pedir outro.", Voltar para entrar e Reenviar link. O endereço é o digitado, sem espaços nas pontas. A página não diz se a conta existe.

Reenviar fica nessa confirmação. Falha de rede mostra "Não foi possível salvar. Os campos continuam preenchidos." e não troca a confirmação por uma frase sobre a existência da conta.

Não há tela para escolher a nova senha.

## Sessão e Sair

A área logada grava a marca `mo-teve-sessao`. Essa marca não abre `/app`.

Sem cookie de sessão e sem a marca, `/app` vai para `/login?next=`, sem aviso. Sem cookie de sessão e com a marca, `/app` vai para `/login?sessao=expirada` e a resposta apaga a marca.

Sair, confirmado no diálogo que já existe, apaga a marca e abre `/login` sem aviso e sem diálogo. Cancelar mantém a sessão. Excluir a conta também apaga a marca e abre `/login` sem o aviso de sessão expirada.

## Falha, teclado e tema

Falha ao concluir Entrar, Criar conta ou o primeiro envio do link mostra "Não foi possível salvar. Os campos continuam preenchidos." O que foi digitado continua. Não nasce conta nem sessão pela metade.

Cada campo tem rótulo visível ligado ao controle. O foco é visível. Campos, links e botões são alcançáveis pelo teclado. Claro e escuro usam os tokens já trocados pelo tema. Com menos movimento, o aviso não anima.

A mensagem crua do cliente de autenticação não aparece na tela.
