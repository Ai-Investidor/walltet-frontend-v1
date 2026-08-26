export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL

// `VITE_API_BASE_URL` guarda só host+porta (ver .env.example) — o prefixo fixo da API entra aqui,
// não no .env, pra quem clonar o projeto não precisar saber desse detalhe (opção A da seção 1.1
// de docs/AUDITORIA-INTEGRACAO.md).
export const API_URL = `${API_BASE_URL}/api/v1`
