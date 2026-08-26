# Prompt de Integração — Backend `carteira-sistema-backend`

> Cole este arquivo inteiro como prompt numa sessão do Claude Code aberta
> **neste repositório** (`wallet-app-v1`). Ele documenta a API real do
> backend (já implementada, testada e rodando) e define duas tarefas: uma
> auditoria de correspondência frontend↔backend, seguida da implementação da
> camada de integração real.
>
> Gerado em 2026-08-25 a partir do código-fonte do backend
> (`carteira-sistema-backend`, branch `feat/cardsB1-B3`). Se algo aqui
> divergir do comportamento observado ao testar contra o backend rodando,
> o comportamento real observado é a fonte da verdade — pare e pergunte antes
> de assumir qual lado (doc ou código) está desatualizado.

---

## 0. Contexto — leia antes de tudo

Este projeto (`wallet-app-v1`) hoje é **100% estático**: todas as views
consomem dados fixos de `src/data/*.ts` (`wallet.ts`, `cliente.ts`,
`admin.ts`, `avaliacao.ts`, `navigation.ts`). Os próprios arquivos já
sinalizam isso:

```ts
// DADOS ESTÁTICOS — trocar por camada dinâmica (service/store/composable) quando a skill existir.
// Assinaturas e tipos são o contrato; não alterar sem atualizar o manifesto.
```

`src/services/` e `src/stores/` existem só como diretórios vazios
(`.gitkeep`). **Você é a "skill" que faltava** — a camada dinâmica que este
comentário está esperando.

O backend (`carteira-sistema-backend`) é um projeto NestJS + Prisma +
PostgreSQL separado, já implementado e testado (163 testes unitários + 67
e2e passando), rodando **agora** via Docker em
`http://localhost:3000/api/v1`. Ele não faz parte deste repositório — tudo
que você precisa saber sobre ele está neste documento.

**Antes de escrever qualquer código, siga sempre `.claude/RULES.md` deste
projeto** — isso não muda; RULES.md continua sendo a única fonte de verdade
para convenções de código deste repositório (tokens, estado e dados,
anatomia de componente, etc.). Este prompt define *o quê* integrar e *com
o quê comparar*; RULES.md define *como* escrever o código Vue/TS daqui.

### Suas duas tarefas, nesta ordem

1. **Auditoria de correspondência** (seção 6): compare cada arquivo de
   `src/data/*.ts` e cada view/página já construída contra o contrato real
   do backend descrito abaixo. Produza uma lista escrita de toda divergência
   encontrada — nome de campo, tipo, enum, fluxo assumido que não existe,
   etc. — **antes** de alterar qualquer código. Isso já foi começado pra
   você na seção 6.1 com um exemplo real de divergência encontrada.
2. **Implementação da integração real** (seção 7): depois de reportar a
   auditoria, implemente a camada `services/`/`stores/` (Axios + Pinia,
   ambos já são dependências do projeto) ligando as views ao backend real,
   substituindo o consumo de `src/data/*.ts` progressivamente.

Não invente comportamento do backend que não está descrito aqui. Se uma
view precisa de um dado que a API não expõe, **reporte isso como achado da
auditoria** em vez de inventar um campo ou mockar a resposta.

---

## 1. Visão geral da API

- **Base URL**: `http://localhost:3000/api/v1` (o backend já está rodando
  neste endereço via Docker no ambiente local; em outros ambientes, a porta/
  host mudam mas o prefixo `/api/v1` é sempre fixo).
- **Formato**: JSON nas duas direções, exceto `GET /relatorios/:id/download`
  (binário `application/pdf` ou `302` com `Location` assinada).
- **Autenticação — dual, use cookie (recomendado para esta SPA)**: o backend
  aceita tanto `Authorization: Bearer <token>` quanto um cookie `HttpOnly`
  chamado `access_token`, setado automaticamente por `POST /auth/login` e
  limpo por `POST /auth/logout`. Para uma SPA em navegador, **prefira o
  cookie** — evita guardar o JWT em `localStorage` (superfície de XSS menor).
  Isso exige:
  - `axios.create({ baseURL, withCredentials: true })` — sem isso o
    navegador não envia nem aceita o cookie `access_token`;
  - o backend já libera CORS com `credentials: true` refletindo a origem da
    requisição, e o `.env` do backend já tem
    `FRONTEND_URL="http://localhost:5173"` documentado (a porta padrão do
    Vite dev server deste projeto) — **já está alinhado**, não precisa pedir
    ajuste no backend para isso.
- **Paginação**: toda listagem paginada aceita `?page=` (1-based, default 1)
  e `?pageSize=` (default 10, máx. 100) e devolve:
  ```json
  { "items": [...], "total": 42, "page": 1, "pageSize": 10 }
  ```
  Nunca assuma um array solto na raiz de uma listagem.
- **Datas**: campos de timestamp completo (`criadoEm`, `geradoEm`,
  `dataAvaliacao`...) são ISO 8601 (`string`). Competências mensais
  (`mesReferencia`) são strings `"YYYY-MM"` (ex.: `"2026-08"`), não um objeto
  Date nem um par mês/ano separado.
- **Valores monetários/percentuais**: sempre `number` (o backend já converte
  de `Decimal`) — pronto para formatação, mas não faça aritmética financeira
  sensível em cima do valor recebido sem entender o arredondamento já
  aplicado no backend.

### 1.1 Ação necessária: `VITE_API_BASE_URL`

`.env.example` deste projeto hoje tem:
```
VITE_API_BASE_URL=http://localhost:3000
```
Isso **não inclui** o prefixo `/api/v1`. Ao montar o client Axios, decida
(e documente a decisão no seu client) uma destas duas opções — qualquer uma
funciona, mas escolha uma e seja consistente:
- opção A: `baseURL: `${API_BASE_URL}/api/v1``
- opção B: atualizar `.env.example`/`.env` para
  `VITE_API_BASE_URL=http://localhost:3000/api/v1` e usar `API_BASE_URL`
  direto como `baseURL`.

## 2. Formato de erros

Toda resposta de erro (`4xx`/`5xx`) usa o mesmo envelope — nunca uma string
solta:

```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Dados inválidos.",
    "fields": { "senha": "senha deve conter ao menos 1 número e 1 caractere especial." }
  }
}
```

`fields` é **opcional** (só em erros de validação de campo) — nunca dependa
dele estar presente; sempre trate `error.message` como o texto mínimo
exibível.

### 2.1 Códigos genéricos

| `code` | HTTP | Quando |
|---|---|---|
| `VALIDATION_ERROR` | 400 | Corpo/query inválido |
| `UNAUTHORIZED` | 401 | Token ausente/inválido/expirado, ou sessão revogada |
| `FORBIDDEN` | 403 | Autenticado, mas sem o perfil exigido pela rota |
| `NOT_FOUND` | 404 | Recurso não existe |
| `CONFLICT` | 409 | Violação de unicidade/estado |
| `BUSINESS_RULE_VIOLATION` | 422 | Regra de negócio (ex.: soma de pesos ≠ 100%) |
| `INTERNAL_ERROR` | 500 | Erro inesperado, nunca expõe stack trace |

### 2.2 Códigos de negócio específicos

| `code` | HTTP | Onde | Significado |
|---|---|---|---|
| `ULTIMO_ADMIN` | 409 | `PATCH /usuarios/:id` | Tentativa de inativar/rebaixar o único admin ativo |
| `VERSAO_NAO_PUBLICADA` | 422 | `POST /relatorios/gerar`, `.../publicar` | Sem versão publicada para a competência pedida |
| `SUITABILITY_PENDENTE` | 422 | `GET /minha-carteira/performance` | Usuário sem avaliação de suitability concluída |
| `CARTEIRA_NAO_VINCULADA` | 422 | `GET /minha-carteira/performance` | Sem carteira recomendada vinculada no momento |

> `ACUMULADO_DIVERGENTE` **não é erro** — é um aviso não-bloqueante dentro de
> `avisos: string[]` numa resposta `200`/`201` de sucesso de
> `POST/PUT .../rentabilidade`, junto de `acumuladoCalculado`. Exiba como
> alerta, não como falha.

### 2.3 Interceptor de sessão expirada (401)

`UNAUTHORIZED` deve disparar logout local + redirecionamento para a tela de
login (rota `login`, já construída neste projeto) — exceto quando a própria
chamada com erro já era a de login (senão vira loop de redirect).

## 3. Contratos TypeScript do backend

```typescript
// ---- Autenticação -------------------------------------------------------

type PerfilUsuario = 'admin' | 'cliente';
type PerfilInvestidor = 'CONSERVADOR' | 'MODERADO' | 'ARROJADO' | 'SOFISTICADO';

interface UsuarioResponseDto {
  id: string;
  nome: string;
  email: string;
  perfil: PerfilUsuario;
  ativo: boolean;
  criadoEm: string; // ISO 8601
}

interface LoginResponseDto {
  accessToken: string; // só relevante se optar por Bearer manual; o cookie já foi setado
  usuario: UsuarioResponseDto;
}

interface AuthMeResponseDto {
  id: string;
  nome: string;
  email: string;
  perfil: PerfilUsuario;
  perfilInvestidor: PerfilInvestidor | null;
  carteiraVinculada: { id: string; nome: string; perfilAlvo: PerfilInvestidor } | null;
}

// ---- Envelope genérico ----------------------------------------------------

interface ErrorPayload {
  error: { code: string; message: string; fields?: Record<string, string> };
}

interface PaginatedResult<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
}

// ---- Carteiras Recomendadas -----------------------------------------------

type StatusMovimentacao = 'MANTER' | 'ENTROU' | 'SAIU' | 'AUMENTOU' | 'REDUZIU';

interface CarteiraResponseDto {
  id: string;
  nome: string;
  perfilAlvo: PerfilInvestidor;
  descricao: string | null;
  ativa: boolean;
  criadoEm: string;
}

interface CarteiraItemDetalheDto {
  id: string;
  ativoId: string;
  tickerCodigo: string;
  nomeAtivo: string;
  classeAtivo?: string;
  pesoPercentual: number;
  statusMovimentacao: StatusMovimentacao;
  pesoAnteriorPercentual?: number | null;
  justificativa?: string | null;
}

interface CarteiraVersaoDetalheDto {
  id: string;
  mesReferencia: string;
  publicada: boolean;
  publicadaEm: string | null;
  itens: CarteiraItemDetalheDto[];
}

interface CarteiraVersaoResumoDto {
  id: string;
  mesReferencia: string;
  publicada: boolean;
  publicadaEm: string | null;
  totalItens: number;
}

interface CarteiraDetalheDto extends CarteiraResponseDto {
  versaoAtual: CarteiraVersaoDetalheDto | null;
}

interface MovimentacoesResponseDto {
  carteiraId: string;
  mesReferencia: string;
  movimentacoes: {
    entradas: Array<{ ticker: string; nome: string; pesoAtual: number; justificativa: string | null }>;
    saidas: Array<{ ticker: string; nome: string; pesoAnterior: number; justificativa: string | null }>;
    alteracoes: Array<{
      ticker: string; nome: string; pesoAnterior: number; pesoAtual: number; tipo: 'AUMENTOU' | 'REDUZIU';
    }>;
    mantidos: Array<{ ticker: string; nome: string; peso: number }>;
  };
}

// ---- Rentabilidade / Performance -------------------------------------------

interface RentabilidadeResponseDto {
  id: string;
  carteiraId: string;
  mesReferencia: string;
  rentabilidadeMes: number;
  rentabilidadeAcumuladaAno: number;
  cdiMes: number;
  ibovMes: number;
  avisos?: string[]; // ex.: ["ACUMULADO_DIVERGENTE"]
  acumuladoCalculado?: number;
}

interface HistoricoPerformanceResponseDto {
  carteiraId: string;
  carteiraNome: string;
  serie: Array<{
    mesReferencia: string; rentabilidade: number; cdi: number; ibov: number; percentualCdi: number | null;
  }>;
  acumulado: { carteira: number; cdi: number; ibov: number };
}

interface MinhaCarteiraPerformanceResponseDto {
  carteiraNome: string;
  mesAtual: { competencia: string; rentabilidade: number; cdi: number; percentualCdi: number | null } | null;
  acumuladoAno: { rentabilidade: number; cdi: number };
  historicoUltimosMeses: Array<{ mes: string; rentabilidade: number; cdi: number }>;
}

// ---- Suitability ------------------------------------------------------------

interface OpcaoSuitabilityResponseDto { id: string; texto: string; peso: number; ordem?: number; }
interface PerguntaSuitabilityResponseDto { id: string; enunciado: string; ordem?: number; opcoes: OpcaoSuitabilityResponseDto[]; }

interface ResultadoAvaliacaoDto {
  id: string;
  usuarioId: string;
  pontuacaoTotal: number;
  perfilResultante: PerfilInvestidor;
  carteiraRecomendada: { id: string; nome: string; perfilAlvo: PerfilInvestidor; descricao: string | null } | null;
  dataAvaliacao: string;
}

// ---- Relatórios PDF ---------------------------------------------------------

interface RelatorioGeradoResponseDto {
  id: string; carteiraId: string; mesReferencia: string; nomeArquivo: string;
  tamanhoBytes: number; geradoEm: string; downloadUrl: string;
}

interface MeuRelatorioResponseDto {
  id: string; mesReferencia: string; titulo: string; geradoEm: string; tamanhoBytes: number;
}

// ---- Dashboard ----------------------------------------------------------------

interface AdminDashboardResponseDto {
  totalInvestidores: number;
  distribuicaoPerfis: {
    CONSERVADOR: number; MODERADO: number; ARROJADO: number; SOFISTICADO: number; SEM_AVALIACAO: number;
  };
  carteirasAtivas: number;
  fechamentoMesAtual: { mesReferencia: string; versoesPublicadas: number; relatoriosGerados: number; pendente: boolean };
}

interface DashboardInvestidorResponseDto {
  usuario: { nome: string; perfilInvestidor: PerfilInvestidor | null };
  suitabilityRealizado: boolean;
  suitabilityVencido: boolean; // true quando a última avaliação tem mais de 24 meses
  carteira: { id: string; nome: string; totalAtivos: number; rentabilidadeUltimoMes: number } | null;
  ultimoRelatorio: { id: string; mesReferencia: string; downloadUrl: string } | null;
  movimentacoesMes: { novasEntradas: number; saidas: number };
}

// ---- Usuários (admin) ----------------------------------------------------------

interface UsuarioListagemDto {
  id: string; nome: string; email: string; perfil: PerfilUsuario; ativo: boolean; criadoEm: string;
}

// ---- Configurações — faixas de suitability (admin) ------------------------------

interface ConfiguracaoSuitabilityResponseDto {
  versao: number;
  escalaMaxima: number;
  faixas: Array<{ perfil: PerfilInvestidor; min: number; max: number }>;
  criadoEm: string;
}
```

## 4. Catálogo de endpoints

Legenda de **Auth**: `Público` (sem token, mas aceita Bearer/cookie válido se
enviado), `Autenticado` (qualquer perfil logado), `Admin` (`perfil: 'admin'`).

### 4.1 Autenticação — `/auth`

| Método | Rota | Auth | Descrição | Erros |
|---|---|---|---|---|
| POST | `/auth/register` | Público | Body `{ nome, email, senha }`. Cria com `perfil: 'cliente'`. Senha: mín. 8 chars, 1 número, 1 caractere especial. | `409 CONFLICT` e-mail duplicado |
| POST | `/auth/login` | Público | Body `{ email, senha }`. Seta cookie `access_token` e devolve `accessToken` no corpo. | `401 UNAUTHORIZED` credenciais inválidas · `403 FORBIDDEN` usuário inativo |
| GET | `/auth/me` | Autenticado | Usuário logado + perfil de investidor + carteira vinculada. | — |
| POST | `/auth/logout` | Autenticado | Limpa o cookie de sessão. | — |

### 4.2 Suitability — `/suitability`

| Método | Rota | Auth | Descrição |
|---|---|---|---|
| GET | `/suitability/perguntas` | Público | Perguntas ativas ordenadas, com opções e pesos. |
| POST | `/suitability/avaliar` | Público* | Body `{ respostas: [{ perguntaId, opcaoId }], usuarioId? }`. Calcula pontuação/perfil e vincula carteira. |

> ⚠️ `POST /suitability/avaliar` **não lê o JWT da sessão automaticamente**
> (o controller não valida token). Se o fluxo de avaliação de perfil deste
> app roda com o usuário já logado, **envie `usuarioId` explicitamente no
> corpo** (o `id` de `GET /auth/me`) para vincular a avaliação a ele —
> depender só do cookie/token não vincula nada.

### 4.3 Carteiras Recomendadas — `/carteiras`

| Método | Rota | Auth | Descrição |
|---|---|---|---|
| GET | `/carteiras?perfil=&page=&pageSize=` | Público | Lista carteiras ativas, filtro opcional por `perfilAlvo`. |
| GET | `/carteiras/:id` | Público | Detalhe + composição da versão publicada vigente. |
| GET | `/carteiras/:id/movimentacoes?mesReferencia=` | Público | Entradas/saídas/alterações/mantidos da competência (default: mês corrente). |
| GET | `/carteiras/:id/historico-performance?periodoMeses=12` | Autenticado | Série histórica (1–60 meses) vs. CDI/Ibovespa. |
| POST / PUT / `/versoes*` / `/rentabilidade*` | Admin | Gestão de carteiras — fora do escopo de telas de cliente; só relevante se este app tiver área admin. |

### 4.4 Minha Carteira — `/minha-carteira`

| Método | Rota | Auth | Descrição |
|---|---|---|---|
| GET | `/minha-carteira/performance` | Autenticado | Rentabilidade do mês/ano/histórico da carteira do usuário logado. Erros: `422 SUITABILITY_PENDENTE`, `422 CARTEIRA_NAO_VINCULADA`. |

### 4.5 Relatórios — `/relatorios`

| Método | Rota | Auth | Descrição |
|---|---|---|---|
| GET | `/relatorios/meus-relatorios?page=&pageSize=` | Autenticado | Relatórios do usuário logado (cliente: só suas competências). |
| GET | `/relatorios/:id/download` | Autenticado | Stream do PDF ou `302` com `Location` assinada. |
| POST | `/relatorios/gerar` | Admin | Gera PDF mensal, rate-limited a 10/min. |

### 4.6 Dashboard — `/dashboard`

| Método | Rota | Auth | Descrição |
|---|---|---|---|
| GET | `/dashboard/investidor` | Autenticado | Dashboard consolidado do usuário logado. |
| GET | `/dashboard/admin` | Admin | Visão panorâmica administrativa. |

### 4.7 Usuários — `/usuarios` (Admin, se este app tiver área admin)

| Método | Rota | Descrição |
|---|---|---|
| GET | `/usuarios?search=&perfil=&ativo=&page=&pageSize=` | Lista usuários. |
| PATCH | `/usuarios/:id` | Body `{ ativo?, perfil? }`. Erros: `409 ULTIMO_ADMIN`. |
| GET | `/usuarios/:id/historico-suitability` | Histórico de avaliações do usuário. |

### 4.8 Configurações — `/configuracoes/suitability` (Admin)

| Método | Rota | Descrição |
|---|---|---|
| GET | `/configuracoes/suitability` | Faixas vigentes. |
| PUT | `/configuracoes/suitability` | Body `{ escalaMaxima, faixas: [{ perfil, min, max }] }` (exatamente 4 faixas). |
| GET | `/configuracoes/suitability/historico` | Versões anteriores. |

### 4.9 Health — `/health`

`GET /health` (público) — útil para smoke test do ambiente antes de rodar a
suíte de integração deste frontend contra o backend real.

## 5. Regras de negócio que afetam UX

- **Último admin protegido**: `PATCH /usuarios/:id` nunca permite inativar/
  rebaixar o único admin ativo, nem auto-inativação/auto-rebaixamento
  (`409 ULTIMO_ADMIN`). Só relevante se este app tiver telas de gestão de
  usuários.
- **Revogação de sessão não é instantânea**: após um admin inativar/rebaixar
  um usuário, o token dele pode continuar válido por até 30s (cache interno
  do backend). Não desenhe UI que assuma revogação imediata de outra sessão.
- **`suitabilityVencido`** (em `DashboardInvestidorResponseDto`): `true`
  quando a última avaliação tem mais de 24 meses — sinal para reexibir o
  fluxo de reavaliação de perfil.

## 6. Tarefa 1 — Auditoria de correspondência (faça isto primeiro)

Para cada arquivo de `src/data/*.ts`, para cada `interface` exportada e para
cada view/página construída a partir dos `docs/build-manifest-*.md`
existentes, verifique contra as seções 3 e 4 deste documento:

1. O endpoint que alimentaria essa tela **existe** no catálogo da seção 4?
2. Os campos assumidos pela `interface` estática **têm correspondência**
   direta ou derivável no DTO real do backend? (nome de campo, tipo, se é
   opcional/nulável)
3. Enums assumidos (valores de string/número fixos) **batem** com os enums
   reais do backend (`PerfilInvestidor`, `StatusMovimentacao`, `perfil`)?
4. Campos puramente de apresentação (ex.: `tone`, `note`, `heightPercent`,
   `isCurrent`, labels formatados como string pronta) — esses **não vêm do
   backend**; identifique de qual campo real eles precisam ser **derivados**
   no frontend (formatação, cálculo de sinal positivo/negativo, etc.) e
   documente a derivação.
5. Fluxos assumidos pela tela (ex.: "usuário vê X depois de fazer Y") batem
   com a ordem real de chamadas da API, incluindo os campos opcionais que
   podem faltar (`perfilInvestidor: null`, `carteira: null` antes do
   suitability)?

**Produza a lista de divergências antes de tocar em código.** Formato
sugerido por item: `arquivo:interface.campo` → o que diverge → sugestão de
correção ou pergunta em aberto.

### 6.1 Divergência já identificada (ponto de partida)

`src/data/cliente.ts`:
```ts
export interface ProfileAssessment {
  date: string
  score: number
  profileLabel: string
  profileLevel: 1 | 2 | 3 | 4   // ⚠️ numérico
}
```
O backend não tem um "profileLevel" numérico — o perfil de investidor é o
enum de string `PerfilInvestidor` (`'CONSERVADOR' | 'MODERADO' | 'ARROJADO' |
'SOFISTICADO'`), presente como `perfilResultante` na resposta de
`POST /suitability/avaliar` e como `perfilInvestidor` em `GET /auth/me` e
`GET /dashboard/investidor`. Se a UI precisa de um número 1–4 (para renderizar
uma barra de nível, por exemplo), esse mapeamento (`CONSERVADOR` → 1,
`MODERADO` → 2, `ARROJADO` → 3, `SOFISTICADO` → 4) precisa ser uma função de
transformação no frontend — não existe como campo pronto na API. Continue a
auditoria a partir deste padrão para os demais arquivos de `src/data/`.

## 7. Tarefa 2 — Implementação da camada de integração

Depois de reportar a auditoria da seção 6:

1. **Cliente HTTP** (`src/services/` ou onde `RULES.md`/a convenção do
   projeto mandar): instância Axios única com `baseURL` (ver seção 1.1) e
   `withCredentials: true`; interceptor de resposta tratando `error.response.data.error.code
   === 'UNAUTHORIZED'` (seção 2.3).
2. **Camada de serviços por domínio**: um módulo por área da API (auth,
   suitability, carteiras, minha-carteira, relatórios, dashboard, e
   usuários/configurações só se este app tiver área admin), cada função
   tipada com os contratos da seção 3.
3. **Estado de sessão** (`src/stores/`, Pinia): usuário logado
   (`AuthMeResponseDto`), status de autenticação, e ação de logout que chama
   `POST /auth/logout` e limpa o estado local.
4. **Views**: substitua o consumo de `src/data/*.ts` pelas chamadas reais,
   view por view, mantendo (ou corrigindo, conforme a auditoria) as
   `interface`s existentes como o contrato de props dos componentes — a
   tradução do DTO real para a `interface` de UI (quando não forem
   idênticas) deve virar uma função de mapeamento explícita e testável, não
   um cast solto.
5. **Smoke test manual**: com o backend rodando em
   `http://localhost:3000/api/v1` (já está, via Docker), valide pelo menos o
   fluxo `registro → login → GET /auth/me → logout` de ponta a ponta neste
   frontend antes de considerar a integração de autenticação concluída.

Siga `.claude/RULES.md` para toda decisão de como estruturar/nomear/estilizar
o código Vue/TS resultante — este prompt não substitui essas regras, só
fornece o contrato de dados que faltava.
