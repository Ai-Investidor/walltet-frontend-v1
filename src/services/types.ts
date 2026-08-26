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
  usuarioId?: string
}

export interface ResultadoAvaliacaoDto {
  id: string
  usuarioId: string
  pontuacaoTotal: number
  perfilResultante: PerfilInvestidor
  carteiraRecomendada: {
    id: string
    nome: string
    perfilAlvo: PerfilInvestidor
    descricao: string | null
  } | null
  dataAvaliacao: string
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
