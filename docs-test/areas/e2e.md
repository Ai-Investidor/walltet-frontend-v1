# E2E · Fluxos completos de aceitação

> **Implementar apenas:** E2E 01, 02, 03
> Os demais casos desta área já têm spec. Massa mínima, convenções e prioridades: seções 2 e 15 de `docs-test/Plano_de_Testes_QA_MatchWallet.md`.
> Cada `it` deve levar o ID do caso no título (ex.: `VER 03 · publicação válida`). Casos que dependem do estado do backend (concorrência, download, exportação, exclusão) vão em `cypress/e2e/real/`; o restante em `cypress/e2e/stubbed/`.

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

