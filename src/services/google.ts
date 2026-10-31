import { API_BASE_URL } from '@config/env'

export function googleOAuthUrl(vincular = false, returnTo = '/'): string {
  const base = API_BASE_URL.replace(/\/api\/v1\/?$/i, '')
  const destino = returnTo.startsWith('/') && !returnTo.startsWith('//') ? returnTo : '/'
  const query = new URLSearchParams({ returnTo: destino })
  return `${base}/api/auth/google${vincular ? '/vincular' : ''}?${query}`
}

const mensagensGoogle: Record<string, string> = {
  email_ja_cadastrado:
    'Entre com sua senha e, em Minha conta, vincule o Google para os próximos acessos.',
  cadastro_indisponivel:
    'Primeiro crie sua conta com o e-mail da compra do plano. Depois, vincule o Google em Minha conta.',
  assinatura_necessaria: 'Sua assinatura não está ativa. Fale com suporte@aiinvest.com.br.',
  cancelado: 'O acesso pelo Google foi cancelado. Você pode tentar novamente.',
  estado_invalido: 'A tentativa de acesso expirou. Clique novamente em Continuar com Google.',
  usuario_inativo: 'Sua conta está inativa. Fale com suporte@aiinvest.com.br.',
  google_ja_vinculado:
    'Essa conta já tem um vínculo com o Google. Use a conta Google vinculada ou fale com o suporte.',
  email_nao_verificado: 'Confirme o e-mail na sua conta Google antes de continuar.',
  nao_configurado: 'O acesso pelo Google está indisponível no momento. Entre com sua senha.',
}

export function mensagemErroGoogle(motivo: unknown): string {
  if (typeof motivo !== 'string' || !motivo) return ''
  return Object.hasOwn(mensagensGoogle, motivo)
    ? (mensagensGoogle[motivo] ?? '')
    : 'Não foi possível concluir o acesso pelo Google. Tente novamente ou entre com sua senha.'
}
