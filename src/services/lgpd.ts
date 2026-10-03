import { http } from '@boot/http'
import type {
  ConsentimentoResponseDto,
  MeusDadosResponseDto,
  TermoPendenteResponseDto,
} from './types'

export async function termosPendentes(): Promise<TermoPendenteResponseDto[]> {
  const { data } = await http.get<TermoPendenteResponseDto[]>('/lgpd/termos-pendentes')
  return data
}

export interface RegistrarConsentimentoPayload {
  termoId: string
  consentiu: boolean
}

export async function registrarConsentimento(
  payload: RegistrarConsentimentoPayload,
): Promise<ConsentimentoResponseDto> {
  const { data } = await http.post<ConsentimentoResponseDto>('/lgpd/consentimentos', payload)
  return data
}

export async function revogar(termoId: string): Promise<ConsentimentoResponseDto> {
  const { data } = await http.post<ConsentimentoResponseDto>(`/lgpd/revogar/${termoId}`)
  return data
}

export async function meusDados(): Promise<MeusDadosResponseDto> {
  const { data } = await http.get<MeusDadosResponseDto>('/lgpd/meus-dados')
  return data
}

export async function solicitarExclusao(): Promise<{ message: string }> {
  const { data } = await http.post<{ message: string }>('/lgpd/solicitar-exclusao')
  return data
}
