# Design: 026 — Envio do link pelo Brevo

**Spec:** `specs/026-reset-por-email/spec.md`  
**Status da spec:** `draft`

## Decisão

O envio usa o **Brevo**, plano Free.

- US$ 0, sem cartão, sem prazo de trial.
- 300 e-mails por dia. Reset de senha de uma conta cabe nesse teto. Ao passar, a API falha e vale o AC-026.7. Não há fila nossa.
- O remetente é um e-mail verificado no painel do Brevo (o código chega nesse endereço). Não exige domínio próprio. O app publicado está em `https://meu-orcamento-victor.vercel.app` (spec 024) e não tem DNS de envio.
- O nome visível é Meu Orçamento. O endereço From é o remetente verificado, não um `@vercel.app`.

Resend não entra. O plano Free exige domínio verificado para entregar fora da caixa do próprio dono da conta Resend. Comprar domínio foge do “tem que ser free” e da spec 024.

Gmail ou Yahoo como From não autenticam DKIM. O link pode cair no spam. É o custo de não ter domínio. Não há segundo fornecedor nesta história.

## Contrato com o Brevo

`POST https://api.brevo.com/v3/smtp/email`

Cabeçalho `api-key`: valor de `BREVO_API_KEY`.  
Cabeçalho `accept` e `content-type`: `application/json`.

Corpo, só o necessário:

- `sender.email`: `BREVO_SENDER_EMAIL`
- `sender.name`: `Meu Orçamento`
- `to`: um destinatário, o e-mail da conta. Não cria contato no Brevo.
- `subject`: o assunto da spec
- `textContent`: o texto da spec, com o link absoluto
- `htmlContent`: o mesmo texto, com o link em `<a href>`

Sem template do painel, sem anexo, sem cópia oculta.

A chamada só acontece quando a conta existe e as duas variáveis estão preenchidas. E-mail sem conta não chama o Brevo (AC-026.2).

Sucesso: HTTP 201. Qualquer outro resultado, timeout ou rede é falha (AC-026.7).

## Ambientes

| Ambiente | `BREVO_API_KEY` e `BREVO_SENDER_EMAIL` | Comportamento |
|---|---|---|
| Produção | As duas presentes | Envia. Não grava URL nem senha |
| Produção | Uma ausente ou vazia | Frase da spec 024. Não chama o Brevo |
| Local | Ausentes | Link no terminal, como hoje. Senha fora do log |
| Teste | Substituído | O teste grava destinatário e URL. Não há rede |

As chaves ficam na Vercel, em Production. Não entram no repositório nem no log.

## Código

- Texto do e-mail: função pura em `src/domain`, sem `fetch` e sem Better Auth. Os testes da spec cobrem assunto, link e ausência de senha.
- `sendResetPassword` em `src/lib/auth.ts` chama o adaptador. O adaptador é a única peça que conhece a URL do Brevo.
- A página Esqueci a senha distingue três respostas: frase única, falha de envio, aviso da 024.
- A página de nova senha é rota desta aplicação. O `redirectTo` do pedido deixa de ser `/login`.
- O prazo de 60 minutos e a invalidação do link anterior são configuração do Better Auth, não do Brevo.

## Fora deste desenho

Google, alerta de orçamento, troca de senha logado, domínio e DKIM.
