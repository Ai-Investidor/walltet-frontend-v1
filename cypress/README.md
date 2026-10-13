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
