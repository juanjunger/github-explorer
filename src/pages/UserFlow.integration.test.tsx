import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { HomePage } from '@/pages/HomePage'
import { UserPage } from '@/pages/UserPage'

describe('Fluxo de busca de usuário', () => {
  it('busca usuário, mostra preview e navega para perfil completo', async () => {
    const user = userEvent.setup()

    render(
      <MemoryRouter
        initialEntries={['/']}
        future={{
          v7_startTransition: true,
          v7_relativeSplatPath: true,
        }}
      >
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/user/:username" element={<UserPage />} />
        </Routes>
      </MemoryRouter>,
    )

    await user.type(screen.getByLabelText(/username do github/i), 'mockuser')
    await user.click(screen.getByRole('button', { name: /^Buscar$/ }))

    await waitFor(() => {
      expect(screen.getByRole('heading', { name: 'mockuser' })).toBeVisible()
    })

    await user.click(screen.getAllByRole('link', { name: /ver perfil/i })[0])

    expect(screen.getByRole('heading', { name: /repositórios/i })).toBeVisible()
    expect(screen.getByText('awesome-repo')).toBeVisible()
  })
})
