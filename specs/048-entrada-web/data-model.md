# Data Model: Entrada web

Não há tabela nova, coluna nova nem migração. `src/lib/auth.ts` não muda. A conta, a sessão e o pedido de link continuam onde já estão. Tudo o que a tela decide antes de chamar o cliente está em `src/domain/entrada.ts`.

## Conta

| Campo | Regra nesta história |
|---|---|
| Nome | Obrigatório no cadastro. Só espaço vale vazio e mostra "Informe o nome." Não há teto novo |
| E-mail | Obrigatório. Espaço só nas pontas é ignorado. Sem texto, "Informe o e-mail." Sem a forma de endereço, "Informe um e-mail válido." Um e-mail já usado não cria segunda conta e mostra "Já existe uma conta com esse e-mail." Caixa alta e baixa continuam com o mecanismo já entregue |
| Senha | No cadastro, menos de 8 caracteres não grava e o campo mostra "Use pelo menos 8 caracteres." Espaço conta. A senha não é aparada. Na entrada, a senha vazia mostra "Informe a senha." Senha curta com e-mail preenchido cai na frase única de credencial |

## Sessão

A sessão continua sendo a que o mecanismo já abre e fecha. Esta história não guarda senha nem cópia da sessão.

| Estado | O que a pessoa vê |
|---|---|
| Sem sessão e sem marca | `/login`, `/cadastro` ou `/esqueci-senha`, sem aviso de sessão expirada. `/app` vai para `/login?next=` |
| Sessão válida | `/login` e `/cadastro` vão para `/app/resumo`. `/esqueci-senha` abre a recuperação e a sessão fica |
| Marca `mo-teve-sessao` sem cookie de sessão | A próxima ida a `/app` abre `/login?sessao=expirada`. O aviso é o de sessão expirada. A senha está vazia. A marca é apagada nessa resposta |
| Sair confirmado ou conta excluída | A marca é apagada e `/login` abre sem o aviso e sem o diálogo |

A marca é um cookie deste navegador, sem segredo, gravado pela área logada. Não substitui a sessão e não autoriza `/app`.

`next` só é aceito se for um caminho do próprio site: começa com `/` e não com `//`. Credencial aceita abre esse caminho. Cadastro aceito abre `/app/resumo`.

## Link de recuperação

Não há entidade nova. O pedido usa o e-mail já aparado.

| Resultado | Tela |
|---|---|
| Pedido aceito, ou e-mail sem conta | A mesma confirmação, com o endereço digitado e a frase de 30 minutos. Não diz se a conta existe |
| Falha de rede | "Não foi possível salvar. Os campos continuam preenchidos." Na confirmação, o reenvio que falha mantém o título e não acrescenta frase sobre a existência da conta |
| Reenvio | Continua na confirmação |

A tela de escolher a nova senha não entra. O prazo real do link não é alterado.

## Transições

1. Credencial aceita ou cadastro aceito: sem sessão → sessão válida → Resumo, ou o `next` interno no caso da credencial.
2. Credencial recusada: continua sem sessão, campos preenchidos, uma frase só.
3. Senha nova curta, campo vazio ou e-mail inválido: nada é enviado.
4. Sessão válida → marca presente. Cookie de sessão some e a marca fica → aviso de sessão expirada → marca apagada.
5. Sair ou exclusão → marca apagada → Entrar sem aviso.
