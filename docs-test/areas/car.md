# CAR · Carteiras administrativas

> **Implementar apenas:** CAR 01, 02, 03, 05, 06, 07
> Os demais casos desta área já têm spec. Massa mínima, convenções e prioridades: seções 2 e 15 de `docs-test/Plano_de_Testes_QA_MatchWallet.md`.
> Cada `it` deve levar o ID do caso no título (ex.: `VER 03 · publicação válida`). Casos que dependem do estado do backend (concorrência, download, exportação, exclusão) vão em `cypress/e2e/real/`; o restante em `cypress/e2e/stubbed/`.

## 5. Carteiras administrativas (CAR)

### CAR 01 · P1 · Lista e abertura

- **Pré-condição:** carteiras de vários perfis.
- **Passos:**
  1. Abrir `/admin/carteiras`.
  2. Conferir nome, perfil-alvo e número de ativos.
  3. Abrir pelo nome e pelo botão da mesma linha.
- **Esperado:** ambos abrem a mesma carteira; contagem corresponde à versão vigente e não a rascunhos; estado de carregamento encerra corretamente.
- **Resultado:** Não executado
- **Evidência ou defeito:** _ID, link ou observação_

### CAR 02 · P1 · Nova carteira válida

- **Pré-condição:** ADM-A.
- **Passos:**
  1. Preencher Nome da carteira, Perfil-alvo e Descrição.
  2. Salvar.
  3. Recarregar e conferir no catálogo do investidor.
- **Esperado:** uma carteira persistida com os dados corretos; nome/perfil/descrição consistentes entre as áreas; nenhuma versão é inventada no cadastro.
- **Resultado:** Não executado
- **Evidência ou defeito:** _ID, link ou observação_

### CAR 03 · P1 · Validações de cadastro

- **Pré-condição:** formulário aberto.
- **Passos:**
  1. Omitir nome e perfil.
  2. Testar nome com espaços, acentos e tamanho máximo acordado.
  3. Deixar descrição vazia para identificar sua obrigatoriedade.
  4. Testar texto com marcação HTML.
- **Esperado:** campos obrigatórios respeitados, limites claros e texto tratado sem executar conteúdo; regra da descrição documentada.
- **Resultado:** Não executado
- **Evidência ou defeito:** _ID, link ou observação_

### CAR 04 · P0 · Múltiplas carteiras do mesmo perfil

- **Pré-condição:** regra de cardinalidade aprovada.
- **Passos:**
  1. Criar duas carteiras ativas com mesmo perfil.
  2. Conferir lista, catálogo e recomendação de um cliente desse perfil.
- **Esperado:** cadastro e catálogo seguem a mesma regra; escolha do vínculo é determinística ou realizada pela equipe, sem seleção arbitrária. Registrar divergência do texto “uma por perfil”.
- **Resultado:** Não executado
- **Evidência ou defeito:** _ID, link ou observação_

### CAR 05 · P1 · Cancelamento e repetição de envio

- **Pré-condição:** Nova carteira aberto.
- **Passos:**
  1. Preencher e cancelar/fechar.
  2. Reabrir.
  3. Salvar outra massa com duplo clique e retry após timeout.
- **Esperado:** nenhuma gravação ao cancelar; envio repetido não duplica o cadastro; erro não é apresentado como sucesso.
- **Resultado:** Não executado
- **Evidência ou defeito:** _ID, link ou observação_

### CAR 06 · P1 · Abas e identificação

- **Pré-condição:** carteira com versões e rentabilidade de referência.
- **Passos:**
  1. Alternar Composição, Versões, Rentabilidade e Relatórios.
  2. Voltar à lista e abrir outra carteira.
- **Esperado:** nome, perfil e status permanecem corretos; nenhuma aba mostra dados da carteira anterior; seleção e foco indicam a aba atual.
- **Resultado:** Não executado
- **Evidência ou defeito:** _ID, link ou observação_

### CAR 07 · P1 · Carteira sem versão

- **Pré-condição:** carteira cadastrada sem publicação.
- **Passos:**
  1. Abrir Composição e Versões.
  2. Abrir composição no catálogo.
- **Esperado:** mensagem explícita de ausência de versão, zero ativos na lista e nenhuma composição fictícia; usuário entende a indisponibilidade.
- **Resultado:** Não executado
- **Evidência ou defeito:** _ID, link ou observação_

---

