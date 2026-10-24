# AUT · Autenticação

> **Implementar apenas:** AUT 07, AUT 08
> Os demais casos desta área já têm spec. Massa mínima, convenções e prioridades: seções 2 e 15 de `docs-test/Plano_de_Testes_QA_MatchWallet.md`.
> Cada `it` deve levar o ID do caso no título (ex.: `VER 03 · publicação válida`). Casos que dependem do estado do backend (concorrência, download, exportação, exclusão) vão em `cypress/e2e/real/`; o restante em `cypress/e2e/stubbed/`.

## 3. Autenticação e controle de acesso (AUT)

### AUT 01 · P0 · Login por papel

- **Pré-condição:** ADM-A e CLI-A ativos, com credenciais de teste.
- **Passos:**
  1. Abrir uma sessão limpa.
  2. Entrar como cliente e depois como administrador em sessões separadas.
  3. Abrir as áreas permitidas.
- **Esperado:** cada sessão identifica o usuário correto e expõe somente suas permissões; cliente não recebe funcionalidades administrativas. Registrar a rota e o formulário de login reais.
- **Resultado:** Não executado
- **Evidência ou defeito:** _ID, link ou observação_

### AUT 02 · P1 · Credenciais inválidas

- **Pré-condição:** formulário de login disponível.
- **Passos:**
  1. Tentar e-mail desconhecido.
  2. Tentar senha incorreta e campos vazios.
  3. Repetir conforme limite autorizado de homologação.
- **Esperado:** acesso negado, mensagem clara sem revelar existência da conta ou segredos; nenhuma sessão autenticada é criada. Validar a política de limitação de tentativas definida pelo produto.
- **Resultado:** Não executado
- **Evidência ou defeito:** _ID, link ou observação_

### AUT 03 · P0 · Rotas administrativas por cliente

- **Pré-condição:** CLI-A autenticado.
- **Passos:**
  1. Abrir diretamente `/admin`, `/admin/usuarios`, `/admin/carteiras` e `/admin/configuracoes`.
  2. Tentar uma leitura e uma mutação administrativas pela API usada pela aplicação.
- **Esperado:** autorização negada no servidor; ocultar menu sozinho não é suficiente; nenhum dado administrativo é retornado ou alterado.
- **Resultado:** Não executado
- **Evidência ou defeito:** _ID, link ou observação_

### AUT 04 · P0 · Sessão encerrada e expirada

- **Pré-condição:** usuário autenticado; prazo de expiração confirmado.
- **Passos:**
  1. Sair pelo menu do usuário.
  2. Voltar pelo histórico e abrir rota protegida.
  3. Repetir após expiração em outra sessão.
- **Esperado:** telas e API exigem autenticação; dados privados não reaparecem via navegação ou cache; ação pendente não é executada após perda da sessão.
- **Resultado:** Não executado
- **Evidência ou defeito:** _ID, link ou observação_

### AUT 05 · P0 · Usuário inativo

- **Pré-condição:** CLI-I inativo e uma sessão ativa desse cliente antes da inativação.
- **Passos:**
  1. Tentar novo login.
  2. Usar a sessão anterior para ler e alterar dados.
- **Esperado:** comportamento segue política aprovada de revogação; usuário inativo não mantém acesso indevido. Verificar servidor, não apenas tela.
- **Resultado:** Não executado
- **Evidência ou defeito:** _ID, link ou observação_

### AUT 06 · P0 · Isolamento entre clientes

- **Pré-condição:** CLI-A e CLI-B têm contas e relatórios distintos.
- **Passos:**
  1. Como CLI-A, substituir identificadores de conta, vínculo, histórico, relatório e arquivo pelos de CLI-B nas requisições da aplicação.
  2. Repetir leituras e alterações permitidas ao cliente.
- **Esperado:** nenhuma informação ou alteração de CLI-B é acessível; recursos públicos do catálogo permanecem limitados ao conteúdo público autorizado.
- **Resultado:** Não executado
- **Evidência ou defeito:** _ID, link ou observação_

### AUT 07 · P1 · Primeiro acesso e termos

- **Pré-condição:** CLI-T recém-criado.
- **Passos:**
  1. Entrar pela primeira vez.
  2. Tentar continuar sem aceite e acessar rotas diretamente.
  3. Aceitar os termos na conta de teste.
  4. Entrar novamente.
- **Esperado:** obrigatoriedade, versão e data do aceite seguem a política; consentimento de marketing é tratado separadamente; não há bypass por URL. Não aplicar o aceite em conta real.
- **Resultado:** Não executado
- **Evidência ou defeito:** _ID, link ou observação_

### AUT 08 · P1 · Recuperação de senha quando disponível

- **Pré-condição:** recurso disponível e caixa de e-mail de teste.
- **Passos:**
  1. Solicitar recuperação.
  2. Usar link válido, expirado e já utilizado.
  3. Testar conta desconhecida.
- **Esperado:** somente o titular troca a senha; token expira e não é reutilizado; respostas não expõem cadastros. Se não houver recurso, registrar **Não aplicável**.
- **Resultado:** Não executado
- **Evidência ou defeito:** _ID, link ou observação_

---

