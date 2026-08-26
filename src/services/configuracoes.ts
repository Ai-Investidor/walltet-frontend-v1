import { http } from './http'
import type { ConfiguracaoSuitabilityResponseDto, PerfilInvestidor } from './types'

export async function suitabilityVigente(): Promise<ConfiguracaoSuitabilityResponseDto> {
  const { data } = await http.get<ConfiguracaoSuitabilityResponseDto>('/configuracoes/suitability')
  return data
}

export interface AtualizarFaixasPayload {
  escalaMaxima: number
  faixas: Array<{ perfil: PerfilInvestidor; min: number; max: number }>
}

export async function atualizarSuitability(
  payload: AtualizarFaixasPayload,
): Promise<ConfiguracaoSuitabilityResponseDto> {
  const { data } = await http.put<ConfiguracaoSuitabilityResponseDto>(
    '/configuracoes/suitability',
    payload,
  )
  return data
}

export async function suitabilityHistorico(): Promise<ConfiguracaoSuitabilityResponseDto[]> {
  const { data } = await http.get<ConfiguracaoSuitabilityResponseDto[]>(
    '/configuracoes/suitability/historico',
  )
  return data
}
