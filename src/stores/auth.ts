import * as authService from '@services/auth'
import type { AuthMeResponseDto } from '@services/types'
import { perfilParaNivel } from '@utils/perfil'
import { defineStore } from 'pinia'
import { computed, ref } from 'vue'

/** Sessão do usuário logado — única fonte de verdade sobre quem está autenticado. */
export const useAuthStore = defineStore('auth', () => {
  const usuario = ref<AuthMeResponseDto | null>(null)
  /** `null` = ainda não verificamos a sessão nesta carga da aplicação (ver router guard). */
  const carregado = ref(false)

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
  }

  async function login(payload: authService.LoginPayload): Promise<void> {
    await authService.login(payload)
    await carregarSessao()
  }

  async function registrar(payload: authService.RegisterPayload): Promise<void> {
    await authService.registrar(payload)
    await login({ email: payload.email, senha: payload.senha })
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
  }

  return {
    usuario,
    carregado,
    isAuthenticated,
    isAdmin,
    iniciais,
    nivelPerfilInvestidor,
    carregarSessao,
    login,
    registrar,
    logout,
    clearSession,
  }
})
