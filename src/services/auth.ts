import { http } from './http'
import type { AuthMeResponseDto, LoginResponseDto, UsuarioResponseDto } from './types'

export interface RegisterPayload {
  nome: string
  email: string
  senha: string
}

export interface LoginPayload {
  email: string
  senha: string
}

export async function registrar(payload: RegisterPayload): Promise<UsuarioResponseDto> {
  const { data } = await http.post<UsuarioResponseDto>('/auth/register', payload)
  return data
}

export async function login(payload: LoginPayload): Promise<LoginResponseDto> {
  const { data } = await http.post<LoginResponseDto>('/auth/login', payload)
  return data
}

export async function me(): Promise<AuthMeResponseDto> {
  const { data } = await http.get<AuthMeResponseDto>('/auth/me')
  return data
}

export async function logout(): Promise<void> {
  await http.post('/auth/logout')
}
