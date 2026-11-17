# Data model: Lançamentos no Android

O lançamento persistido não muda. A tela só preenche o corpo que a API já aceita.

| Campo enviado | Regra |
|---------------|--------|
| itemId | Item ativo |
| valorCentavos | Inteiro maior que zero, vindo do texto em reais |
| dataISO | Data escolhida |
| pagamento | deb, pix, din ou id de cartão ativo |
| parcelas | Só quando o computador também parcelaria |
| scope | Só na edição ou exclusão de parcelado, com as mesmas opções do computador |

Estado local: lista do mês, formulário aberto ou fechado, erro de valor. Nenhum lançamento fica pela metade no aparelho.
