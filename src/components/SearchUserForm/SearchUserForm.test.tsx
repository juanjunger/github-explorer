import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { SearchUserForm } from '@/components/SearchUserForm/SearchUserForm'

describe('SearchUserForm', () => {
  it('dispara onSearch com query normalizada', async () => {
    const onSearch = vi.fn()
    const user = userEvent.setup()

    render(<SearchUserForm onSearch={onSearch} />)

    await user.type(screen.getByLabelText(/username do github/i), '  juan junger  ')
    await user.click(screen.getByRole('button', { name: /^Buscar$/ }))

    expect(onSearch).toHaveBeenCalledWith('juan junger')
  })

  it('mostra mensagem de erro para query inválida', async () => {
    const onSearch = vi.fn()
    const user = userEvent.setup()

    render(<SearchUserForm onSearch={onSearch} />)

    await user.type(screen.getByLabelText(/username do github/i), 'a')
    await user.click(screen.getByRole('button', { name: /^Buscar$/ }))

    expect(
      screen.getByText(/informe ao menos 2 caracteres/i),
    ).toBeVisible()
    expect(onSearch).not.toHaveBeenCalled()
  })

  it('desabilita botão quando loading está ativo', () => {
    render(<SearchUserForm onSearch={vi.fn()} isLoading />)

    expect(screen.getByRole('button', { name: /buscando/i })).toBeDisabled()
  })
})
