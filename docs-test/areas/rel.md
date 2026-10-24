# REL · Relatórios mensais

> **Implementar apenas:** REL 03, 04, 05, 08
> Os demais casos desta área já têm spec. Massa mínima, convenções e prioridades: seções 2 e 15 de `docs-test/Plano_de_Testes_QA_MatchWallet.md`.
> Cada `it` deve levar o ID do caso no título (ex.: `VER 03 · publicação válida`). Casos que dependem do estado do backend (concorrência, download, exportação, exclusão) vão em `cypress/e2e/real/`; o restante em `cypress/e2e/stubbed/`.

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

