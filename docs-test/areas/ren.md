# REN · Rentabilidade e benchmarks

> **Implementar apenas:** REN 01, 02, 04, 05, 07, 08
> Os demais casos desta área já têm spec. Massa mínima, convenções e prioridades: seções 2 e 15 de `docs-test/Plano_de_Testes_QA_MatchWallet.md`.
> Cada `it` deve levar o ID do caso no título (ex.: `VER 03 · publicação válida`). Casos que dependem do estado do backend (concorrência, download, exportação, exclusão) vão em `cypress/e2e/real/`; o restante em `cypress/e2e/stubbed/`.

## 7. Rentabilidade e benchmarks (REN)

### REN 01 · P1 · Lançamento válido

- **Pré-condição:** carteira de teste sem lançamento em M.
- **Passos:**
  1. Em Rentabilidade, abrir Lançar rentabilidade.
  2. Informar M, carteira 1,50%, acumulado 6,25%, CDI 1,00% e Ibovespa -2,00%.
  3. Salvar e recarregar.
- **Esperado:** valores persistem na carteira e competência corretas; sinais e escala percentual preservados; não aparece 150% por erro de conversão.
- **Resultado:** Não executado
- **Evidência ou defeito:** _ID, link ou observação_

### REN 02 · P1 · Prévia do CDI

- **Pré-condição:** regra carteira/CDI aprovada.
- **Passos:**
  1. Informar carteira 1,50 e CDI 1,00.
  2. Observar prévia.
  3. Salvar e comparar à coluna % do CDI.
- **Esperado:** se a fórmula for `carteira ÷ CDI × 100`, ambos mostram 150%; arredondamento igual. Prévia vazia não deve ser interpretada como valor calculado.
- **Resultado:** Não executado
- **Evidência ou defeito:** _ID, link ou observação_

### REN 03 · P0 · CDI zero e valores ausentes

- **Pré-condição:** formulário aberto.
- **Passos:**
  1. Usar CDI 0 com carteira positiva e depois zero.
  2. Omitir CDI e demais campos individualmente.
- **Esperado:** nenhuma divisão por zero, `Infinity` ou `NaN`; ausência distinguida de zero; obrigatoriedade e resultado não calculável são claros.
- **Resultado:** Não executado
- **Evidência ou defeito:** _ID, link ou observação_

### REN 04 · P1 · Formato numérico

- **Pré-condição:** contrato de formato definido.
- **Passos:**
  1. Testar vírgula e ponto decimal, negativo, zero e casas decimais extras.
  2. Testar letras, espaços e valores fora dos limites acordados.
- **Esperado:** entrada aceita ou rejeitada com clareza; sem conversão silenciosa incorreta; precisão consistente na prévia, histórico e relatórios.
- **Resultado:** Não executado
- **Evidência ou defeito:** _ID, link ou observação_

### REN 05 · P1 · Competência e repetição

- **Pré-condição:** lançamento existente em M.
- **Passos:**
  1. Testar `AAAA-MM` inválido, mês 13 e vazio.
  2. Lançar novamente M.
  3. Duplo envio de outra competência.
- **Esperado:** regra de edição/duplicidade clara, nenhuma linha ambígua; validação no servidor; cancelamento não grava.
- **Resultado:** Não executado
- **Evidência ou defeito:** _ID, link ou observação_

### REN 06 · P0 · Acumulados e comparação no ano

- **Pré-condição:** dois meses de referência com carteira +2% e -1%; fórmula aprovada.
- **Passos:**
  1. Conferir origem do campo Acumulado no ano e cálculo exibido no painel.
  2. Se capitalizado, confrontar `(1,02 × 0,99 − 1) × 100 = 0,98%`.
  3. Conferir % do CDI no ano usando acumulados anuais correspondentes.
- **Esperado:** fórmula acordada, sem soma simples indevida nem mistura de percentual mensal com anual.
- **Resultado:** Não executado
- **Evidência ou defeito:** _ID, link ou observação_

### REN 07 · P1 · Consistência entre áreas

- **Pré-condição:** lançamento em M e cliente vinculado.
- **Passos:**
  1. Comparar histórico administrativo, painel, minha carteira e relatório.
  2. Abrir outra carteira com valores diferentes.
- **Esperado:** números e competência reconciliados; nenhum dado de outra carteira; referência do benchmark e casas decimais coerentes.
- **Resultado:** Não executado
- **Evidência ou defeito:** _ID, link ou observação_

### REN 08 · P1 · Virada de competência

- **Pré-condição:** dados em dezembro e janeiro.
- **Passos:**
  1. Conferir competência vigente com relógio controlado na homologação.
  2. Abrir mês sem lançamento.
  3. Conferir reinício do acumulado anual.
- **Esperado:** não exibir retorno antigo como sendo do mês atual; ausência explicitada; mudança do ano segue a regra aprovada.
- **Resultado:** Não executado
- **Evidência ou defeito:** _ID, link ou observação_

---

