# Quickstart: Trazer e levar dados no Android

```text
npx vitest run src/domain/navegacao-mes.test.ts
```

A spec precisa estar `ready`. A entrada está em Ajustes, spec 035.

1. Importar no aparelho uma planilha já aceita no computador. Os centavos coincidem.
2. Cancelar a prévia. A conta no computador permanece igual.
3. Confirmar lançamentos abre o mês que o computador abriria para o mesmo arquivo.
4. Um PDF recusado no computador é recusado no aparelho, sem lançamento novo.
5. Exportar no aparelho e no computador produz os mesmos valores.
6. Interromper a exportação não oferece um arquivo como se estivesse completo.
