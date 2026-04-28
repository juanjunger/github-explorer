import { useCallback, useState } from 'react'
import { ErrorMessage } from '@/components/ErrorMessage/ErrorMessage'
import { LoadingSpinner } from '@/components/LoadingSpinner/LoadingSpinner'
import { RepoCard } from '@/components/RepositoryList/RepoCard'
import { RepositoryModal } from '@/components/RepositoryModal/RepositoryModal'
import type {
  Repository,
  RepositorySort,
  RepositorySortField,
  SortDirection,
} from '@/types'
import type { AppError } from '@/utils/errors'

interface RepositoryListProps {
  repositories: Repository[]
  isLoading: boolean
  isLoadingMore: boolean
  hasMore: boolean
  error: AppError | null
  sortBy: RepositorySort
  onChangeSortField: (field: RepositorySortField) => void
  onChangeSortDirection: (direction: SortDirection) => void
  onLoadMore: () => void
}

export function RepositoryList({
  repositories,
  isLoading,
  isLoadingMore,
  hasMore,
  error,
  sortBy,
  onChangeSortField,
  onChangeSortDirection,
  onLoadMore,
}: RepositoryListProps) {
  const [selectedRepository, setSelectedRepository] =
    useState<Repository | null>(null)

  const handleOpenRepositoryDetails = useCallback((repository: Repository) => {
    setSelectedRepository(repository)
  }, [])

  if (isLoading) {
    return <LoadingSpinner label="Carregando repositórios..." />
  }

  if (error) {
    return (
      <ErrorMessage
        title="Erro ao carregar repositórios"
        message={error.message}
        detail={error.detail}
      />
    )
  }

  return (
    <section>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2 className="h4 mb-0">Repositórios</h2>
        <div className="d-flex align-items-center gap-2 ms-auto">
          <select
            className="form-select w-auto"
            value={sortBy.field}
            onChange={(event) =>
              onChangeSortField(event.target.value as RepositorySortField)
            }
            aria-label="Ordenar repositórios por campo"
          >
            <option value="updated">Mais Recentes</option>
            <option value="stars">Stars</option>
            <option value="name">Nome</option>
          </select>
          <select
            className="form-select w-auto"
            value={sortBy.direction}
            onChange={(event) =>
              onChangeSortDirection(event.target.value as SortDirection)
            }
            aria-label="Ordenar repositórios por direção"
          >
            <option value="asc">Crescente</option>
            <option value="desc">Decrescente</option>
          </select>
        </div>
      </div>

      {repositories.length === 0 ? (
        <p className="text-secondary mb-0">
          Nenhum repositório encontrado para este usuário.
        </p>
      ) : (
        <>
          <div className="row g-3">
            {repositories.map((repository) => (
              <div key={repository.id} className="col-12 col-md-6 col-xl-4">
                <RepoCard
                  repository={repository}
                  onOpenDetails={handleOpenRepositoryDetails}
                />
              </div>
            ))}
          </div>

          {(hasMore || isLoadingMore) && (
            <div className="d-flex justify-content-center mt-4">
              <button
                type="button"
                className="btn btn-outline-primary px-4"
                onClick={onLoadMore}
                disabled={isLoadingMore}
              >
                {isLoadingMore ? 'Carregando mais...' : 'Ver mais repositórios'}
              </button>
            </div>
          )}
        </>
      )}

      {selectedRepository && (
        <RepositoryModal
          repository={selectedRepository}
          onClose={() => setSelectedRepository(null)}
        />
      )}
    </section>
  )
}
