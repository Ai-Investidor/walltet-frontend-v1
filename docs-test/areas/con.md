# CON · Conta e privacidade

> **Implementar apenas:** CON 01–06
> Os demais casos desta área já têm spec. Massa mínima, convenções e prioridades: seções 2 e 15 de `docs-test/Plano_de_Testes_QA_MatchWallet.md`.
> Cada `it` deve levar o ID do caso no título (ex.: `VER 03 · publicação válida`). Casos que dependem do estado do backend (concorrência, download, exportação, exclusão) vão em `cypress/e2e/real/`; o restante em `cypress/e2e/stubbed/`.

## 11. Conta e privacidade (CON)

### CON 01 · P1 · Edição de nome e e-mail

- **Pré-condição:** cliente de teste com caixa de e-mail controlada.
- **Passos:**
  1. Abrir Editar dados da conta.
  2. Alterar nome/e-mail e salvar.
  3. Recarregar e entrar novamente conforme política de confirmação de e-mail.
- **Esperado:** alteração persistida e associada ao mesmo usuário; nenhum novo cadastro; próxima autenticação usa regra aprovada para o novo e-mail.
- **Resultado:** Não executado
- **Evidência ou defeito:** _ID, link ou observação_

### CON 02 · P1 · Validação e cancelamento

- **Pré-condição:** edição de conta aberta.
- **Passos:**
  1. Testar nome vazio/espaços e e-mail inválido/duplicado.
  2. Testar tamanho máximo e acentos.
  3. Alterar dados e cancelar/fechar.
- **Esperado:** validação no servidor, nenhuma sobrescrita de outro usuário; cancelamento mantém dados anteriores.
- **Resultado:** Não executado
- **Evidência ou defeito:** _ID, link ou observação_

### CON 03 · P0 · Consentimentos

- **Pré-condição:** contas com marketing aceito e recusado, e versões distintas de termos.
- **Passos:**
  1. Conferir Central de Privacidade.
  2. Comparar tipo, versão, decisão e data com registro de referência.
  3. Verificar novo aceite quando versão mudar, conforme política.
- **Esperado:** consentimentos independentes, históricos corretos e nenhum aceite deduzido por simples navegação.
- **Resultado:** Não executado
- **Evidência ou defeito:** _ID, link ou observação_

### CON 04 · P1 · Fuso e datas

- **Pré-condição:** consentimento registrado próximo à meia-noite UTC.
- **Passos:**
  1. Conferir data na conta em São Paulo.
  2. Comparar timestamp bruto e regra de exibição.
  3. Repetir em virada do mês e datas de publicação/cadastro.
- **Esperado:** fuso consistente e data não apresentada como evento futuro por conversão incorreta. Verificar a ocorrência observada de 8 de outubro contra data local de 7 de outubro.
- **Resultado:** Não executado
- **Evidência ou defeito:** _ID, link ou observação_

### CON 05 · P0 · Exportação de dados

- **Pré-condição:** conta de QA com avaliação, vínculo e consentimentos.
- **Passos:**
  1. Acionar Baixar meus dados.
  2. Abrir o arquivo e comparar dados do titular.
  3. Tentar exportar outro usuário por identificador.
- **Esperado:** arquivo íntegro e restrito ao titular; sem senhas, tokens ou dados de terceiros; falha de geração/download informada.
- **Resultado:** Não executado
- **Evidência ou defeito:** _ID, link ou observação_

### CON 06 · P0 · Solicitação de exclusão

- **Pré-condição:** conta descartável e política de exclusão/retenção aprovada.
- **Passos:**
  1. Abrir Solicitar exclusão da conta e conferir consequências.
  2. Cancelar e verificar manutenção da conta.
  3. Em conta reservada para exclusão, concluir pelo fluxo autorizado.
  4. Conferir status, acesso e processamento.
- **Esperado:** cancelamento não exclui; solicitação não é confundida com conclusão; retenção, prazo e revogação seguem a política; operação não afeta terceiros.
- **Resultado:** Não executado
- **Evidência ou defeito:** _ID, link ou observação_

### CON 07 · P0 · Segurança da conta

- **Pré-condição:** CLI-A e CLI-B.
- **Passos:**
  1. Manipular identificador ao salvar dados ou solicitar exportação/exclusão.
  2. Tentar alterar papel e carteira adicionando campos à requisição de perfil.
- **Esperado:** servidor aceita somente campos autorizados do titular e bloqueia alterações de terceiros e privilégios.
- **Resultado:** Não executado
- **Evidência ou defeito:** _ID, link ou observação_

---

