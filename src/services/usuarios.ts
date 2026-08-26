import { http } from '@boot/http'
import type {
  PaginatedResult,
  PerfilUsuario,
  ResultadoAvaliacaoDto,
  UsuarioListagemDto,
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

// O shape de retorno não está documentado no contrato (docs/AUDITORIA-INTEGRACAO.md, achado 4.5) —
// `ResultadoAvaliacaoDto[]` é a melhor aproximação disponível (mesmos campos de
// `POST /suitability/avaliar`). Confirmar contra o backend real antes de confiar cegamente nisso;
// ajustar aqui se o shape observado for diferente.
export async function historicoSuitability(id: string): Promise<ResultadoAvaliacaoDto[]> {
  const { data } = await http.get<ResultadoAvaliacaoDto[]>(`/usuarios/${id}/historico-suitability`)
  return data
}
