import { http } from './http'
import type {
  CarteiraDetalheDto,
  CarteiraResponseDto,
  CarteiraVersaoDetalheDto,
  CarteiraVersaoResumoDto,
  HistoricoPerformanceResponseDto,
  MovimentacoesResponseDto,
  PaginatedResult,
  PerfilInvestidor,
  RentabilidadeResponseDto,
} from './types'

export interface ListarCarteirasParams {
  perfil?: PerfilInvestidor
  page?: number
  pageSize?: number
}

export async function listar(
  params: ListarCarteirasParams = {},
): Promise<PaginatedResult<CarteiraResponseDto>> {
  const { data } = await http.get<PaginatedResult<CarteiraResponseDto>>('/carteiras', { params })
  return data
}

export async function detalhar(id: string): Promise<CarteiraDetalheDto> {
  const { data } = await http.get<CarteiraDetalheDto>(`/carteiras/${id}`)
  return data
}

export async function movimentacoes(
  id: string,
  mesReferencia?: string,
): Promise<MovimentacoesResponseDto> {
  const { data } = await http.get<MovimentacoesResponseDto>(`/carteiras/${id}/movimentacoes`, {
    params: mesReferencia ? { mesReferencia } : undefined,
  })
  return data
}

export async function historicoPerformance(
  id: string,
  periodoMeses = 12,
): Promise<HistoricoPerformanceResponseDto> {
  const { data } = await http.get<HistoricoPerformanceResponseDto>(
    `/carteiras/${id}/historico-performance`,
    { params: { periodoMeses } },
  )
  return data
}

// --- Admin --------------------------------------------------------------------

export interface CriarCarteiraPayload {
  nome: string
  perfilAlvo: PerfilInvestidor
  descricao?: string
}

export async function criar(payload: CriarCarteiraPayload): Promise<CarteiraResponseDto> {
  const { data } = await http.post<CarteiraResponseDto>('/carteiras', payload)
  return data
}

export interface AtualizarCarteiraPayload {
  nome?: string
  perfilAlvo?: PerfilInvestidor
  descricao?: string
  ativa?: boolean
}

export async function atualizar(
  id: string,
  payload: AtualizarCarteiraPayload,
): Promise<CarteiraResponseDto> {
  const { data } = await http.put<CarteiraResponseDto>(`/carteiras/${id}`, payload)
  return data
}

export interface ListarVersoesParams {
  publicada?: boolean
  page?: number
  pageSize?: number
}

export async function listarVersoes(
  id: string,
  params: ListarVersoesParams = {},
): Promise<PaginatedResult<CarteiraVersaoResumoDto>> {
  const { data } = await http.get<PaginatedResult<CarteiraVersaoResumoDto>>(
    `/carteiras/${id}/versoes`,
    { params },
  )
  return data
}

export interface CriarVersaoPayload {
  mesReferencia: string
  itens: Array<{ ativoId: string; pesoPercentual: number; justificativa?: string }>
}

export async function criarVersao(
  id: string,
  payload: CriarVersaoPayload,
): Promise<CarteiraVersaoDetalheDto> {
  const { data } = await http.post<CarteiraVersaoDetalheDto>(`/carteiras/${id}/versoes`, payload)
  return data
}

export async function publicarVersao(
  id: string,
  versaoId: string,
): Promise<CarteiraVersaoDetalheDto> {
  const { data } = await http.post<CarteiraVersaoDetalheDto>(
    `/carteiras/${id}/versoes/${versaoId}/publicar`,
  )
  return data
}

export interface LancarRentabilidadePayload {
  mesReferencia: string
  rentabilidadeMes: number
  rentabilidadeAcumuladaAno: number
  cdiMes: number
  ibovMes: number
}

export async function lancarRentabilidade(
  id: string,
  payload: LancarRentabilidadePayload,
): Promise<RentabilidadeResponseDto> {
  const { data } = await http.post<RentabilidadeResponseDto>(
    `/carteiras/${id}/rentabilidade`,
    payload,
  )
  return data
}

export async function corrigirRentabilidade(
  id: string,
  mesReferencia: string,
  payload: Omit<LancarRentabilidadePayload, 'mesReferencia'>,
): Promise<RentabilidadeResponseDto> {
  const { data } = await http.put<RentabilidadeResponseDto>(
    `/carteiras/${id}/rentabilidade/${mesReferencia}`,
    payload,
  )
  return data
}
