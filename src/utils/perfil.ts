import type { ProfileLevel } from '@components/shared/profile-gauge'
import type { PerfilInvestidor } from '@services/types'

// O backend não tem nível numérico — só o enum de string (ver docs/AUDITORIA-INTEGRACAO.md §1.3).
// `ProfileGauge` e as telas que desenham a barra de nível continuam recebendo 1–4; este mapa fixo
// é o único lugar que faz essa tradução.
const NIVEL_POR_PERFIL: Record<PerfilInvestidor, ProfileLevel> = {
  CONSERVADOR: 1,
  MODERADO: 2,
  ARROJADO: 3,
  SOFISTICADO: 4,
}

export function perfilParaNivel(perfil: PerfilInvestidor): ProfileLevel {
  return NIVEL_POR_PERFIL[perfil]
}

/** "CONSERVADOR" → "Conservador" — rótulo de exibição a partir do enum. */
export function perfilParaRotulo(perfil: PerfilInvestidor): string {
  return perfil.charAt(0) + perfil.slice(1).toLowerCase()
}
