import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { MemoryRouter } from 'react-router-dom'
import { UserSearchResults } from '@/components/UserSearchResults/UserSearchResults'
import type { PaginatedUsers } from '@/types'

const baseResult: PaginatedUsers = {
  items: [
    {
      id: 1,
      username: 'mockuser',
      avatar_url: 'https://avatars.githubusercontent.com/u/1?v=4',
      profile_url: 'https://github.com/mockuser',
    },
  ],
  totalCount: 1,
  page: 1,
  perPage: 20,
}

describe('UserSearchResults', () => {
  it('não renderiza paginação quando só existe uma página', () => {
    render(
      <MemoryRouter
        future={{
          v7_startTransition: true,
          v7_relativeSplatPath: true,
        }}
      >
        <UserSearchResults query="mockuser" result={baseResult} onChangePage={vi.fn()} />
      </MemoryRouter>,
    )

    expect(
      screen.queryByRole('navigation', { name: /paginação de usuários/i }),
    ).not.toBeInTheDocument()
  })

  it('renderiza paginação e chama callback ao clicar em próxima', () => {
    const onChangePage = vi.fn()
    render(
      <MemoryRouter
        future={{
          v7_startTransition: true,
          v7_relativeSplatPath: true,
        }}
      >
        <UserSearchResults
          query="mockuser"
          result={{ ...baseResult, totalCount: 40 }}
          onChangePage={onChangePage}
        />
      </MemoryRouter>,
    )

    fireEvent.click(screen.getByRole('button', { name: /próxima/i }))

    expect(onChangePage).toHaveBeenCalledWith(2)
  })
})
