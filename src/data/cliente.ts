// DADOS ESTÁTICOS — trocar por camada dinâmica (service/store/composable) quando a skill existir.
// Assinaturas e tipos são o contrato; não alterar sem atualizar o manifesto.

export interface ClientAccount {
  name: string
  email: string
  clientSince: string
  linkedWalletName: string
}

export interface ProfileAssessment {
  date: string
  score: number
  profileLabel: string
  profileLevel: 1 | 2 | 3 | 4
}

export const clientAccount: ClientAccount = {
  name: 'Ana Paula Silva',
  email: 'ana.silva@email.com',
  clientSince: '2026-02-12',
  linkedWalletName: 'Moderada Estratégica',
}

export const profileAssessments: ProfileAssessment[] = [
  { date: '2026-08-19', score: 42, profileLabel: 'MODERADO', profileLevel: 2 },
  { date: '2026-02-14', score: 38, profileLabel: 'MODERADO', profileLevel: 2 },
  { date: '2026-02-12', score: 22, profileLabel: 'CONSERVADOR', profileLevel: 1 },
]
