# Build Handoff — RecuperarSenha

> Data: 2026-08-22
> Manifesto: `docs/build-manifest-recuperar-senha.md`
> Rota: `/recuperar-senha` · Página: `src/pages/RecuperarSenha.vue`

## 1. Dados (Passo 1)

| Arquivo | Tipo | Status | Nota |
|---|---|---|---|
| `src/data/wallet.ts` | dado estático | já existia (reuso total, zero mudança) | camada dinâmica pendente (skill futura) |

Nenhum arquivo de dados criado ou estendido.

## 2. Components (Batch 0)

Nenhum. `SocialProofPanel` já implementado (2 consumidores prévios: Login, CriarConta) — reuso direto, sem Batch 0 nesta página.

## 3. Sections (Batches 1-N)

| Seção | Status | Assets faltantes | Desvios do manifesto | Evolução pedida | Bloqueios | Notas |
|---|---|---|---|---|---|---|
| `Formulario` | ok | nenhum | card virou `<div>` com `<Form v-if="!enviado">` aninhado (em vez de `<Form>` como raiz), pra manter `<h1>`/link "Voltar" vivos no estado de sucesso | nenhuma | nenhum | 1 campo (e-mail), nota de segurança inline (`PhShield` + texto), estado local `enviado` troca o conteúdo do card em vez de navegar pra rota inexistente |
| `PainelProva` | ok, corrigido pelo orquestrador | nenhum | **erro do orquestrador no manifesto**: o exemplo de uso dizia que a largura do painel já era default dentro de `SocialProofPanel` — errado, `SocialProofPanel` não tem `w-`/`shrink-` nenhum. A seção foi gerada sem a classe de largura, seguindo a instrução errada; corrigido antes do build (`cn('w-2/5 max-w-180 shrink-0 max-md:w-full max-md:max-w-none', props.class)`) | nenhuma | nenhum | agora idêntico (exceto comentários/whitespace) aos wrappers de Login e CriarConta, confirmado pelo review |

## 4. Code review

**Veredicto:** APROVADO COM RESSALVAS. 0 BLOCKER, 2 MAJOR, 3 MINOR, 4 INFO.

| # | Severidade | Resumo | Status |
|---|---|---|---|
| M1 | MAJOR | Foco perdido ao trocar pro estado "enviado" (`<Form v-if>` desmonta o elemento focado) | ✅ corrigido — foco move pra descrição via `useTemplateRef` + `tabindex="-1"` + `nextTick` |
| M2 | MAJOR | 3ª cópia idêntica do wrapper `PainelProva.vue` (resolver slug + `throw` + classe de largura) — R6 já passou do limiar de extração | não corrigido nesta entrega — ver §6, backlog P2 |
| m1 | MINOR | Estado de sucesso é beco sem saída (sem como tentar outro e-mail) | ✅ corrigido — botão "Usar outro e-mail" (`variant="ghost"`) |
| m2 | MINOR | `<h1>` não acompanha a mudança de estado (fica "Recuperar senha" mesmo após envio) | ✅ corrigido — título vira "Link enviado" via `computed` |
| m3 | MINOR | `<PainelProva />` fora de landmark em `RecuperarSenha.vue` | não corrigido — reviewer pediu explicitamente para não mexer só aqui (mesmo desenho de Login/CriarConta; mudar os 3 juntos ou nenhum) |

Após as correções: `bun check` limpo nos arquivos do escopo (só o info pré-existente de nome-de-componente-única-palavra), `bun run build` passa.

## 5. Intervenções do orquestrador (honestidade)

- `src/routers/index.ts` — rota `/recuperar-senha` registrada (já feito no `/build-prep`, confirmado aqui).
- `src/pages/RecuperarSenha.vue` — composição das duas seções, `<PainelProva />` direto (sem wrapper), seguindo a lição já registrada em `.claude/learn/layout/landmark-wrapper-breaks-flex-width.md`.
- `src/views/recuperar-senha/PainelProva.vue` — **corrigido pelo orquestrador** logo após o retorno do section-builder: faltava a classe de largura do painel (erro estava no próprio manifesto, seção "Lições de builds anteriores" — corrigida também).
- **Fora do escopo desta página, correção de dívida pré-existente:** `src/views/login/Formulario.vue` — removida a classe morta `md:text-table-row` (mesmo bug já corrigido em `criar-conta/Formulario.vue` numa entrega anterior, mas nunca corrigido na origem/Login; o novo `Formulario.vue` desta página copiou o padrão de Login e reintroduziu o mesmo bug). Corrigido nos 3 arquivos agora — `grep -rn "md:text-table-row" src/` retorna vazio.

## 6. Análise e sugestões de correção

### Causas raiz

1. **Erro do orquestrador (este build):** o manifesto de `recuperar-senha` afirmou, incorretamente, que a largura do painel é default dentro de `SocialProofPanel`. Na realidade ela vive em cada wrapper de página (`views/{page}/PainelProva.vue`), aplicada via `cn()`. Isso originou uma seção sem largura definida — capturado e corrigido antes do build, mas é o tipo de erro que `/learn` deveria registrar (ver §8).
2. **Bug não corrigido na origem (build anterior):** ao revisar `criar-conta/Formulario.vue`, o `md:text-table-row` morto foi corrigido só ali, não em `login/Formulario.vue` de onde o padrão veio. Como `section-builder` usa páginas irmãs como referência de convenção, o bug se propagou de volta pra esta 3ª página. Corrigido agora nos 3 arquivos.
3. **Duplicação estrutural (M2, não é bug, é dívida):** `PainelProva.vue` já tem 3 cópias quase idênticas. R6 aponta extração a partir de 2 consumidores — já deveria ter sido resolvido no build de `criar-conta`, ficou como P2 lá, continua como P2 aqui.

### Backlog priorizado

**P0 — nenhum.** Build e rota funcionam; nada impede o merge.

**P1 — nenhum novo.**

**P2 — dívida técnica (não bloqueia):**
- Resolver a duplicação de `PainelProva.vue` (M2): mover `recommendedWallets.find(slug === 'moderado')` pra um export tipado em `src/data/wallet.ts` (elimina o `throw` em runtime nos 3 arquivos) e considerar se a largura do painel deveria ser o default dentro do próprio `SocialProofPanel` em vez de repetida em cada wrapper — isso reduziria cada `PainelProva.vue` a uma linha ou eliminaria o arquivo por completo (páginas importariam `SocialProofPanel` direto). Afeta Login, CriarConta e RecuperarSenha ao mesmo tempo — mudança deliberada, não incidental.
- Landmark do painel direito (m3): se decidir resolver, mudar `Login.vue`, `CriarConta.vue` e `RecuperarSenha.vue` juntos, não um de cada vez (histórico: a tentativa anterior de corrigir só numa página já quebrou o layout uma vez).
- Tela "Link enviado" (node `QuuqQ` no Pencil) não existe como rota — o mock atual troca o conteúdo do card em vez de navegar. Se quiser a tela de verdade, é um `/build-prep` separado.

## 7. Prompt copiável (retomar pendências)

```
Resolva a duplicação de PainelProva.vue entre Login, CriarConta e RecuperarSenha
(docs/build-handoff-recuperar-senha.md, item P2):

1. Em src/data/wallet.ts, adicione um export tipado que resolve a carteira
   'moderado' uma vez, sem `throw` em runtime:

   export const walletProvaSocial: RecommendedWallet = recommendedWallets.find(
     (item) => item.slug === 'moderado',
   )! // ou o índice fixo, se preferir garantia em build

2. Avalie mover a largura padrão (`w-2/5 max-w-180 shrink-0 max-md:w-full
   max-md:max-w-none`) para dentro de SocialProofPanel.vue como parte da
   classe base do <section>, em vez de repetida via cn() em cada
   views/{page}/PainelProva.vue.

3. Se os dois pontos acima forem feitos, os três wrappers PainelProva.vue
   (login, criar-conta, recuperar-senha) provavelmente somem — as páginas
   passam a importar SocialProofPanel direto. Confirme visualmente as 3
   páginas antes e depois (bun dev), rode bun check + bun run build ao final.

Ref: docs/build-handoff-criar-conta.md (P2) e docs/build-handoff-recuperar-senha.md (M2).
```

## 8. Sugestão

Este build cometeu um erro real (largura do painel ausente por instrução errada no manifesto) que só não virou bug visível porque foi pego antes do `bun run build`. Junto com o `md:text-table-row` que voltou por cópia de Login, isso é 2 recorrências do mesmo tipo de problema (estado compartilhado entre páginas-irmãs divergindo). Vale considerar `/learn` pra registrar o padrão "manifesto descreve default de um componente compartilhado incorretamente" — distinto das duas lições já registradas (`landmark-wrapper-breaks-flex-width`, `fixed-width-panel-fullbleed`), mas do mesmo vizinho de causa.
