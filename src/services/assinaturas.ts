import { http } from '@boot/http'
export interface ConfiguracaoCadastro {
  cadastroDisponivel: boolean
  exigirPagamento: boolean
  checkoutUrl: string
}
export interface CodigoCadastro {
  status: string
  desafioId?: string
}
export async function configuracaoCadastro(): Promise<ConfiguracaoCadastro> {
  const { data } = await http.get<ConfiguracaoCadastro>('/assinaturas/cadastro/config')
  return data
}
export async function statusCadastro(email: string): Promise<{ status: string }> {
  const { data } = await http.post<{ status: string }>('/assinaturas/cadastro/status', { email })
  return data
}
export async function solicitarCodigo(email: string): Promise<CodigoCadastro> {
  const { data } = await http.post<CodigoCadastro>('/assinaturas/cadastro/codigo', { email })
  return data
}
