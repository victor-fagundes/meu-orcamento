# Spec: 026 — Link para redefinir a senha (MO-101)

**Status:** `draft`  
**Release:** A  
**Sprint:** —  
**Histórias:** MO-101  
**PRD:** 5.11

## Context

A spec 001 aceitou a recuperação como stub: o link cai no terminal. A spec 024, em produção, proíbe gravar esse link e manda a tela dizer que o envio ainda não existe. O app já está no ar. Quem esquece a senha no celular não tem o terminal.

Esta história é o envio que a 024 deixou para depois. O e-mail leva um link para escolher outra senha. A senha atual e a senha nova não aparecem na mensagem. O fornecedor é o Brevo no plano gratuito (300 envios por dia, sem cartão e sem domínio próprio). O detalhe está em `design.md`.

Enquanto não houver credencial de envio, o comportamento da 024 permanece: em produção a tela avisa que o link não sai, e o servidor não grava a URL.

## Goals

1. Com o envio configurado, pedir reset em Esqueci a senha dispara um e-mail com um link, quando a conta existe.
2. A tela mostra a mesma frase se a conta existe ou não.
3. O link abre uma página para gravar a nova senha. A senha antiga deixa de entrar. Os lançamentos não mudam.
4. Sem credencial de envio, produção continua na regra da 024. No ambiente local, o link pode seguir no terminal.

## Non-goals

- Colocar a senha, antiga ou nova, no e-mail ou no log.
- Alerta de orçamento, newsletter ou qualquer outro e-mail.
- Entrar com Google, editar nome ou trocar o e-mail da conta.
- Trocar a senha estando logado, sem passar pelo link.
- Magic link no lugar da senha.

## Domain rules

| Caso | Entrada | Resultado |
|---|---|---|
| Conta existente, envio configurado | E-mail da conta | Parte um e-mail. O corpo tem o link e não tem senha |
| Conta inexistente | E-mail que não está cadastrado | A mesma frase de confirmação. Nenhum e-mail |
| Sem credencial, produção | Qualquer e-mail | A frase da spec 024. A URL não vai para log |
| Sem credencial, local | Conta existente | O link pode aparecer no terminal. A senha não |
| Link válido | Aberto dentro de 60 minutos, ainda não usado | Página para a nova senha |
| Link vencido ou já usado | Depois de 60 minutos, ou depois de um reset concluído | Mensagem de link inválido e volta para Esqueci a senha |
| Link mais novo | Segundo pedido para a mesma conta | O link anterior deixa de valer |
| Senha curta | Menos de 8 caracteres | Recusa. O link continua válido |
| Confirmação diferente | Os dois campos não coincidem | Recusa. O link continua válido |
| Senha aceita | 8 caracteres ou mais, campos iguais | A senha nova entra. A antiga não. O orçamento permanece |
| Log | Qualquer ambiente | Senha e URL completa do reset não são gravadas quando o e-mail sai |
| Falha do Brevo | Conta existente e a API recusa ou não responde | A tela diz que o envio falhou e pede para tentar de novo. Não afirma que o link saiu |

A frase única, com ou sem conta, é: “Se este e-mail tiver conta, enviamos o link para redefinir a senha.”

O assunto do e-mail é “Redefinir senha do Meu Orçamento”. O remetente visível é Meu Orçamento. O texto tem uma frase e o link. O link abre a página de nova senha desta aplicação, em HTTPS em produção (`BETTER_AUTH_URL`).

## Acceptance criteria

- [ ] AC-026.1 Com envio configurado e conta existente, o pedido gera um e-mail cujo corpo contém o link e não contém a senha.
- [ ] AC-026.2 E-mail sem conta mostra a mesma frase e não envia mensagem.
- [ ] AC-026.3 Sem credencial, produção mantém o aviso da spec 024 e não grava o link.
- [ ] AC-026.4 O link abre a página de nova senha. Senha com menos de 8 caracteres, ou campos diferentes, não troca a senha e não queima o link.
- [ ] AC-026.5 Senha nova aceita entra no login. A senha anterior falha. Itens e lançamentos continuam iguais.
- [ ] AC-026.6 Link com mais de 60 minutos, link já usado, ou link anterior a um pedido mais novo, não troca a senha.
- [ ] AC-026.7 Se o Brevo recusar o envio de uma conta existente, a tela avisa a falha e não usa a frase de “enviamos o link”.

## Test plan

Unit: o texto do e-mail (assunto, corpo, ausência de senha) numa função pura, com o link injetado.  
O adaptador de envio entra por uma função que os testes substituem: grava destinatário e URL, não chama a rede.  
E2E: não nesta história. A prova manual é pedir o reset na conta real, abrir o link, entrar com a senha nova e falhar com a antiga.

## Open questions

Nenhuma. O fornecedor é o Brevo, plano Free, decidido em 17/11/2026. Resend ficou de fora: no gratuito só alcança qualquer destinatário depois de um domínio verificado, e domínio próprio continua fora (spec 024).

## Design técnico

`specs/026-reset-por-email/design.md`. A spec segue `draft` até o PM marcar `ready`.
