import type { AuthMeResponseDto } from './types'

export interface AtualizarContaPayload {
  nome: string
  email: string
}

/**
 * Atualiza os dados cadastrais do próprio usuário logado.
 *
 * MOCK temporário: o endpoint `PATCH /auth/me` vive em outra branch e ainda não chegou aqui.
 * Quando ela integrar, trocar o corpo por:
 *
 *   import { http } from '@boot/http'
 *   const { data } = await http.patch<AuthMeResponseDto>('/auth/me', payload)
 *   return data
 *
 * O contrato de consumo não muda: a store (`atualizarConta`) já faz o merge do retorno
 * parcial em `usuario.value`, e o retorno real (DTO completo) continua compatível com esse merge.
 */
export async function atualizar(
  payload: AtualizarContaPayload,
): Promise<Pick<AuthMeResponseDto, 'nome' | 'email'>> {
  await new Promise((resolve) => setTimeout(resolve, 600))
  return { nome: payload.nome, email: payload.email }
}
