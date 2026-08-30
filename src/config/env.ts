// Normaliza `VITE_API_BASE_URL` pra blindar contra erro de configuração no ambiente de deploy
// (env var setada sem `https://` ou já incluindo `/api/v1`), que quebrava a URL final de duas
// formas: 1) sem protocolo, o axios/browser trata o valor como path relativo — a requisição vai
// pro próprio domínio do front em vez de um host separado; 2) com `/api/v1` já embutido, o sufixo
// fixo abaixo duplicava o prefixo na URL final.
const rawBaseUrl = (import.meta.env.VITE_API_BASE_URL ?? '').trim()

const withProtocol = /^https?:\/\//i.test(rawBaseUrl) ? rawBaseUrl : `https://${rawBaseUrl}`

export const API_BASE_URL = withProtocol.replace(/\/+$/, '')

// `VITE_API_BASE_URL` guarda só host+porta (ver .env.example) — o prefixo fixo da API entra aqui,
// não no .env, pra quem clonar o projeto não precisar saber desse detalhe (opção A da seção 1.1
// de docs/AUDITORIA-INTEGRACAO.md).
export const API_URL = `${API_BASE_URL.replace(/\/api\/v1\/?$/i, '')}/api/v1`
