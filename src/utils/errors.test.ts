import { AxiosError, type InternalAxiosRequestConfig } from 'axios'
import { describe, expect, it, vi } from 'vitest'
import { parseGitHubError } from '@/utils/errors'

const emptyConfig = {} as InternalAxiosRequestConfig

describe('parseGitHubError', () => {
  it('trata rate limit (403 + mensagem) com texto da API em detail', () => {
    const apiBody = {
      message:
        'API rate limit exceeded for 1.2.3.4. Authenticated requests get a higher limit.',
    }

    const err = new AxiosError(
      'Request failed with status code 403',
      'ERR_BAD_REQUEST',
      emptyConfig,
      {},
      {
        status: 403,
        statusText: 'Forbidden',
        data: apiBody,
        headers: { 'x-ratelimit-reset': '2000000000' },
        config: emptyConfig,
      },
    )

    vi.stubEnv('VITE_GITHUB_TOKEN', '')
    const out = parseGitHubError(err)
    expect(out.message).toContain('Limite de requisições')
    expect(out.message).toContain('Personal Access Token')
    expect(out.detail).toContain('Resposta da API:')
    expect(out.detail).toContain(apiBody.message)

    vi.unstubAllEnvs()
  })

  it('mensagem genérica quando a API inclui erro no corpo', () => {
    const err = new AxiosError(
      'Request failed',
      'ERR_BAD_REQUEST',
      emptyConfig,
      {},
      {
        status: 500,
        statusText: 'Server Error',
        data: { message: 'Server Error' },
        headers: {},
        config: emptyConfig,
      },
    )

    const out = parseGitHubError(err)
    expect(out.message).toContain('Não foi possível concluir')
    expect(out.detail).toContain('Server Error')
  })

  it('404 sem poluir detail com "Not Found" redundante', () => {
    const err = new AxiosError(
      'Request failed',
      'ERR_BAD_REQUEST',
      emptyConfig,
      {},
      {
        status: 404,
        statusText: 'Not Found',
        data: { message: 'Not Found' },
        headers: {},
        config: emptyConfig,
      },
    )

    const out = parseGitHubError(err)
    expect(out.message).toContain('não encontrado')
    expect(out.detail).toBeUndefined()
  })
})
