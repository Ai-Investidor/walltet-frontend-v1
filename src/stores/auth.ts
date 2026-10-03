import * as authService from '@services/auth'
import * as contaService from '@services/conta'
import * as lgpdService from '@services/lgpd'
import type { AuthMeResponseDto, TermoPendenteResponseDto } from '@services/types'
import { perfilParaNivel } from '@utils/perfil'
import { defineStore } from 'pinia'
import { computed, ref } from 'vue'

/** Sessão do usuário logado — única fonte de verdade sobre quem está autenticado. */
export const useAuthStore = defineStore('auth', () => {
  const usuario = ref<AuthMeResponseDto | null>(null)
  /** `null` = ainda não verificamos a sessão nesta carga da aplicação (ver router guard). */
  const carregado = ref(false)
  // LGPD: termos obrigatórios vigentes que o usuário logado ainda não aceitou — alimenta o modal
  // bloqueante (LgpdConsentModal). O backend (LgpdConsentGuard) também aplica essa regra em toda
  // rota protegida; isso aqui é a checagem proativa que evita o usuário nem chegar a ver o 403.
  const termosPendentes = ref<TermoPendenteResponseDto[]>([])
  const temTermosPendentes = computed(() => termosPendentes.value.length > 0)

  const isAuthenticated = computed(() => usuario.value !== null)
  const isAdmin = computed(() => usuario.value?.perfil === 'admin')

  const iniciais = computed(() => {
    if (!usuario.value) {
      return ''
    }

    return usuario.value.nome
      .split(' ')
      .filter(Boolean)
      .slice(0, 2)
      .map((parte) => parte.charAt(0).toUpperCase())
      .join('')
  })

  const nivelPerfilInvestidor = computed(() =>
    usuario.value?.perfilInvestidor ? perfilParaNivel(usuario.value.perfilInvestidor) : null,
  )

  /** Busca `/auth/me`; usada no boot da app e depois de login/avaliação de suitability. */
  async function carregarSessao(): Promise<void> {
    try {
      usuario.value = await authService.me()
    } catch {
      usuario.value = null
    } finally {
      carregado.value = true
    }

    if (usuario.value) {
      await carregarTermosPendentes()
    } else {
      termosPendentes.value = []
    }
  }

  /** Checagem proativa de consentimento — chamada após todo login/registro/boot autenticado. */
  async function carregarTermosPendentes(): Promise<void> {
    try {
      termosPendentes.value = await lgpdService.termosPendentes()
    } catch {
      // Falha de rede aqui não deve travar o app inteiro — o LgpdConsentGuard do backend
      // continua sendo a garantia real; o modal só reaparece na próxima carga bem-sucedida.
      termosPendentes.value = []
    }
  }

  /** Registra o aceite/recusa de um termo e atualiza a lista local de pendências. */
  async function responderConsentimento(termoId: string, consentiu: boolean): Promise<void> {
    await lgpdService.registrarConsentimento({ termoId, consentiu })
    termosPendentes.value = termosPendentes.value.filter((termo) => termo.id !== termoId)
  }

  async function login(payload: authService.LoginPayload): Promise<void> {
    await authService.login(payload)
    await carregarSessao()
  }

  async function registrar(payload: authService.RegisterPayload): Promise<void> {
    await authService.registrar(payload)
    await login({ email: payload.email, senha: payload.senha })
  }

  /** Atualiza nome/e-mail do próprio cadastro e reflete o retorno no estado da sessão. */
  async function atualizarConta(payload: contaService.AtualizarContaPayload): Promise<void> {
    const atualizado = await contaService.atualizar(payload)

    if (usuario.value) {
      usuario.value = { ...usuario.value, ...atualizado }
    }
  }

  async function logout(): Promise<void> {
    try {
      await authService.logout()
    } finally {
      clearSession()
    }
  }

  /** Só limpa o estado local — usada pelo interceptor 401, que não deve chamar a API de novo. */
  function clearSession(): void {
    usuario.value = null
    termosPendentes.value = []
  }

  return {
    usuario,
    carregado,
    isAuthenticated,
    isAdmin,
    iniciais,
    nivelPerfilInvestidor,
    termosPendentes,
    temTermosPendentes,
    carregarSessao,
    carregarTermosPendentes,
    responderConsentimento,
    login,
    registrar,
    atualizarConta,
    logout,
    clearSession,
  }
})
