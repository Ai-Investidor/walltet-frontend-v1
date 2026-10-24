# Plano de Testes QA — MatchWallet AI Invest

> **Plano completo de execução QA.** Preencher build, ambiente, executor e evidências antes da rodada.

Documento de execução para validar os fluxos administrativos e do investidor, a consistência dos dados e os controles de acesso antes da liberação de uma versão. Execute primeiro os cenários **P0** e depois os **P1** e **P2**. Registre resultado, evidência e defeito para cada caso; este plano **não** representa uma certificação de funcionamento.

| Campo | Valor |
|---|---|
| Sistema analisado | https://matchwallet.aiinvest.com.br |
| Data da análise | 7 de outubro de 2026 (horário de São Paulo) |
| Versão do plano | 1.0 |
| Total de casos | 89 |
| Responsável pela execução | ____________________ |
| Build e ambiente | ____________________ |

---

## Sumário

1. [Escopo e evidências da análise](#1-escopo-e-evidências-da-análise)
2. [Preparação e critérios de execução](#2-preparação-e-critérios-de-execução)
3. [Autenticação e controle de acesso (AUT)](#3-autenticação-e-controle-de-acesso-aut)
4. [Usuários administrativos (USU)](#4-usuários-administrativos-usu)
5. [Carteiras administrativas (CAR)](#5-carteiras-administrativas-car)
6. [Composição e versões (VER)](#6-composição-e-versões-ver)
7. [Rentabilidade e benchmarks (REN)](#7-rentabilidade-e-benchmarks-ren)
8. [Relatórios mensais (REL)](#8-relatórios-mensais-rel)
9. [Suitability e parâmetros (SUI / PAR)](#9-suitability-e-parâmetros-sui--par)
10. [Área do investidor e catálogo (INV)](#10-área-do-investidor-e-catálogo-inv)
11. [Conta e privacidade (CON)](#11-conta-e-privacidade-con)
12. [Painel administrativo e fechamento (ADM)](#12-painel-administrativo-e-fechamento-adm)
13. [Robustez e qualidade transversal (QUA)](#13-robustez-e-qualidade-transversal-qua)
14. [Fluxos completos de aceitação (E2E)](#14-fluxos-completos-de-aceitação-e2e)
15. [Registro e decisão de liberação](#15-registro-e-decisão-de-liberação)
- [Anexo — Índice de casos](#anexo--índice-de-casos)

---

## 1. Escopo e evidências da análise

Foram inspecionadas as telas de:

- Painel administrativo
- Carteiras e suas quatro abas
- Cadastro de carteira
- Usuários e seus formulários
- Configurações de suitability
- Painel do investidor
- Minha carteira
- Catálogo de carteiras
- Relatórios
- Conta
- Privacidade
- Primeira etapa da avaliação de perfil

A sessão utilizada tinha papel de **administrador**.

### Estado observado

- Três carteiras ativas, todas **sem ativos** na versão vigente.
- Nenhuma versão publicada.
- Nenhum relatório na competência 2026-10.
- Nenhum investidor ativo.
- Lista de usuários com três administradores ativos.
- A conta consultada não tinha avaliação nem carteira vinculada.
- Nenhum cadastro, publicação, lançamento, alteração de permissão ou consentimento foi submetido durante a análise.

### Cobertura

| Tipo | Conteúdo |
|---|---|
| **Observada** | Telas, campos, textos, navegação e estados vazios |
| **Planejada** | Os testes deste documento, a executar pelo QA |

Login, aceite inicial, avaliação completa, dados publicados, download, exclusão e respostas das APIs precisam ser exercitados em homologação. **Não há resultados de aprovação desses fluxos nesta análise.**

### Regras explícitas nas telas

- Senha inicial com pelo menos **oito caracteres, um número e um símbolo**.
- Novo usuário deve **aceitar os termos** no primeiro acesso.
- **Mais de uma carteira ativa por perfil** é permitida no formulário de cadastro.
- Suitability usa escala de **0 a 60**, sem lacunas nem sobreposições; mudanças de parâmetros são versionadas e preservam o histórico.
- Faixas atuais:

  | Perfil | Faixa |
  |---|---|
  | Conservador | 0–17 |
  | Moderado | 18–32 |
  | Arrojado | 33–46 |
  | Sofisticado | 47–60 |

- Avaliação com **cinco perguntas**; a primeira tem três opções, teclas 1 a 3 e avanço automático.
- Relatório exige **versão publicada** para a competência e informa limite de **dez gerações por minuto**.
- Abrir a composição no catálogo **não altera** a recomendação.
- O acervo de relatórios corresponde ao **período em que o investidor esteve vinculado** à carteira.
- A conta informa que a equipe define a carteira vinculada; troca deve passar pelo suporte.

### Pontos que o produto deve esclarecer

1. **Cardinalidade carteira × perfil:** o catálogo diz “uma por perfil”, enquanto o cadastro admite várias carteiras ativas por perfil. Definir cardinalidade e critério de escolha da recomendação.
2. **Recomendação vs. vínculo:** a jornada oferece avaliação para receber carteira, mas a conta atribui o vínculo à equipe. Confirmar se há recomendação automática, vínculo manual ou duas etapas diferentes.
3. **Fluxo de autoria:** nas carteiras sem versão, Composição não apresentou controles de criação/publicação. Identificar o fluxo autorizado para criar rascunhos, editar ativos, publicar e gerir vínculo antes dos casos correspondentes.
4. **Algoritmo de suitability:** confirmar pesos das cinco perguntas, combinações atingíveis e comportamento da reavaliação. Os limites exibidos são conhecidos, mas o algoritmo completo não foi inspecionado.
5. **Cálculos:** confirmar fórmula e precisão dos acumulados e do percentual do CDI, regras de edição de versões publicadas e de reemissão de relatórios.
6. **Fuso horário:** a conta mostrou consentimentos datados em 8 de outubro quando a data local era 7 de outubro à noite. Verificar UTC versus horário de São Paulo antes de classificar como defeito.
7. **Ciclo de vida da conta:** confirmar fluxo de exclusão, retenção, atualização de e-mail, expiração da sessão e eventual recuperação de senha. Executar casos condicionais somente se o recurso existir na versão.

---

## 2. Preparação e critérios de execução

Use **homologação com dados sintéticos**. Criação de administrador, inativação, exclusão, exportação e testes de volume devem usar contas descartáveis e ambiente autorizado. **Não use investidores reais como massa de teste.** Registre a versão e preserve uma massa de referência para repetir os cálculos.

### Massa mínima

**Usuários**

| ID | Descrição |
|---|---|
| ADM-A, ADM-B | Administradores ativos |
| ADM-U | Último administrador, em base isolada para teste de proteção |
| CLI-A, CLI-B | Clientes ativos com dados e vínculos diferentes |
| CLI-N | Cliente sem avaliação |
| CLI-I | Cliente inativo |
| CLI-T | Cliente de primeiro acesso |

- Um cliente por perfil; um cliente com reavaliação e histórico; um com troca de carteira; um sem carteira elegível.
- Usuários suficientes para pelo menos duas páginas. Nomes com acentos, homônimos e e-mails sintéticos controlados.

**Carteiras e versões**

- Carteiras conservadora, moderada, arrojada e sofisticada; duas ativas do mesmo perfil; uma inativa se suportado; uma sem versão.
- Versões em rascunho e publicadas em M-1 e M; ativos com acentos, códigos e pesos fracionados.
- Relatórios em períodos anteriores, durante e após o vínculo de CLI-A.

**Rentabilidade de referência em M**

| Indicador | Valor |
|---|---|
| Carteira | 1,50% |
| Acumulado | 6,25% |
| CDI | 1,00% |
| Ibovespa | -2,00% |

- Caso alternativo com **CDI zero**.
- Validar se os valores são armazenados como percentual ou fração.

**Datas**

- Datas na virada do dia e do mês, incluindo 31/12 e 01/01; competências M-1, M e M+1.

### Convenções

- **M** é a competência de execução em `AAAA-MM`.
- Casos com “fluxo autorizado” dependem do caminho identificado pela equipe técnica.
- Falta de recurso, massa ou regra deve gerar status **Bloqueado** ou **Não aplicável** com justificativa; **não marcar Aprovado sem execução**.

### Prioridades

| Prioridade | Escopo |
|---|---|
| **P0** | Acesso, isolamento de dados, classificação, vínculo, publicação e integridade de relatórios. Executar em toda liberação que afete esses fluxos. |
| **P1** | Funcionalidades principais, validações, cálculos, persistência e falhas recuperáveis. |
| **P2** | Acabamento, compatibilidade e comportamentos secundários. |

### Resultados possíveis

`Não executado` · `Aprovado` · `Reprovado` · `Bloqueado` · `Não aplicável`

Para cada ID, registrar executor, data, build, navegador, massa, resultado real, evidência e ID do defeito. O esperado abaixo é critério de teste proposto; regras indicadas como pendentes devem ser acordadas antes da aprovação.

---

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

## 8. Relatórios mensais (REL)

### REL 01 · P0 · Geração com pré-requisitos

- **Pré-condição:** versão publicada e dados de referência em M.
- **Passos:**
  1. Em Relatórios da carteira, informar M e comentário.
  2. Gerar relatório.
  3. Abrir o arquivo e conferir sua disponibilização.
- **Esperado:** documento íntegro da carteira/competência corretas; composição, movimentações, rentabilidade e aviso legal presentes; geração só é considerada concluída após arquivo utilizável.
- **Resultado:** Não executado
- **Evidência ou defeito:** _ID, link ou observação_

### REL 02 · P0 · Sem versão publicada

- **Pré-condição:** M sem versão, e versão apenas em rascunho.
- **Passos:**
  1. Tentar gerar nos dois estados.
  2. Conferir arquivo e indicador administrativo.
- **Esperado:** geração negada com motivo claro; não usa versão de outra competência; nenhum relatório ou contador de sucesso indevido.
- **Resultado:** Não executado
- **Evidência ou defeito:** _ID, link ou observação_

### REL 03 · P1 · Competência e comentário

- **Pré-condição:** formulário aberto.
- **Passos:**
  1. Testar competência vazia/malformada e mês 00/13.
  2. Gerar sem comentário.
  3. Usar comentário com acentos, quebras de linha, tamanho máximo e texto HTML.
- **Esperado:** competência validada; comentário opcional; texto legível, sem execução de marcação e sem quebrar a diagramação.
- **Resultado:** Não executado
- **Evidência ou defeito:** _ID, link ou observação_

### REL 04 · P1 · Limite de geração

- **Pré-condição:** homologação autorizada; escopo do limite confirmado.
- **Passos:**
  1. Fazer dez gerações na mesma janela de um minuto.
  2. Tentar a 11ª.
  3. Repetir após a janela e testar dois administradores conforme escopo acordado.
- **Esperado:** limite de dez respeitado no servidor; excedente informado; recuperação após janela; sem arquivos parciais. Confirmar se o limite é por usuário, carteira ou sistema.
- **Resultado:** Não executado
- **Evidência ou defeito:** _ID, link ou observação_

### REL 05 · P0 · Arquivo e fidelidade histórica

- **Pré-condição:** relatório M-1 e nova composição em M.
- **Passos:**
  1. Abrir relatório antigo.
  2. Conferir ativos, pesos, retornos, competência e comentário contra massa de M-1.
  3. Abrir páginas e impressão.
- **Esperado:** snapshot histórico correto, caracteres íntegros, tabela sem cortes e aviso legal legível.
- **Resultado:** Não executado
- **Evidência ou defeito:** _ID, link ou observação_

### REL 06 · P0 · Acervo por período de vínculo

- **Pré-condição:** CLI-A com vínculo entre datas conhecidas, inclusive um mês de entrada/saída.
- **Passos:**
  1. Consultar `/relatorios`.
  2. Conferir arquivos antes, durante e depois do vínculo.
  3. Trocar de carteira pelo fluxo autorizado e repetir.
- **Esperado:** acervo obedece à regra temporal aprovada; documentos de outro período não são liberados por URL direta; histórico elegível não desaparece indevidamente após troca.
- **Resultado:** Não executado
- **Evidência ou defeito:** _ID, link ou observação_

### REL 07 · P0 · Proteção do download

- **Pré-condição:** CLI-A e CLI-B com relatórios distintos.
- **Passos:**
  1. Copiar URL/identificador do arquivo de CLI-B.
  2. Tentar acesso como CLI-A e sem sessão.
  3. Testar link expirado quando houver.
- **Esperado:** arquivo privado protegido; autorização também no armazenamento/download; link não expõe conteúdo indefinidamente.
- **Resultado:** Não executado
- **Evidência ou defeito:** _ID, link ou observação_

### REL 08 · P1 · Falha e reemissão

- **Pré-condição:** falha de geração simulada e regra de reemissão aprovada.
- **Passos:**
  1. Interromper a resposta de geração em homologação.
  2. Consultar o resultado antes de tentar novamente.
  3. Reemitir M com comentário diferente.
- **Esperado:** sem falso sucesso, sem duplicação acidental; revisão/substituição segue regra e preserva rastreabilidade.
- **Resultado:** Não executado
- **Evidência ou defeito:** _ID, link ou observação_

---

## 9. Suitability e parâmetros (SUI / PAR)

### 9.1 Avaliação de perfil (SUI)

#### SUI 01 · P1 · Estado inicial da avaliação

- **Pré-condição:** CLI-N sem avaliação.
- **Passos:**
  1. Abrir `/avaliacao-perfil` pelo painel e pela conta.
  2. Conferir Pergunta 1 de 5, progresso, três opções e Voltar.
- **Esperado:** mesma jornada; progresso inicial 0%; Voltar desabilitado na primeira pergunta; nenhuma avaliação concluída antes de responder.
- **Resultado:** Não executado
- **Evidência ou defeito:** _ID, link ou observação_

#### SUI 02 · P1 · Resposta e navegação

- **Pré-condição:** conta de QA autorizada para avaliação.
- **Passos:**
  1. Responder por clique e verificar avanço automático.
  2. Nas etapas seguintes, voltar e trocar uma resposta.
  3. Prosseguir até a quinta.
- **Esperado:** uma resposta por pergunta, avanço único e progresso coerente; voltar preserva ou altera respostas conforme regra, sem duplicar pontuação.
- **Resultado:** Não executado
- **Evidência ou defeito:** _ID, link ou observação_

#### SUI 03 · P1 · Atalhos de teclado

- **Pré-condição:** avaliação na conta de QA.
- **Passos:**
  1. Responder à primeira pergunta com teclas 1, 2 e 3 em execuções separadas.
  2. Testar tecla inválida, repetida e navegação por Tab.
- **Esperado:** atalhos correspondem às opções exibidas, não saltam perguntas por repetição; seleção e foco acessíveis. Confirmar atalhos próprios das demais perguntas.
- **Resultado:** Não executado
- **Evidência ou defeito:** _ID, link ou observação_

#### SUI 04 · P0 · Pontuação e classificação

- **Pré-condição:** pesos e combinações esperadas fornecidos pelo produto.
- **Passos:**
  1. Executar combinações que produzam cada perfil.
  2. Somar pesos independentemente da interface.
  3. Comparar resultado, histórico administrativo e perfil no painel/conta.
- **Esperado:** mesma pontuação/perfil/versão de parâmetros em todos os registros; resultado não pode ser escolhido livremente pelo cliente na API.
- **Resultado:** Não executado
- **Evidência ou defeito:** _ID, link ou observação_

#### SUI 05 · P0 · Valores nas fronteiras

- **Pré-condição:** massa ou fixture autorizada para pontuações atingíveis.
- **Passos:**
  1. Validar 0, 17, 18, 32, 33, 46, 47 e 60.
  2. Testar -1 e 61 no serviço de validação.
- **Esperado:**

  | Pontuação | Perfil esperado |
  |---|---|
  | 0 | Conservador |
  | 17 | Conservador |
  | 18 | Moderado |
  | 32 | Moderado |
  | 33 | Arrojado |
  | 46 | Arrojado |
  | 47 | Sofisticado |
  | 60 | Sofisticado |
  | -1 / 61 | Rejeitado (fora de 0–60) |

  Se o questionário não atingir um limite, testar a classificação com fixture, sem fingir execução via UI.
- **Resultado:** Não executado
- **Evidência ou defeito:** _ID, link ou observação_

#### SUI 06 · P0 · Conclusão e vínculo

- **Pré-condição:** cliente sem avaliação e carteiras elegíveis.
- **Passos:**
  1. Concluir cinco perguntas.
  2. Abrir painel, conta e minha carteira.
  3. Conferir histórico administrativo.
- **Esperado:** uma avaliação concluída e recomendação/vínculo conforme processo aprovado; perfil correto e nenhum acesso a dados privados de terceiros. Diferenciar recomendação automática de vínculo pela equipe.
- **Resultado:** Não executado
- **Evidência ou defeito:** _ID, link ou observação_

#### SUI 07 · P1 · Interrupção e reenvio

- **Pré-condição:** avaliação parcial.
- **Passos:**
  1. Sair, voltar e recarregar no meio do questionário.
  2. Simular timeout da conclusão.
  3. Repetir conclusão após consultar status.
- **Esperado:** comportamento de retomada claro; nenhuma avaliação parcial tratada como concluída; sem resultados duplicados ou troca de perfil silenciosa.
- **Resultado:** Não executado
- **Evidência ou defeito:** _ID, link ou observação_

#### SUI 08 · P0 · Reavaliação e falta de carteira

- **Pré-condição:** cliente já avaliado e outro sem carteira elegível no perfil final.
- **Passos:**
  1. Refazer avaliação alterando o perfil.
  2. Conferir vínculo e acervo anterior.
  3. Concluir avaliação do perfil sem carteira disponível.
- **Esperado:** histórico preservado e transição conforme regra; ausência de carteira comunicada sem recomendação aleatória; acervo respeita períodos de vínculo.
- **Resultado:** Não executado
- **Evidência ou defeito:** _ID, link ou observação_

### 9.2 Parâmetros de suitability (PAR)

#### PAR 01 · P1 · Edição e cancelamento

- **Pré-condição:** ADM-A em `/admin/configuracoes`.
- **Passos:**
  1. Conferir oito campos mínimo/máximo e faixas atuais.
  2. Clicar Editar faixas.
  3. Alterar um valor e cancelar.
  4. Reabrir.
- **Esperado:** cancelamento preserva configuração; Salvar parâmetros desabilitado sem mudanças; acesso restrito ao papel autorizado.
- **Resultado:** Não executado
- **Evidência ou defeito:** _ID, link ou observação_

#### PAR 02 · P0 · Continuidade das faixas

- **Pré-condição:** edição em homologação.
- **Passos:**
  1. Criar lacuna entre 17 e 19.
  2. Criar sobreposição em 17.
  3. Inverter mínimo/máximo.
  4. Testar limites fora de 0–60, vazio e fração.
- **Esperado:** configurações inválidas não são salvas; mensagem identifica problema; validação também ocorre no servidor. Regra de números inteiros deve ser confirmada.
- **Resultado:** Não executado
- **Evidência ou defeito:** _ID, link ou observação_

#### PAR 03 · P0 · Versionamento e histórico

- **Pré-condição:** avaliação anterior e uma nova faixa válida aprovada.
- **Passos:**
  1. Salvar novas faixas cobrindo 0–60.
  2. Recarregar configuração.
  3. Fazer nova avaliação com pontuação afetada pela mudança.
  4. Consultar avaliação antiga.
- **Esperado:** nova avaliação usa nova versão; anterior mantém perfil e parâmetros históricos; alteração não reclassifica investidores retroativamente.
- **Resultado:** Não executado
- **Evidência ou defeito:** _ID, link ou observação_

#### PAR 04 · P0 · Concorrência e permissão

- **Pré-condição:** duas sessões administrativas e uma cliente.
- **Passos:**
  1. Editar mesma configuração em ADM-A e ADM-B.
  2. Salvar valores diferentes.
  3. Tentar atualização como cliente via API.
- **Esperado:** conflito ou sequência de versões explícita, sem perda silenciosa; cliente impedido de alterar os parâmetros.
- **Resultado:** Não executado
- **Evidência ou defeito:** _ID, link ou observação_

---

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

## 12. Painel administrativo e fechamento (ADM)

### ADM 01 · P1 · Contadores e perfis

- **Pré-condição:** massa com clientes ativos/inativos e avaliações de todos os perfis.
- **Passos:**
  1. Abrir `/admin`.
  2. Comparar investidores ativos e sem avaliação com dados de referência.
  3. Somar distribuição por perfil.
- **Esperado:** totais reconciliados; administradores não entram indevidamente como investidores; política de inclusão de inativos aplicada de forma consistente.
- **Resultado:** Não executado
- **Evidência ou defeito:** _ID, link ou observação_

### ADM 02 · P0 · Progresso do fechamento

- **Pré-condição:** três carteiras ativas, nenhuma publicada em M.
- **Passos:**
  1. Publicar uma e gerar seu relatório.
  2. Atualizar painel.
  3. Completar as demais.
  4. Conferir novamente em M+1.
- **Esperado:** contadores por competência passam de 0/3 para 1/3 e 3/3 conforme ações; fechamento só conclui sob critérios aprovados; dados de M não completam M+1.
- **Resultado:** Não executado
- **Evidência ou defeito:** _ID, link ou observação_

### ADM 03 · P1 · Carteiras e denominador

- **Pré-condição:** fechamento parcialmente concluído.
- **Passos:**
  1. Criar outra carteira ativa.
  2. Inativar uma, se disponível.
  3. Reemitir relatório de carteira já contabilizada.
- **Esperado:** denominador segue regra aprovada; reemissões não contam como carteiras adicionais; contagem não supera total sem explicação.
- **Resultado:** Não executado
- **Evidência ou defeito:** _ID, link ou observação_

### ADM 04 · P1 · Atalhos e estado vazio

- **Pré-condição:** administrador e base vazia/sem fechamento.
- **Passos:**
  1. Abrir Gerenciar usuários e links de versões/relatórios.
  2. Repetir com dados presentes.
- **Esperado:** navegação correta, contadores zero e mensagens legíveis; não há divisão por zero nem estado vazio apresentado como erro de acesso.
- **Resultado:** Não executado
- **Evidência ou defeito:** _ID, link ou observação_

---

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

## 14. Fluxos completos de aceitação (E2E)

### E2E 01 · P0 · Cliente do cadastro à recomendação

- **Pré-condição:** homologação com carteira publicada elegível e contas de teste.
- **Passos:**
  1. Administrador cadastra cliente.
  2. Cliente realiza primeiro acesso e aceite.
  3. Conclui avaliação com resultado conhecido.
  4. Equipe realiza vínculo se essa etapa for exigida.
  5. Cliente abre painel, minha carteira, catálogo e conta.
- **Esperado:** mesma identidade, perfil, vínculo e dados em toda a jornada; nenhum passo administrativo permitido ao cliente.
- **Resultado:** Não executado
- **Evidência ou defeito:** _ID, link ou observação_

### E2E 02 · P0 · Fechamento até o relatório do cliente

- **Pré-condição:** carteira vinculada em M e composição/retornos de referência.
- **Passos:**
  1. Criar e publicar versão.
  2. Lançar rentabilidade.
  3. Gerar relatório.
  4. Conferir fechamento administrativo.
  5. Cliente consulta e baixa relatório.
- **Esperado:** publicação, cálculos, acervo e contadores reconciliados; arquivo corresponde à competência e à carteira elegível.
- **Resultado:** Não executado
- **Evidência ou defeito:** _ID, link ou observação_

### E2E 03 · P0 · Reavaliação e preservação histórica

- **Pré-condição:** cliente com avaliação, vínculo e relatório em M-1.
- **Passos:**
  1. Atualizar parâmetros por nova versão.
  2. Reavaliar cliente com mudança de perfil.
  3. Atualizar vínculo pelo processo aprovado.
  4. Conferir M e relatório de M-1.
- **Esperado:** nova avaliação usa parâmetros novos; avaliação, vínculo e documentos históricos preservados; nenhum acesso a períodos não elegíveis.
- **Resultado:** Não executado
- **Evidência ou defeito:** _ID, link ou observação_

### E2E 04 · P0 · Revogação de acesso

- **Pré-condição:** cliente descartável conectado em duas sessões.
- **Passos:**
  1. Administrador inativa cliente.
  2. Tentar navegação, API, download e alteração de conta nas sessões existentes e novo login.
- **Esperado:** política aprovada de revogação efetiva em todas as superfícies, sem depender apenas do menu ou logout voluntário.
- **Resultado:** Não executado
- **Evidência ou defeito:** _ID, link ou observação_

---

## 15. Registro e decisão de liberação

### Ficha de execução

Copiar esta ficha para cada caso ou usar os mesmos campos no gerenciador de testes.

| Campo | Valor |
|---|---|
| ID do caso e prioridade | ____________________ |
| Build, ambiente e competência | ____________________ |
| Executor, data e navegador | ____________________ |
| Usuário e massa sintética utilizados | ____________________ |
| Resultado | Não executado / Aprovado / Reprovado / Bloqueado / Não aplicável |
| Resultado real e passo em que ocorreu | ____________________ |
| Evidências com horário e identificadores de teste | ____________________ |
| Defeito vinculado e responsável pelo reteste | ____________________ |

### Registro de defeito

Informar:

- Título objetivo
- Caso relacionado
- Ambiente/build
- Pré-condições
- Passos mínimos
- Resultado esperado
- Resultado real
- Frequência
- Impacto
- Evidência

Classificar **severidade pelo impacto**; a prioridade do caso não determina automaticamente a severidade. Remover senhas, tokens e dados pessoais das evidências compartilhadas.

### Smoke sugerido

`AUT 01` · `AUT 03` · `AUT 06` · `USU 03` · `CAR 01` · `VER 03` · `REN 01` · `REL 01` · `REL 06` · `SUI 06` · `PAR 03` · `INV 04` · `CON 07` · `ADM 02`

Em mudanças pequenas, selecionar por impacto, mantendo os casos de acesso e isolamento.

### Critério proposto para liberação

- [ ] Todos os **P0** aplicáveis executados e aprovados; nenhum defeito aberto que permita acesso indevido, perda de dados, classificação incorreta ou relatório inconsistente.
- [ ] **P1** executados, com eventuais exceções documentadas e aceitas pelo responsável do produto; bloqueios de massa/fluxo resolvidos ou explicitamente registrados como risco de cobertura.
- [ ] Regras pendentes acordadas e incorporadas aos resultados esperados; não usar suposições de fórmula, vínculo ou retenção para aprovar a versão.
- [ ] Fluxos **E2E** aplicáveis aprovados, cálculos conferidos com massa de referência e defeitos corrigidos retestados com regressão dos módulos afetados.
- [ ] Evidências e resumo de execução disponíveis, incluindo casos não executados e motivo.

> O plano contém cenários; a decisão de liberação depende dos resultados obtidos pelo QA.

### Resumo da rodada

| Métrica | Valor |
|---|---|
| Total executado | ____ |
| Aprovados | ____ |
| Reprovados | ____ |
| Bloqueados | ____ |
| Não aplicáveis | ____ |
| Não executados | ____ |
| Defeitos críticos/altos abertos | ____ |
| Riscos aceitos e aprovador | ____________________ |
| Decisão e data | ____________________ |

---

## Anexo — Índice de casos

| ID | Prioridade | Título | Resultado |
|---|---|---|---|
| AUT 01 | P0 | Login por papel | Não executado |
| AUT 02 | P1 | Credenciais inválidas | Não executado |
| AUT 03 | P0 | Rotas administrativas por cliente | Não executado |
| AUT 04 | P0 | Sessão encerrada e expirada | Não executado |
| AUT 05 | P0 | Usuário inativo | Não executado |
| AUT 06 | P0 | Isolamento entre clientes | Não executado |
| AUT 07 | P1 | Primeiro acesso e termos | Não executado |
| AUT 08 | P1 | Recuperação de senha quando disponível | Não executado |
| USU 01 | P1 | Listagem e paginação | Não executado |
| USU 02 | P1 | Busca | Não executado |
| USU 03 | P1 | Cadastro de cliente | Não executado |
| USU 04 | P0 | Cadastro de administrador | Não executado |
| USU 05 | P1 | Validação de senha inicial | Não executado |
| USU 06 | P1 | Campos inválidos e duplicidade | Não executado |
| USU 07 | P1 | Cancelamento e duplo envio | Não executado |
| USU 08 | P0 | Alteração de papel | Não executado |
| USU 09 | P0 | Proteção da administração | Não executado |
| USU 10 | P1 | Inativação e histórico de suitability | Não executado |
| CAR 01 | P1 | Lista e abertura | Não executado |
| CAR 02 | P1 | Nova carteira válida | Não executado |
| CAR 03 | P1 | Validações de cadastro | Não executado |
| CAR 04 | P0 | Múltiplas carteiras do mesmo perfil | Não executado |
| CAR 05 | P1 | Cancelamento e repetição de envio | Não executado |
| CAR 06 | P1 | Abas e identificação | Não executado |
| CAR 07 | P1 | Carteira sem versão | Não executado |
| VER 01 | P0 | Criação de rascunho | Não executado |
| VER 02 | P0 | Validações de ativos e pesos | Não executado |
| VER 03 | P0 | Publicação válida | Não executado |
| VER 04 | P0 | Competência inválida e duplicada | Não executado |
| VER 05 | P0 | Histórico e versão vigente | Não executado |
| VER 06 | P0 | Edição após publicação | Não executado |
| VER 07 | P0 | Concorrência de publicação | Não executado |
| VER 08 | P1 | Movimentações mensais | Não executado |
| REN 01 | P1 | Lançamento válido | Não executado |
| REN 02 | P1 | Prévia do CDI | Não executado |
| REN 03 | P0 | CDI zero e valores ausentes | Não executado |
| REN 04 | P1 | Formato numérico | Não executado |
| REN 05 | P1 | Competência e repetição | Não executado |
| REN 06 | P0 | Acumulados e comparação no ano | Não executado |
| REN 07 | P1 | Consistência entre áreas | Não executado |
| REN 08 | P1 | Virada de competência | Não executado |
| REL 01 | P0 | Geração com pré-requisitos | Não executado |
| REL 02 | P0 | Sem versão publicada | Não executado |
| REL 03 | P1 | Competência e comentário | Não executado |
| REL 04 | P1 | Limite de geração | Não executado |
| REL 05 | P0 | Arquivo e fidelidade histórica | Não executado |
| REL 06 | P0 | Acervo por período de vínculo | Não executado |
| REL 07 | P0 | Proteção do download | Não executado |
| REL 08 | P1 | Falha e reemissão | Não executado |
| SUI 01 | P1 | Estado inicial da avaliação | Não executado |
| SUI 02 | P1 | Resposta e navegação | Não executado |
| SUI 03 | P1 | Atalhos de teclado | Não executado |
| SUI 04 | P0 | Pontuação e classificação | Não executado |
| SUI 05 | P0 | Valores nas fronteiras | Não executado |
| SUI 06 | P0 | Conclusão e vínculo | Não executado |
| SUI 07 | P1 | Interrupção e reenvio | Não executado |
| SUI 08 | P0 | Reavaliação e falta de carteira | Não executado |
| PAR 01 | P1 | Edição e cancelamento | Não executado |
| PAR 02 | P0 | Continuidade das faixas | Não executado |
| PAR 03 | P0 | Versionamento e histórico | Não executado |
| PAR 04 | P0 | Concorrência e permissão | Não executado |
| INV 01 | P1 | Cliente sem avaliação | Não executado |
| INV 02 | P0 | Painel com dados | Não executado |
| INV 03 | P1 | Catálogo e filtros | Não executado |
| INV 04 | P0 | Consulta sem mudar vínculo | Não executado |
| INV 05 | P1 | Composição e aviso legal | Não executado |
| INV 06 | P0 | Gestão do vínculo | Não executado |
| CON 01 | P1 | Edição de nome e e-mail | Não executado |
| CON 02 | P1 | Validação e cancelamento | Não executado |
| CON 03 | P0 | Consentimentos | Não executado |
| CON 04 | P1 | Fuso e datas | Não executado |
| CON 05 | P0 | Exportação de dados | Não executado |
| CON 06 | P0 | Solicitação de exclusão | Não executado |
| CON 07 | P0 | Segurança da conta | Não executado |
| ADM 01 | P1 | Contadores e perfis | Não executado |
| ADM 02 | P0 | Progresso do fechamento | Não executado |
| ADM 03 | P1 | Carteiras e denominador | Não executado |
| ADM 04 | P1 | Atalhos e estado vazio | Não executado |
| QUA 01 | P1 | Falhas de rede e servidor | Não executado |
| QUA 02 | P0 | Conteúdo e entradas hostis | Não executado |
| QUA 03 | P1 | Responsividade | Não executado |
| QUA 04 | P1 | Acessibilidade | Não executado |
| QUA 05 | P2 | Temas e navegadores | Não executado |
| QUA 06 | P1 | Volume e tempo de resposta | Não executado |
| QUA 07 | P1 | Rastreabilidade e mensagens | Não executado |
| E2E 01 | P0 | Cliente do cadastro à recomendação | Não executado |
| E2E 02 | P0 | Fechamento até o relatório do cliente | Não executado |
| E2E 03 | P0 | Reavaliação e preservação histórica | Não executado |
| E2E 04 | P0 | Revogação de acesso | Não executado |

---

*Plano de testes QA MatchWallet AI Invest · 89 casos · Fonte funcional: telas do sistema analisadas na sessão administrativa.*
