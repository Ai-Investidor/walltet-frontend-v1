import { http } from '@boot/http'
import type { MeuRelatorioResponseDto, PaginatedResult, RelatorioGeradoResponseDto } from './types'

export interface ListarMeusRelatoriosParams {
  page?: number
  pageSize?: number
}

export async function meusRelatorios(
  params: ListarMeusRelatoriosParams = {},
): Promise<PaginatedResult<MeuRelatorioResponseDto>> {
  const { data } = await http.get<PaginatedResult<MeuRelatorioResponseDto>>(
    '/relatorios/meus-relatorios',
    { params },
  )
  return data
}

/**
 * Baixa o PDF como blob e aciona o download no navegador. O nome do arquivo vem do header
 * `Content-Disposition`; sem ele, cai no nome informado.
 */
export async function baixar(id: string, nomeArquivoPadrao: string): Promise<void> {
  const response = await http
    .get(`/relatorios/${id}/download`, { responseType: 'blob' })
    .catch(async (err: unknown) => {
      // Com `responseType: 'blob'` o envelope de erro também chega como Blob: decodifica pra que
      // o chamador receba o mesmo `ErrorPayload` das outras chamadas.
      if (err instanceof Blob) {
        throw JSON.parse(await err.text())
      }
      throw err
    })

  const nomeArquivo =
    (response.headers['content-disposition'] as string | undefined)?.match(
      /filename="(.+)"/,
    )?.[1] ?? nomeArquivoPadrao

  const url = URL.createObjectURL(response.data as Blob)
  const link = document.createElement('a')
  link.href = url
  link.download = nomeArquivo
  link.click()
  URL.revokeObjectURL(url)
}

// --- Admin --------------------------------------------------------------------

export interface GerarRelatorioPayload {
  carteiraId: string
  mesReferencia: string
  comentarioMercado?: string
  forcar?: boolean
}

export async function gerar(payload: GerarRelatorioPayload): Promise<RelatorioGeradoResponseDto> {
  const { data } = await http.post<RelatorioGeradoResponseDto>('/relatorios/gerar', payload)
  return data
}
