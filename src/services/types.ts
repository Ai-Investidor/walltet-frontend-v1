// Contrato do backend `carteira-sistema-backend` — espelha INTEGRATION_PROMPT.md §3.
// Não são tipos de UI: a tradução para o que cada view precisa vive em `@utils/mappers` e nas
// próprias views. Alterar aqui só quando o contrato real do backend mudar.

export type PerfilUsuario = 'admin' | 'cliente'
export type PerfilInvestidor = 'CONSERVADOR' | 'MODERADO' | 'ARROJADO' | 'SOFISTICADO'
export type StatusMovimentacao = 'MANTER' | 'ENTROU' | 'SAIU' | 'AUMENTOU' | 'REDUZIU'

// ---- Envelope genérico ----------------------------------------------------

export interface ErrorPayload {
  error: {
    code: string
    message: string
    fields?: Record<string, string>
  }
}

export interface PaginatedResult<T> {
  items: T[]
  total: number
  page: number
  pageSize: number
}

// ---- Autenticação -----------------------------------------------------------

export interface UsuarioResponseDto {
  id: string
  nome: string
  email: string
  perfil: PerfilUsuario
  ativo: boolean
  criadoEm: string
}

export interface LoginResponseDto {
  accessToken: string
  usuario: UsuarioResponseDto
}

export interface AuthMeResponseDto {
  id: string
  nome: string
  email: string
  perfil: PerfilUsuario
  perfilInvestidor: PerfilInvestidor | null
  carteiraVinculada: { id: string; nome: string; perfilAlvo: PerfilInvestidor } | null
}

// ---- Carteiras Recomendadas -------------------------------------------------

export interface CarteiraResponseDto {
  id: string
  nome: string
  perfilAlvo: PerfilInvestidor
  descricao: string | null
  ativa: boolean
  criadoEm: string
}

export interface CarteiraItemDetalheDto {
  id: string
  ativoId: string
  tickerCodigo: string
  nomeAtivo: string
  classeAtivo?: string
  pesoPercentual: number
  statusMovimentacao: StatusMovimentacao
  pesoAnteriorPercentual?: number | null
  justificativa?: string | null
}

export interface CarteiraVersaoDetalheDto {
  id: string
  mesReferencia: string
  publicada: boolean
  publicadaEm: string | null
  itens: CarteiraItemDetalheDto[]
}

export interface CarteiraVersaoResumoDto {
  id: string
  mesReferencia: string
  publicada: boolean
  publicadaEm: string | null
  totalItens: number
}

export interface CarteiraDetalheDto extends CarteiraResponseDto {
  versaoAtual: CarteiraVersaoDetalheDto | null
}

export interface MovimentacoesResponseDto {
  carteiraId: string
  mesReferencia: string
  movimentacoes: {
    entradas: Array<{
      ticker: string
      nome: string
      pesoAtual: number
      justificativa: string | null
    }>
    saidas: Array<{
      ticker: string
      nome: string
      pesoAnterior: number
      justificativa: string | null
    }>
    alteracoes: Array<{
      ticker: string
      nome: string
      pesoAnterior: number
      pesoAtual: number
      tipo: 'AUMENTOU' | 'REDUZIU'
    }>
    mantidos: Array<{ ticker: string; nome: string; peso: number }>
  }
}

// ---- Rentabilidade / Performance --------------------------------------------

export interface RentabilidadeResponseDto {
  id: string
  carteiraId: string
  mesReferencia: string
  rentabilidadeMes: number
  rentabilidadeAcumuladaAno: number
  cdiMes: number
  ibovMes: number
  avisos?: string[]
  acumuladoCalculado?: number
}

export interface HistoricoPerformanceResponseDto {
  carteiraId: string
  carteiraNome: string
  serie: Array<{
    mesReferencia: string
    rentabilidade: number
    cdi: number
    ibov: number
    percentualCdi: number | null
  }>
  acumulado: { carteira: number; cdi: number; ibov: number }
}

export interface MinhaCarteiraPerformanceResponseDto {
  carteiraNome: string
  mesAtual: {
    competencia: string
    rentabilidade: number
    cdi: number
    percentualCdi: number | null
  } | null
  acumuladoAno: { rentabilidade: number; cdi: number }
  historicoUltimosMeses: Array<{ mes: string; rentabilidade: number; cdi: number }>
}

// ---- Suitability --------------------------------------------------------------

export interface OpcaoSuitabilityResponseDto {
  id: string
  texto: string
  peso: number
  ordem?: number
}

export interface PerguntaSuitabilityResponseDto {
  id: string
  enunciado: string
  ordem?: number
  opcoes: OpcaoSuitabilityResponseDto[]
}

export interface RespostaSuitabilityDto {
  perguntaId: string
  opcaoId: string
}

export interface AvaliarSuitabilityDto {
  respostas: RespostaSuitabilityDto[]
  // Não existe mais `usuarioId` aqui (achado de segurança corrigido no backend — IDOR: o campo
  // era aceito do corpo da requisição e permitia vincular a avaliação a QUALQUER usuário por
  // id, sem sessão nenhuma). O backend agora só vincula ao dono do cookie de sessão
  // (`withCredentials`, ver boot/http.ts) — sem sessão, calcula e devolve o resultado sem
  // persistir nem vincular a ninguém.
}

export interface ResultadoAvaliacaoDto {
  // `null` quando a chamada foi feita sem sessão autenticada — ver nota acima.
  id: string | null
  usuarioId: string | null
  pontuacaoTotal: number
  perfilResultante: PerfilInvestidor
  carteiraRecomendada: {
    id: string
    nome: string
    perfilAlvo: PerfilInvestidor
    descricao: string | null
  } | null
  dataAvaliacao: string | null
}

// Shape real de GET /usuarios/:id/historico-suitability (admin) — distinto de
// ResultadoAvaliacaoDto (resposta de POST /suitability/avaliar, que pode vir nula quando a
// submissão não tem sessão autenticada). Historicamente os dois foram tratados como o mesmo tipo
// aqui (comentário em services/usuarios.ts já registrava isso como aproximação, sem contrato
// documentado) — separados para não herdar a nulabilidade de um no outro.
export interface HistoricoSuitabilidadeItemDto {
  id: string
  pontuacaoTotal: number
  perfilResultante: PerfilInvestidor
  dataAvaliacao: string
}

// ---- LGPD (governança de privacidade) --------------------------------------

export type TipoTermo = 'TERMOS_DE_USO' | 'POLITICA_PRIVACIDADE' | 'COMUNICACAO_MARKETING'

export interface TermoPendenteResponseDto {
  id: string
  tipo: TipoTermo
  versaoTermo: string
  obrigatorio: boolean
  conteudoResumido: string
}

export interface ConsentimentoResponseDto {
  id: string
  termoId: string
  tipo: TipoTermo
  versaoTermo: string
  obrigatorio: boolean
  consentiu: boolean
  dataConsentimento: string
  dataRevogacao: string | null
}

export interface MeusDadosResponseDto {
  dadosCadastrais: {
    id: string
    nome: string
    email: string
    perfil: PerfilUsuario
    criadoEm: string
    atualizadoEm: string
  }
  avaliacoesSuitability: Array<{
    id: string
    pontuacaoTotal: number
    perfilResultante: PerfilInvestidor
    respostas: unknown
    dataAvaliacao: string
  }>
  historicoCarteiras: Array<{
    carteiraId: string
    carteiraNome: string
    dataInicio: string
    dataFim: string | null
  }>
  posicoesPatrimoniais: Array<{
    mesReferencia: string
    patrimonioTotal: number
    aporte: number
    dividendos: number
  }>
  relatoriosGerados: Array<{
    id: string
    mesReferencia: string
    nomeArquivo: string
    geradoEm: string
  }>
  consentimentos: ConsentimentoResponseDto[]
  exportadoEm: string
}

// ---- Relatórios PDF -------------------------------------------------------------

export interface RelatorioGeradoResponseDto {
  id: string
  carteiraId: string
  mesReferencia: string
  nomeArquivo: string
  tamanhoBytes: number
  geradoEm: string
  downloadUrl: string
}

export interface MeuRelatorioResponseDto {
  id: string
  mesReferencia: string
  titulo: string
  geradoEm: string
  tamanhoBytes: number
}

// ---- Dashboard --------------------------------------------------------------------

export interface AdminDashboardResponseDto {
  totalInvestidores: number
  distribuicaoPerfis: {
    CONSERVADOR: number
    MODERADO: number
    ARROJADO: number
    SOFISTICADO: number
    SEM_AVALIACAO: number
  }
  carteirasAtivas: number
  fechamentoMesAtual: {
    mesReferencia: string
    versoesPublicadas: number
    relatoriosGerados: number
    pendente: boolean
  }
}

export interface DashboardInvestidorResponseDto {
  usuario: { nome: string; perfilInvestidor: PerfilInvestidor | null }
  suitabilityRealizado: boolean
  suitabilityVencido: boolean
  carteira: { id: string; nome: string; totalAtivos: number; rentabilidadeUltimoMes: number } | null
  ultimoRelatorio: { id: string; mesReferencia: string; downloadUrl: string } | null
  movimentacoesMes: { novasEntradas: number; saidas: number }
}

// ---- Usuários (admin) -----------------------------------------------------------

export interface UsuarioListagemDto {
  id: string
  nome: string
  email: string
  perfil: PerfilUsuario
  ativo: boolean
  criadoEm: string
}

// ---- Configurações — faixas de suitability (admin) -------------------------------

export interface ConfiguracaoSuitabilityResponseDto {
  versao: number
  escalaMaxima: number
  faixas: Array<{ perfil: PerfilInvestidor; min: number; max: number }>
  criadoEm: string
}
