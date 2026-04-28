import { fireEvent, render, screen, within } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { RepositoryList } from '@/components/RepositoryList/RepositoryList'
import type { Repository } from '@/types'

const repositoriesFixture: Repository[] = [
  {
    id: 1,
    name: 'zeta',
    stargazers_count: 12,
    html_url: 'https://github.com/mock/zeta',
    owner: { login: 'mock' },
    updated_at: '2025-01-03T12:00:00Z',
  },
  {
    id: 2,
    name: 'alpha',
    stargazers_count: 99,
    html_url: 'https://github.com/mock/alpha',
    owner: { login: 'mock' },
    updated_at: '2025-01-04T12:00:00Z',
  },
]

function renderList(onChangeSortField = vi.fn(), onChangeSortDirection = vi.fn()) {
  return render(
    <RepositoryList
      repositories={repositoriesFixture}
      isLoading={false}
      isLoadingMore={false}
      hasMore={false}
      error={null}
      sortBy={{ field: 'stars', direction: 'desc' }}
      onChangeSortField={onChangeSortField}
      onChangeSortDirection={onChangeSortDirection}
      onLoadMore={vi.fn()}
    />,
  )
}

describe('RepositoryList', () => {
  it('renderiza a lista de repositórios', () => {
    renderList()

    expect(screen.getByRole('heading', { name: /repositórios/i })).toBeVisible()
    expect(screen.getByText('alpha')).toBeVisible()
    expect(screen.getByText('zeta')).toBeVisible()
  })

  it('chama callback ao trocar ordenação', () => {
    const onChangeSortField = vi.fn()
    renderList(onChangeSortField)

    fireEvent.change(screen.getByLabelText(/ordenar repositórios por campo/i), {
      target: { value: 'name' },
    })

    expect(onChangeSortField).toHaveBeenCalledWith('name')
  })

  it('abre modal de detalhes ao clicar no item', () => {
    renderList()

    fireEvent.click(screen.getAllByRole('button', { name: /ver detalhes/i })[0])

    const modal = screen.getByRole('dialog')
    expect(modal).toBeVisible()
    expect(within(modal).getByRole('heading', { name: 'zeta' })).toBeVisible()
  })

  it('fecha modal ao clicar no botão de fechar', () => {
    renderList()

    fireEvent.click(screen.getAllByRole('button', { name: /ver detalhes/i })[0])
    fireEvent.click(screen.getByRole('button', { name: /fechar detalhes/i }))

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })

  it('exibe botão de ver mais e chama callback', () => {
    const onLoadMore = vi.fn()

    render(
      <RepositoryList
        repositories={repositoriesFixture}
        isLoading={false}
        isLoadingMore={false}
        hasMore
        error={null}
        sortBy={{ field: 'stars', direction: 'desc' }}
        onChangeSortField={vi.fn()}
        onChangeSortDirection={vi.fn()}
        onLoadMore={onLoadMore}
      />,
    )

    fireEvent.click(screen.getByRole('button', { name: /ver mais repositórios/i }))
    expect(onLoadMore).toHaveBeenCalledTimes(1)
  })
})
