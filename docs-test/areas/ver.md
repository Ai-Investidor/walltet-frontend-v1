# VER · Composição e versões

> **Implementar apenas:** VER 01–08
> Os demais casos desta área já têm spec. Massa mínima, convenções e prioridades: seções 2 e 15 de `docs-test/Plano_de_Testes_QA_MatchWallet.md`.
> Cada `it` deve levar o ID do caso no título (ex.: `VER 03 · publicação válida`). Casos que dependem do estado do backend (concorrência, download, exportação, exclusão) vão em `cypress/e2e/real/`; o restante em `cypress/e2e/stubbed/`.

## 6. Composição e versões (VER)

> ⚠️ Os casos VER dependem da identificação do **fluxo autorizado de autoria/publicação**. A tela observada exibiu consultas de composição e versões, mas não mostrou esses controles no estado sem versão.

### VER 01 · P0 · Criação de rascunho

- **Pré-condição:** fluxo de autoria identificado; ADM-A.
- **Passos:**
  1. Criar versão para M com ativos e pesos de referência.
  2. Salvar rascunho.
  3. Consultar como cliente.
- **Esperado:** rascunho persistido, identificado por carteira/competência e invisível ao investidor até publicação.
- **Resultado:** Não executado
- **Evidência ou defeito:** _ID, link ou observação_

### VER 02 · P0 · Validações de ativos e pesos

- **Pré-condição:** regra de composição aprovada.
- **Passos:**
  1. Testar ativo duplicado, código vazio, peso negativo, zero e acima do limite.
  2. Testar soma abaixo/acima de 100% e soma exatamente 100%, se essa for a regra.
  3. Testar frações que somam 100% com arredondamento.
- **Esperado:** composição inválida não é publicada; precisão e soma seguem regra explícita no servidor.
- **Resultado:** Não executado
- **Evidência ou defeito:** _ID, link ou observação_

### VER 03 · P0 · Publicação válida

- **Pré-condição:** rascunho válido para M.
- **Passos:**
  1. Publicar pelo fluxo autorizado.
  2. Conferir Versões, Composição, lista e catálogo.
  3. Abrir como cliente vinculado.
- **Esperado:** mesma composição e competência em todas as áreas; status e data de publicação presentes; contagem de ativos e indicadores atualizados.
- **Resultado:** Não executado
- **Evidência ou defeito:** _ID, link ou observação_

### VER 04 · P0 · Competência inválida e duplicada

- **Pré-condição:** uma versão já publicada em M.
- **Passos:**
  1. Testar formato inválido, mês 00/13 e competência vazia.
  2. Criar/publicar outra versão para M.
- **Esperado:** validação da competência e regra de unicidade/substituição aplicadas; não há duas versões vigentes contraditórias. Confirmar regra de revisão antes de aprovar.
- **Resultado:** Não executado
- **Evidência ou defeito:** _ID, link ou observação_

### VER 05 · P0 · Histórico e versão vigente

- **Pré-condição:** versões distintas em M-1 e M.
- **Passos:**
  1. Conferir competência, status, ativos e Publicada em.
  2. Consultar composição vigente e relatório de M-1.
- **Esperado:** vigente segue a regra temporal acordada; histórico preserva ativos e valores da época, sem usar retrospectivamente a composição atual.
- **Resultado:** Não executado
- **Evidência ou defeito:** _ID, link ou observação_

### VER 06 · P0 · Edição após publicação

- **Pré-condição:** versão publicada com relatório emitido.
- **Passos:**
  1. Tentar editar e remover ativos.
  2. Se suportado, executar revisão pelo processo autorizado.
  3. Conferir histórico e relatórios anteriores.
- **Esperado:** imutabilidade ou revisão auditável conforme regra; nenhuma alteração silenciosa de documentos já publicados.
- **Resultado:** Não executado
- **Evidência ou defeito:** _ID, link ou observação_

### VER 07 · P0 · Concorrência de publicação

- **Pré-condição:** ADM-A e ADM-B editam a mesma carteira/competência.
- **Passos:**
  1. Abrir o mesmo rascunho.
  2. Alterar dados diferentes.
  3. Salvar/publicar quase simultaneamente e repetir uma requisição.
- **Esperado:** conflito tratado, uma versão vigente coerente, sem perda silenciosa nem publicação duplicada; usuário sabe qual alteração prevaleceu.
- **Resultado:** Não executado
- **Evidência ou defeito:** _ID, link ou observação_

### VER 08 · P1 · Movimentações mensais

- **Pré-condição:** M-1 e M com inclusão, retirada e mudança de peso de ativos.
- **Passos:**
  1. Publicar M.
  2. Conferir Movimentações do mês no painel, detalhes e relatório.
- **Esperado:** diferenças correspondem às duas versões da mesma carteira; sinais e percentuais corretos; primeira versão e mês sem alteração têm comportamento definido.
- **Resultado:** Não executado
- **Evidência ou defeito:** _ID, link ou observação_

---

