import axios from 'axios'

/** Erro já formatado para a UI (mensagem principal + detalhe opcional da API). */
export interface AppError {
  readonly message: string
  readonly detail?: string
}

interface GitHubErrorBody {
  message?: unknown
}

function readResponseHeader(headers: unknown, name: string): string | undefined {
  if (!headers || typeof headers !== 'object') {
    return undefined
  }

  const record = headers as Record<string, unknown>
  const value = record[name]
  if (typeof value === 'string') {
    return value
  }

  if (Array.isArray(value) && typeof value[0] === 'string') {
    return value[0]
  }

  return undefined
}

function extractGitHubApiMessage(responseData: unknown): string | undefined {
  if (
    responseData &&
    typeof responseData === 'object' &&
    responseData !== null
  ) {
    const raw = (responseData as GitHubErrorBody).message
    if (typeof raw === 'string' && raw.trim().length > 0) {
      return raw.trim()
    }
  }
  return undefined
}

function isRateLimitExceeded(
  status: number | undefined,
  apiMessage: string | undefined,
  remainingHeader: unknown,
): boolean {
  if (status !== 403) {
    return false
  }

  const rem =
    typeof remainingHeader === 'string'
      ? parseInt(remainingHeader, 10)
      : NaN

  if (!Number.isNaN(rem) && rem === 0) {
    return true
  }

  if (
    apiMessage &&
    /rate limit exceeded|secondary rate limit|abuse detection/i.test(
      apiMessage,
    )
  ) {
    return true
  }

  return false
}

function rateLimitResetHint(headers: unknown): string {
  const raw = readResponseHeader(headers, 'x-ratelimit-reset')
  if (raw == null || raw === '') {
    return ''
  }

  const sec = parseInt(raw, 10)

  if (Number.isNaN(sec)) {
    return ''
  }

  const date = new Date(sec * 1000)
  return ` Renovação do limite prevista por volta de ${date.toLocaleString(
    'pt-BR',
    { dateStyle: 'short', timeStyle: 'short' },
  )}.`
}

function authenticatedRequestHint(): string {
  const hasToken =
    typeof import.meta.env.VITE_GITHUB_TOKEN === 'string' &&
    import.meta.env.VITE_GITHUB_TOKEN.trim().length > 0

  if (hasToken) {
    return ' Você já usa VITE_GITHUB_TOKEN; aguarde a renovação do limite ou gere um novo token se o atual estiver comprometido ou expirado.'
  }

  return ' Você pode ampliar o limite criando um Personal Access Token (GitHub → Settings → Developer settings → Tokens): escopos de leitura pública bastam. Coloque-o no arquivo `.env` como `VITE_GITHUB_TOKEN=...` e reinicie o servidor de desenvolvimento.'
}

/** Normaliza falhas HTTP da API do GitHub em mensagens em português e opcionalmente repassa o texto da API. */
export function parseGitHubError(error: unknown): AppError {
  if (axios.isAxiosError(error)) {
    const status = error.response?.status
    const apiMessage = extractGitHubApiMessage(error.response?.data)
    const remaining = readResponseHeader(
      error.response?.headers,
      'x-ratelimit-remaining',
    )

    if (isRateLimitExceeded(status, apiMessage, remaining)) {
      return {
        message: `Limite de requisições da API do GitHub foi atingido.${rateLimitResetHint(
          error.response?.headers,
        )}${authenticatedRequestHint()}`,
        detail:
          apiMessage !== undefined ? `Resposta da API: ${apiMessage}` : undefined,
      }
    }

    if (status === 401) {
      return {
        message:
          'Não autorizado pela API do GitHub. Confira se o token em VITE_GITHUB_TOKEN está correto e ainda válido.',
        detail:
          apiMessage !== undefined ? `Resposta da API: ${apiMessage}` : undefined,
      }
    }

    if (status === 404) {
      return {
        message: 'Recurso não encontrado no GitHub.',
        detail:
          apiMessage !== undefined &&
          apiMessage !== 'Not Found'
            ? `Resposta da API: ${apiMessage}`
            : undefined,
      }
    }

    if (error.code === 'ECONNABORTED') {
      return { message: 'Tempo limite excedido. Tente novamente.' }
    }

    if (
      apiMessage !== undefined &&
      status !== undefined &&
      status >= 400
    ) {
      return {
        message:
          'Não foi possível concluir a operação na API do GitHub. Veja os detalhes abaixo.',
        detail: `Resposta da API: ${apiMessage}`,
      }
    }

    return {
      message: 'Erro ao comunicar com a API do GitHub.',
      detail:
        apiMessage !== undefined
          ? `Resposta da API: ${apiMessage}`
          : error.message.trim().length > 0
            ? error.message
            : undefined,
    }
  }

  if (error instanceof Error && error.message.trim().length > 0) {
    return { message: error.message }
  }

  return { message: 'Ocorreu um erro inesperado.' }
}

/** Compatibilidade com código que só precisa da string principal. */
export function getErrorMessage(error: unknown): string {
  return parseGitHubError(error).message
}
