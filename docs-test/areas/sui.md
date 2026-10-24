# SUI · Avaliação de perfil

> **Implementar apenas:** SUI 03, SUI 07
> Os demais casos desta área já têm spec. Massa mínima, convenções e prioridades: seções 2 e 15 de `docs-test/Plano_de_Testes_QA_MatchWallet.md`.
> Cada `it` deve levar o ID do caso no título (ex.: `VER 03 · publicação válida`). Casos que dependem do estado do backend (concorrência, download, exportação, exclusão) vão em `cypress/e2e/real/`; o restante em `cypress/e2e/stubbed/`.

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

