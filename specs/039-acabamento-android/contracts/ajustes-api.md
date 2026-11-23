# Contract: API que o Ajustes do Android passa a usar

Sessão igual à das rotas `/api/v1` já existentes. Sem sessão: 401. O site não muda de tela. Estas rotas existem para o app repetir o fluxo.

## Simular competência

`POST /api/v1/competencia/simular`

Pedido:

```json
{ "data": "2026-05-26", "parcelas": 3, "diaFechamento": 2 }
```

`diaFechamento` pode ser `null`. `parcelas` entra como inteiro de 1 a 60. Fora disso, a rota limita a esse intervalo, como o site.

Resposta 200:

```json
{ "primeira": "2026-06", "parcelas": ["2026-06", "2026-07", "2026-08"] }
```

Data ilegível: 400, e nada é gravado. A lista vem de `competenciasParcelas` no domínio.

## Itens arquivados

`GET /api/v1/itens?escopo=arquivados`

Resposta 200:

```json
{ "itens": [{ "id": "…", "tipo": "F", "grupo": "Moradia", "nome": "Aluguel" }] }
```

Sem `escopo`, ou com outro valor, a resposta continua a lista ativa de hoje. Arquivado não volta para a lista ativa por esta rota.

## Dados de exemplo

`POST /api/v1/catalogo/exemplo`

Pedido vazio. Resposta 200:

```json
{ "ok": true, "updated": 12 }
```

Chama `applyExamplePlans`. Não cria lançamento. O app só envia depois do segundo toque de confirmação.

## Excluir conta

`DELETE /api/v1/conta` já existe.

Pedido: `{ "confirmPhrase": "EXCLUIR" }`.

Frase diferente: 400, "Digite EXCLUIR para confirmar.", conta intacta.

Frase certa: 200 `{ "ok": true }`, conta removida e sessão encerrada. O app volta à entrada.
