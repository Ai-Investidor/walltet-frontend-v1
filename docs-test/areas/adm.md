# ADM · Painel administrativo

> **Implementar apenas:** ADM 01, 03, 04
> Os demais casos desta área já têm spec. Massa mínima, convenções e prioridades: seções 2 e 15 de `docs-test/Plano_de_Testes_QA_MatchWallet.md`.
> Cada `it` deve levar o ID do caso no título (ex.: `VER 03 · publicação válida`). Casos que dependem do estado do backend (concorrência, download, exportação, exclusão) vão em `cypress/e2e/real/`; o restante em `cypress/e2e/stubbed/`.

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

