# Quickstart: Entrada web

Validação depois da implementação. A spec está `ready`. Isto não substitui o Vitest nem o Playwright.

## Pré-requisitos

- Branch de trabalho `rebuild-web`
- `npm test` e `npx tsc --noEmit` verdes
- App em `http://localhost:3000`
- Conta demo local: `demo@local.test` / `demo1234`

Não criar a conta demo de novo. Não confirmar Sair nela, salvo num teste que entre de novo depois.

## Teste automático

```bash
npm test -- src/domain/entrada.test.ts
npx playwright test e2e/entrada.spec.ts e2e/casca.spec.ts e2e/ajustes.spec.ts
npx tsc --noEmit
```

`entrada.test.ts` cobre e-mail vazio, e-mail com espaço nas pontas, e-mail sem `@`, nome só com espaço, senha nova de 7 caracteres e senha nova de 8 com espaço no meio.

O Playwright de `e2e/entrada.spec.ts` confere a senha errada com os dois valores ainda nos campos, o cadastro que não grava senha de 7 caracteres, o envio de esqueci a senha até a confirmação, a ausência do aviso em `/login` e a presença do aviso em `/login?sessao=expirada`. Em 1280 px há duas colunas. Em 390 px há uma, e a navegação Principal não aparece. A captura final vai para `tests/visual/out/`.

`casca.spec.ts` e `ajustes.spec.ts` continuam entrando pela conta demo. O botão segue "Entrar" e os campos seguem `email` e `password`.

## 1. Entrar

1. Abrir `/login` em 1280 px, sem sessão.
2. Esperado: duas colunas. A esquerda lê "O que ainda cabe neste mês." e "Entre para ver o que ainda cabe no mês." Não há aviso de sessão expirada e não há navegação Principal.
3. Entrar com a senha errada.
4. Esperado: "E-mail ou senha incorretos. Confira os dados e tente de novo." E-mail e senha continuam. A página não diz qual dos dois falhou.
5. Entrar com `demo@local.test` / `demo1234`.
6. Esperado: o Resumo abre.

## 2. Criar conta e esqueci a senha

1. Sair da sessão de teste, ou usar uma janela sem sessão, e abrir `/cadastro` em 390 px.
2. Esperado: uma coluna, marca acima do formulário, título Criar conta. A frase "Entre para ver o que ainda cabe no mês." não aparece.
3. Cadastrar com senha de 7 caracteres.
4. Esperado: "Use pelo menos 8 caracteres." no campo senha. Nenhuma conta nova entra no Resumo.
5. Abrir `/esqueci-senha`, enviar `nao-existe@example.com`.
6. Esperado: "Enviamos o link para nao-existe@example.com. Confira também o spam." e "O link vale por 30 minutos. Se não chegar, você pode pedir outro." A página não diz que o e-mail não tem conta.

## 3. Sessão vencida e Sair

1. Com a conta demo aberta, cancelar Sair da conta.
2. Esperado: a sessão continua.
3. Abrir `/login?sessao=expirada` numa janela sem sessão.
4. Esperado: o aviso "Sua sessão expirou. Entre de novo para continuar. Nada do que você digitou foi perdido." O campo senha está vazio.
5. Abrir `/login` de novo, sem a query.
6. Esperado: o aviso não está.
