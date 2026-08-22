// DADOS ESTÁTICOS — trocar por camada dinâmica (service/store/composable) quando a skill existir.
// Assinaturas e tipos são o contrato; não alterar sem atualizar o manifesto.

export interface AssessmentOption {
  id: number
  label: string
}

export interface AssessmentQuestion {
  prompt: string
  options: AssessmentOption[]
}

export interface AssessmentProgress {
  currentStep: number
  totalSteps: number
}

export const assessmentQuestion: AssessmentQuestion = {
  prompt: 'Por quanto tempo pretende manter esse dinheiro investido?',
  options: [
    { id: 1, label: 'Até 1 ano' },
    { id: 2, label: 'De 1 a 3 anos' },
    { id: 3, label: 'De 3 a 5 anos' },
    { id: 4, label: 'Mais de 5 anos' },
  ],
}

export const assessmentProgress: AssessmentProgress = {
  currentStep: 2,
  totalSteps: 5,
}
