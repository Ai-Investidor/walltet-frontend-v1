import { http } from './http'
import type { AdminDashboardResponseDto, DashboardInvestidorResponseDto } from './types'

export async function investidor(): Promise<DashboardInvestidorResponseDto> {
  const { data } = await http.get<DashboardInvestidorResponseDto>('/dashboard/investidor')
  return data
}

export async function admin(): Promise<AdminDashboardResponseDto> {
  const { data } = await http.get<AdminDashboardResponseDto>('/dashboard/admin')
  return data
}
