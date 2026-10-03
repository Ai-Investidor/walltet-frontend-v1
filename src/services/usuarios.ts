import { http } from '@boot/http'
import type {
  HistoricoSuitabilidadeItemDto,
  PaginatedResult,
  PerfilUsuario,
  UsuarioListagemDto,
  UsuarioResponseDto,
} from './types'

export interface ListarUsuariosParams {
  search?: string
  perfil?: PerfilUsuario
  ativo?: boolean
  page?: number
  pageSize?: number
}

export async function listar(
  params: ListarUsuariosParams = {},
): Promise<PaginatedResult<UsuarioListagemDto>> {
  const { data } = await http.get<PaginatedResult<UsuarioListagemDto>>('/usuarios', { params })
  return data
}

export interface AtualizarUsuarioPayload {
  ativo?: boolean
  perfil?: PerfilUsuario
}

// Erro de negócio possível: 409 ULTIMO_ADMIN (INTEGRATION_PROMPT.md §2.2) — tratar no chamador.
export async function atualizar(
  id: string,
  payload: AtualizarUsuarioPayload,
): Promise<UsuarioListagemDto> {
  const { data } = await http.patch<UsuarioListagemDto>(`/usuarios/${id}`, payload)
  return data
}

export async function historicoSuitability(id: string): Promise<HistoricoSuitabilidadeItemDto[]> {
  const { data } = await http.get<HistoricoSuitabilidadeItemDto[]>(
    `/usuarios/${id}/historico-suitability`,
  )
  return data
}

export interface CriarUsuarioPayload {
  nome: string
  email: string
  senha: string
  perfil: PerfilUsuario
}

export async function criar(payload: CriarUsuarioPayload): Promise<UsuarioResponseDto> {
  const { data } = await http.post<UsuarioResponseDto>('/usuarios', payload)
  return data
}
