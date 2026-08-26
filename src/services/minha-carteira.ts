import { http } from '@boot/http'
import type { MinhaCarteiraPerformanceResponseDto } from './types'

export async function performance(): Promise<MinhaCarteiraPerformanceResponseDto> {
  const { data } = await http.get<MinhaCarteiraPerformanceResponseDto>(
    '/minha-carteira/performance',
  )
  return data
}
