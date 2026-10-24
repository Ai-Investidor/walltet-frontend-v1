# QUA · Robustez e qualidade transversal

> **Implementar apenas:** QUA 01, 03, 04, 05, 06, 07 (responsividade, acessibilidade, temas e performance cobrem mal no Cypress: faça só o que for viável)
> Os demais casos desta área já têm spec. Massa mínima, convenções e prioridades: seções 2 e 15 de `docs-test/Plano_de_Testes_QA_MatchWallet.md`.
> Cada `it` deve levar o ID do caso no título (ex.: `VER 03 · publicação válida`). Casos que dependem do estado do backend (concorrência, download, exportação, exclusão) vão em `cypress/e2e/real/`; o restante em `cypress/e2e/stubbed/`.

## 13. Robustez e qualidade transversal (QUA)

### QUA 01 · P1 · Falhas de rede e servidor

- **Pré-condição:** homologação com controle de falhas.
- **Passos:**
  1. Simular offline, timeout e respostas 4xx/5xx em listagem, cadastro, lançamento e relatório.
  2. Restabelecer rede e tentar novamente após conferir persistência.
- **Esperado:** carregamento termina, mensagem útil, nenhum falso sucesso ou gravação duplicada; dados preenchidos recuperáveis conforme regra.
- **Resultado:** Não executado
- **Evidência ou defeito:** _ID, link ou observação_

### QUA 02 · P0 · Conteúdo e entradas hostis

- **Pré-condição:** conta de QA e testes de segurança autorizados.
- **Passos:**
  1. Inserir marcação/script inofensivo em nomes, descrição e comentário.
  2. Consultar telas e relatório.
  3. Testar caracteres de consulta em buscas e validações.
- **Esperado:** conteúdo tratado como dado, sem execução ou mudança de consulta; erros não expõem pilhas, chaves ou detalhes internos. Isso não substitui auditoria de segurança.
- **Resultado:** Não executado
- **Evidência ou defeito:** _ID, link ou observação_

### QUA 03 · P1 · Responsividade

- **Pré-condição:** navegadores de suporte definidos.
- **Passos:**
  1. Executar fluxos principais em larguras 360, 768 e 1366 px.
  2. Abrir menu, modais, abas, tabela e formulário com teclado virtual.
  3. Usar zoom de 200%.
- **Esperado:** campos e ações alcançáveis; sem sobreposição, corte de texto ou perda de botões; tabelas preservam leitura, com rolagem quando necessária.
- **Resultado:** Não executado
- **Evidência ou defeito:** _ID, link ou observação_

### QUA 04 · P1 · Acessibilidade

- **Pré-condição:** teclado e leitor de tela.
- **Passos:**
  1. Navegar sem mouse.
  2. Abrir/fechar modais e alternar abas.
  3. Ler radios, progresso e erros.
  4. Conferir contraste nos dois temas.
- **Esperado:** foco visível, sequência lógica, rótulos e erros associados, modal mantém foco e o devolve ao fechar; informações não dependem apenas de cor.
- **Resultado:** Não executado
- **Evidência ou defeito:** _ID, link ou observação_

### QUA 05 · P2 · Temas e navegadores

- **Pré-condição:** matriz de suporte aprovada.
- **Passos:**
  1. Alternar claro/escuro em conta de teste.
  2. Recarregar e navegar.
  3. Executar smoke em Chrome e demais navegadores suportados, registrando versões.
- **Esperado:** textos e gráficos legíveis, preferência persistida conforme regra e comportamento funcional equivalente.
- **Resultado:** Não executado
- **Evidência ou defeito:** _ID, link ou observação_

### QUA 06 · P1 · Volume e tempo de resposta

- **Pré-condição:** massa/volume e metas acordados, ambiente autorizado.
- **Passos:**
  1. Medir abertura do painel, busca/paginação e leitura de carteiras.
  2. Medir geração/exportação separadamente.
  3. Repetir sob concorrência prevista.
- **Esperado:** cumpre metas de resposta e capacidade aprovadas; sem timeout recorrente ou travamento. Registrar tempos medidos; não aprovar sem metas definidas.
- **Resultado:** Não executado
- **Evidência ou defeito:** _ID, link ou observação_

### QUA 07 · P1 · Rastreabilidade e mensagens

- **Pré-condição:** logs de homologação disponíveis à equipe autorizada.
- **Passos:**
  1. Criar usuário, mudar papel, publicar versão, alterar parâmetros e gerar relatório.
  2. Conferir trilha por ator, data, entidade e versão.
  3. Revisar mensagens e dados enviados ao navegador.
- **Esperado:** ações sensíveis rastreáveis sem registrar senha/token; mensagens e respostas não vazam dados privados.
- **Resultado:** Não executado
- **Evidência ou defeito:** _ID, link ou observação_

---

