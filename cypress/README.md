# Testes E2E (Cypress)

Duas suítes, ambas em Chrome (`defaultBrowser` no `cypress.config.ts`):

| Pasta | Backend | Quando usar |
| --- | --- | --- |
| `e2e/real/` | **real** (`carteira-sistema-backend` + banco de teste) | fluxos completos de ponta a ponta |
| `e2e/stubbed/` | nenhum — API toda stubada (`cy.intercept`) | UI, rotas e guard sem depender de infra |

## Preparar a suíte real

1. Suba o backend apontando para um **banco de teste** (não o de desenvolvimento) com um usuário `cliente` e um `admin` já criados.
2. A URL do backend está em `.env.e2e` (`VITE_API_BASE_URL`). O Vite e o Cypress leem o mesmo arquivo.
3. Copie `cypress.env.example.json` para `cypress.env.json` (ignorado pelo git) e preencha as credenciais. Em CI use variáveis `CYPRESS_clienteEmail`, `CYPRESS_clienteSenha`, `CYPRESS_adminEmail`, `CYPRESS_adminSenha`.

## Comandos

| Comando | O que faz |
| --- | --- |
| `bun run e2e:real` | sobe o front (modo `e2e`) e roda `e2e/real/` |
| `bun run e2e:stubbed` | sobe o front e roda `e2e/stubbed/` |
| `bun run e2e` | roda as duas suítes |
| `bun run e2e:open` | sobe o front e abre a interface do Cypress |
| `bun run cy:run` / `bun run cy:open` | só o Cypress, com o front já rodando (`bun run dev:e2e`) |

## Escrevendo testes reais

- `cy.loginReal('cliente' | 'admin')` faz o login real uma vez por execução (`cy.session`) e restaura o cookie nos testes seguintes. Depois dele, chame `cy.visit()`.
- `cy.apiRequest({ method, url, body })` faz `cy.request` na API real (`url` relativa a `/api/v1`) — use para preparar estado, em vez de passar pela UI.
- URL da API: `Cypress.expose('apiUrl')`. Segredos: `cy.env([...])`. Nunca coloque credenciais no código.
- Estado persiste no banco entre execuções: prepare os dados **antes** do teste (via `cy.apiRequest`) e use e-mails/nomes únicos quando criar registros.

## Cobertura do Plano de Testes QA (P0)

Origem: `docs-test/Plano_de_Testes_QA_MatchWallet.md`. Títulos dos testes começam pelo ID do caso (`AUT 03 · …`), então `grep -r "USU 09" cypress/e2e` acha o teste.

Para a suíte real, `cypress.env.json` precisa de dois clientes (`cliente*` e `cliente2*`) e um admin. `criarUsuarioDescartavel()` cria contas novas por auto-cadastro nos testes que revogam ou alteram acesso.

| Spec | Casos |
| --- | --- |
| `stubbed/rotas-protegidas` | AUT 01, AUT 03, AUT 04 (UI e guard) |
| `stubbed/avaliacao-perfil` | SUI 03, SUI 04, SUI 05 (renderização), SUI 06, SUI 07, SUI 08 (3 testes falham: tecla repetida, atalho sem foco, sem "Tentar novamente") |
| `stubbed/admin-usuarios` | USU 08, USU 09 (UI), USU 10 |
| `stubbed/usuarios-listagem` | USU 01, USU 02 (UI; 3 testes falham: sem paginação, busca limpa o campo, espaços não aparados) |
| `stubbed/criar-conta` | USU 03, 05, 06, 07 (auto-cadastro em `/criar-conta`; 1 teste falha: nome só com espaços) |
| `stubbed/admin-carteiras` | CAR 01–07 |
| `stubbed/versoes-ui` | VER 01/03/05/06/08 (leitura: Versões, Composição, resumo de movimentações) |
| `stubbed/conta` | CON 01, CON 02 (UI; 2 testes falham até `PATCH /auth/me` existir) |
| `stubbed/admin-rentabilidade` | REN 03, REN 06 (UI) |
| `stubbed/rentabilidade-lancamento` | REN 01, REN 02, REN 04, REN 05 (UI) |
| `stubbed/rentabilidade-cliente` | REN 07 (UI), REN 08 (UI; 1 teste falha: cartão "Mês" usa o último item da série) |
| `stubbed/admin-relatorios` | REL 01, REL 02, REL 03 (UI), REL 08 (UI) |
| `stubbed/relatorios-cliente` | REL 06 (UI), REL 07 (UI) |
| `stubbed/catalogo` | INV 03, INV 04, INV 05 |
| `stubbed/painel-investidor` | INV 01, INV 02 (apresentação; 1 teste falha: painel sem link para a avaliação) |
| `stubbed/admin-configuracoes` | PAR 01, PAR 02, PAR 03 (UI) |
| `stubbed/admin-painel` | ADM 02 (UI) |
| `stubbed/entradas-hostis` | QUA 02 |
| `stubbed/robustez` | QUA 01, QUA 03, QUA 04 (parcial: teclado/ARIA; 1 teste de QUA 01 falha: axios sem timeout) |
| `real/autorizacao` | AUT 03, PAR 04, USU 08, CON 07 (servidor) |
| `real/isolamento` | AUT 06, REL 07 (servidor) |
| `real/suitability-servidor` | SUI 04, SUI 05 (cálculo) |
| `real/suitability-interrupcao` | SUI 07 (servidor; 2º teste falha: `/avaliar` não é idempotente) |
| `real/revogacao` | AUT 05, E2E 04 |
| `real/sessao` | AUT 04 (servidor) |
| `real/versoes-servidor` | VER 01–08 via API de admin (carteira própria; 2 testes falham: peso 0 aceito e movimentações recalculadas na leitura) |
| `real/usuarios-servidor` | USU 01–07 (servidor; 2 testes falham: nome só com espaços e e-mail sem normalizar) |
| `real/rentabilidade-servidor` | REN 01, 02, 04, 05, 07, 08 (servidor) — carteira própria por teste |
| `real/relatorios-servidor` | REL 03 (servidor), REL 05 (bytes), REL 08 (reemissão) — carteira própria por teste |
| `real/relatorio-limite` | REL 04 — consome a cota de 10/min do admin e espera a janela (~2 min); rode isolado |
| `real/vazamento-dados` | QUA 07 (corpo das respostas e erros; a trilha de auditoria não é observável) |
| `real/vinculo` | INV 06 (reavaliação troca o vínculo; 2º teste falha enquanto `/suitability/avaliar` for público) |
| `real/jornadas` | E2E 01, E2E 02, E2E 03 (preparados pela API; ver desvios no topo do spec) |
| `real/conta` | CON 01, CON 02 (servidor; falha até `PATCH /auth/me` existir no backend) |

### Casos P0 sem teste (Bloqueado)

| Caso | Motivo |
| --- | --- |
| VER 01–08 (autoria pela tela) | Não há UI de criar rascunho/publicar versão (`Edicao`, `Revisao`, `AdicionarAtivo` desligadas). Cobertos pela API de admin em `real/versoes-servidor` e pela leitura em `stubbed/versoes-ui`. |
| USU 03/04 (cadastro pelo admin) | Não há UI nem `POST /usuarios` para o admin cadastrar com papel; `FormularioUsuario.vue` é órfão. Cobertos pelo auto-cadastro (`stubbed/criar-conta`, `real/usuarios-servidor`) e pela promoção via `PATCH`. "Primeiro acesso" não existe. |
| USU 09 (servidor) | Exige base isolada com um único admin; não rodar na base em uso. |
| REL 05, ADM 02 (reconciliação real) | Dependem de PDF e de massa de referência fechada. REL 05 só confere os bytes do arquivo antigo; o texto/impressão do PDF é manual. |
| SUI 05 (-1 e 61) | O front não valida a escala, é regra do servidor. Cobrir quando o contrato de erro for definido. |
| QUA 05, QUA 06 | Não há alternador de tema na UI; matriz de navegadores é de CI; desempenho exige metas acordadas. |
| INV 02 | Reconciliar o painel com a massa administrativa exige dados reais conhecidos. |
| INV 06 (fluxo da equipe) | Não há fluxo de vínculo pela equipe, nem na UI nem na API; `real/vinculo` usa a reavaliação, que é o único caminho existente. |
| CON 04 | Nenhuma data de consentimento/cadastro é exibida na UI e o backend não guarda consentimento. |
| CON 03, CON 05, CON 06 | Consentimentos, exportação e exclusão não existem na UI. `services/conta.ts` é mock, então CON 07 só é testado pela API. |
| E2E 01–03 | Cobertos por `real/jornadas` com desvios (sem cadastro pelo admin, aceite nem vínculo manual); ver o cabeçalho do spec. |

### Achados durante a escrita

- `Resultado.vue` mostra "Pontuação N **de 100**" fixo; o plano e as faixas usam a escala 0–60 (`escalaMaxima` vem do backend).
- CDI vazio e CDI 0 dão a mesma mensagem no lançamento de rentabilidade; o plano (REN 03) pede distinguir ausência de zero.
- `/suitability/avaliar` recebe `usuarioId` no corpo; o teste de `real/suitability-servidor` falha se o servidor aceitar o id de outra pessoa.
