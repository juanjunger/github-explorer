import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import { MemoryRouter } from 'react-router-dom'
import { http, HttpResponse } from 'msw'
import { HomePage } from '@/pages/HomePage'
import { server } from '@/test/mocks/server'

const GITHUB_API = 'https://api.github.com'

function renderHomePage() {
  render(
    <MemoryRouter
      initialEntries={['/']}
      future={{
        v7_startTransition: true,
        v7_relativeSplatPath: true,
      }}
    >
      <HomePage />
    </MemoryRouter>,
  )
}

describe('HomePage integration', () => {
  it('mostra estado vazio amigável quando não encontra usuários', async () => {
    const user = userEvent.setup()
    renderHomePage()

    await user.type(screen.getByLabelText(/username do github/i), 'naoencontrado')
    await user.click(screen.getByRole('button', { name: /^Buscar$/ }))

    await waitFor(() => {
      expect(
        screen.getByText(/nenhum usuário encontrado para/i),
      ).toBeVisible()
    })
  })

  it('mostra paginação quando existem múltiplas páginas', async () => {
    const user = userEvent.setup()
    server.use(
      http.get(`${GITHUB_API}/search/users`, ({ request }) => {
        const url = new URL(request.url)
        const page = Number(url.searchParams.get('page') ?? 1)

        return HttpResponse.json({
          total_count: 40,
          items: [
            {
              id: page,
              login: `mockuser-${page}`,
              avatar_url: `https://avatars.githubusercontent.com/u/${page}?v=4`,
              html_url: `https://github.com/mockuser-${page}`,
            },
          ],
        })
      }),
    )

    renderHomePage()

    await user.type(screen.getByLabelText(/username do github/i), 'mockuser')
    await user.click(screen.getByRole('button', { name: /^Buscar$/ }))

    await waitFor(() => {
      expect(
        screen.getByRole('navigation', { name: /paginação de usuários/i }),
      ).toBeVisible()
    })
  })
})
