# INV · Área do investidor e catálogo

> **Implementar apenas:** INV 01, 02, 03, 05, 06
> Os demais casos desta área já têm spec. Massa mínima, convenções e prioridades: seções 2 e 15 de `docs-test/Plano_de_Testes_QA_MatchWallet.md`.
> Cada `it` deve levar o ID do caso no título (ex.: `VER 03 · publicação válida`). Casos que dependem do estado do backend (concorrência, download, exportação, exclusão) vão em `cypress/e2e/real/`; o restante em `cypress/e2e/stubbed/`.

## 10. Área do investidor e catálogo (INV)

### INV 01 · P1 · Cliente sem avaliação

- **Pré-condição:** CLI-N.
- **Passos:**
  1. Abrir painel, minha carteira e conta.
  2. Conferir CTAs de avaliação e indicadores.
- **Esperado:** instrução para avaliar, nenhuma carteira fictícia, indicadores ausentes mostrados como sem dado e nunca como retorno zero; rotas dos CTAs levam à avaliação.
- **Resultado:** Não executado
- **Evidência ou defeito:** _ID, link ou observação_

### INV 02 · P0 · Painel com dados

- **Pré-condição:** cliente com carteira, versão e retornos em M.
- **Passos:**
  1. Conferir rentabilidade do mês, acumulado do ano, % do CDI no ano e ativos.
  2. Abrir Sua carteira e Ver detalhes.
- **Esperado:** todos correspondem ao vínculo e competência do cliente; valores reconciliados com massa administrativa; links abrem seus detalhes.
- **Resultado:** Não executado
- **Evidência ou defeito:** _ID, link ou observação_

### INV 03 · P1 · Catálogo e filtros

- **Pré-condição:** carteiras ativas de vários perfis.
- **Passos:**
  1. Abrir `/carteiras`.
  2. Selecionar cada perfil e TODOS OS PERFIS.
  3. Testar perfil sem carteira, se o filtro existir.
- **Esperado:** resultados compatíveis, filtro selecionado identificado, cartões com nome, perfil, descrição e ativos corretos; ausência de carteira sofisticada não é por si só um defeito.
- **Resultado:** Não executado
- **Evidência ou defeito:** _ID, link ou observação_

### INV 04 · P0 · Consulta sem mudar vínculo

- **Pré-condição:** CLI-A vinculado à carteira A; carteira B disponível no catálogo.
- **Passos:**
  1. Abrir Ver composição de B.
  2. Fechar e conferir conta, painel e minha carteira.
- **Esperado:** consulta não altera avaliação, recomendação nem vínculo de A; detalhes de B correspondem ao cartão selecionado.
- **Resultado:** Não executado
- **Evidência ou defeito:** _ID, link ou observação_

### INV 05 · P1 · Composição e aviso legal

- **Pré-condição:** uma carteira publicada e uma sem versão.
- **Passos:**
  1. Abrir ambas no catálogo.
  2. Conferir ativos/pesos e mensagem vazia.
  3. Conferir descrição, aviso legal e Refazer avaliação de perfil.
- **Esperado:** conteúdo correto, aviso legível e link funcional; nada do rascunho exposto; fechar modal devolve foco ao cartão.
- **Resultado:** Não executado
- **Evidência ou defeito:** _ID, link ou observação_

### INV 06 · P0 · Gestão do vínculo

- **Pré-condição:** fluxo da equipe identificado e carteiras A/B.
- **Passos:**
  1. Vincular CLI-A à carteira A pelo fluxo autorizado.
  2. Trocar para B com datas conhecidas.
  3. Conferir painel, conta, carteira e relatórios.
  4. Tentar alterar vínculo como cliente via API.
- **Esperado:** transição autorizada, rastreável e coerente; cliente não define vínculo indevidamente; histórico segue períodos corretos.
- **Resultado:** Não executado
- **Evidência ou defeito:** _ID, link ou observação_

---

