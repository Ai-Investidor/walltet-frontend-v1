# USU · Usuários administrativos

> **Implementar apenas:** USU 01–07
> Os demais casos desta área já têm spec. Massa mínima, convenções e prioridades: seções 2 e 15 de `docs-test/Plano_de_Testes_QA_MatchWallet.md`.
> Cada `it` deve levar o ID do caso no título (ex.: `VER 03 · publicação válida`). Casos que dependem do estado do backend (concorrência, download, exportação, exclusão) vão em `cypress/e2e/real/`; o restante em `cypress/e2e/stubbed/`.

## 4. Usuários administrativos (USU)

### USU 01 · P1 · Listagem e paginação

- **Pré-condição:** massa com mais de uma página.
- **Passos:**
  1. Abrir `/admin/usuarios`.
  2. Conferir nome, e-mail, papel, status e data.
  3. Percorrer Anterior e Próxima até os limites.
- **Esperado:** total e página coerentes, sem duplicação ou omissão; botões desabilitados no início/fim; seleção abre o usuário correspondente.
- **Resultado:** Não executado
- **Evidência ou defeito:** _ID, link ou observação_

### USU 02 · P1 · Busca

- **Pré-condição:** nomes com acento e e-mails controlados.
- **Passos:**
  1. Buscar nome completo, trecho, e-mail e valor inexistente.
  2. Alterar maiúsculas, minúsculas e espaços nas bordas.
  3. Limpar a busca após estar em página posterior.
- **Esperado:** filtro segue regra definida, estado vazio claro, total/paginação refletem o filtro e lista integral volta ao limpar.
- **Resultado:** Não executado
- **Evidência ou defeito:** _ID, link ou observação_

### USU 03 · P1 · Cadastro de cliente

- **Pré-condição:** ADM-A e e-mail novo de teste.
- **Passos:**
  1. Abrir Novo usuário.
  2. Preencher nome, e-mail e senha válida.
  3. Manter permissão Cliente e cadastrar.
  4. Reabrir a lista e autenticar com o novo usuário.
- **Esperado:** um cadastro persistido, papel correto e fluxo de primeiro acesso exigido; senha não aparece na listagem ou detalhe.
- **Resultado:** Não executado
- **Evidência ou defeito:** _ID, link ou observação_

### USU 04 · P0 · Cadastro de administrador

- **Pré-condição:** homologação autorizada e conta descartável.
- **Passos:**
  1. Cadastrar com permissão Administrador.
  2. Conferir papel após recarregar.
  3. Autenticar e abrir administração.
- **Esperado:** somente administrador autorizado concede esse papel; permissões persistem e API aplica a mesma regra.
- **Resultado:** Não executado
- **Evidência ou defeito:** _ID, link ou observação_

### USU 05 · P1 · Validação de senha inicial

- **Pré-condição:** Novo usuário aberto.
- **Passos:**
  1. Testar sete caracteres com número/símbolo.
  2. Testar oito sem número.
  3. Oito sem símbolo.
  4. Oito com número e símbolo.
- **Esperado:** três primeiros rejeitados e quarto aceito se demais campos válidos; critério é aplicado no servidor e exibido sem expor a senha.
- **Resultado:** Não executado
- **Evidência ou defeito:** _ID, link ou observação_

### USU 06 · P1 · Campos inválidos e duplicidade

- **Pré-condição:** um e-mail já cadastrado.
- **Passos:**
  1. Enviar campos vazios e nome apenas com espaços.
  2. Testar e-mail malformado.
  3. Repetir e-mail existente com variação de caixa/espaços.
  4. Testar limites de tamanho acordados.
- **Esperado:** validações claras, sem cadastro parcial; normalização e unicidade consistentes no servidor.
- **Resultado:** Não executado
- **Evidência ou defeito:** _ID, link ou observação_

### USU 07 · P1 · Cancelamento e duplo envio

- **Pré-condição:** cadastro com dados de teste.
- **Passos:**
  1. Cancelar, fechar e reabrir.
  2. Em nova execução, submeter duas vezes rapidamente ou repetir após timeout.
- **Esperado:** cancelamento não salva; não surgem usuários duplicados; estado de processamento evita envios concorrentes e informa conclusão.
- **Resultado:** Não executado
- **Evidência ou defeito:** _ID, link ou observação_

### USU 08 · P0 · Alteração de papel

- **Pré-condição:** ADM-A altera apenas conta descartável.
- **Passos:**
  1. Abrir detalhe e mudar Cliente para Admin pelo controle Papel.
  2. Salvar e recarregar.
  3. Reverter e testar sessão já aberta do usuário.
- **Esperado:** mudança autorizada, persistida e efetiva conforme política de atualização da sessão; cliente não pode alterar o próprio papel pela API.
- **Resultado:** Não executado
- **Evidência ou defeito:** _ID, link ou observação_

### USU 09 · P0 · Proteção da administração

- **Pré-condição:** base isolada com ADM-U como último administrador.
- **Passos:**
  1. Tentar retirar seu papel e inativá-lo.
  2. Testar a mesma operação com outro administrador existente.
- **Esperado:** regra aprovada evita perda acidental de toda administração ou define recuperação segura; sem regra definida, manter caso **Bloqueado**. **Não executar na base em uso.**
- **Resultado:** Não executado
- **Evidência ou defeito:** _ID, link ou observação_

### USU 10 · P1 · Inativação e histórico de suitability

- **Pré-condição:** cliente descartável com duas avaliações.
- **Passos:**
  1. Abrir detalhe e conferir histórico.
  2. Inativar pelo fluxo da tela.
  3. Reabrir listagem e detalhe.
- **Esperado:** status atualizado; histórico permanece associado ao cliente correto, com ordenação e versões coerentes; avaliações antigas não mudam com novas faixas. Reativação, se disponível, deve ser testada separadamente.
- **Resultado:** Não executado
- **Evidência ou defeito:** _ID, link ou observação_

---

