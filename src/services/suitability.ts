import { http } from './http'
import type {
  AvaliarSuitabilityDto,
  PerguntaSuitabilityResponseDto,
  ResultadoAvaliacaoDto,
} from './types'

export async function listarPerguntas(): Promise<PerguntaSuitabilityResponseDto[]> {
  const { data } = await http.get<PerguntaSuitabilityResponseDto[]>('/suitability/perguntas')
  return data
}

// §4.2 do INTEGRATION_PROMPT.md: esta rota não lê o JWT da sessão — enviar `usuarioId`
// explicitamente (a store de auth faz isso) para a avaliação ficar vinculada ao usuário logado.
export async function avaliar(payload: AvaliarSuitabilityDto): Promise<ResultadoAvaliacaoDto> {
  const { data } = await http.post<ResultadoAvaliacaoDto>('/suitability/avaliar', payload)
  return data
}
