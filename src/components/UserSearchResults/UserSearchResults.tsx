import { Link } from 'react-router-dom'
import type { PaginatedUsers } from '@/types'

interface UserSearchResultsProps {
  query: string
  result: PaginatedUsers
  onChangePage: (page: number) => void
}

export function UserSearchResults({
  query,
  result,
  onChangePage,
}: UserSearchResultsProps) {
  const totalPages = Math.max(1, Math.ceil(result.totalCount / result.perPage))
  const hasPrevious = result.page > 1
  const hasNext = result.page < totalPages

  return (
    <section className="d-grid gap-3">
      <div className="d-flex justify-content-between align-items-center">
        <p className="mb-0 text-secondary">
          {result.totalCount.toLocaleString('pt-BR')} usuários encontrados para{' '}
          &quot;{query}&quot;
        </p>
        <small className="text-secondary">
          Página {result.page} de {totalPages}
        </small>
      </div>

      <div className="d-grid gap-2">
        {result.items.map((user) => (
          <article
            key={user.id}
            className="github-card d-flex align-items-center gap-3 p-3"
          >
            <img
              src={user.avatar_url}
              alt={`Avatar de ${user.username}`}
              width={64}
              height={64}
              className="rounded-circle"
            />
            <div className="flex-grow-1">
              <h2 className="h4 mb-1">{user.username}</h2>
              <a href={user.profile_url} target="_blank" rel="noreferrer">
                Ver no GitHub
              </a>
            </div>
            <Link to={`/user/${user.username}`} className="btn btn-outline-primary">
              Ver perfil
            </Link>
          </article>
        ))}
      </div>

      {totalPages > 1 && (
        <nav
          className="d-flex justify-content-center align-items-center gap-2"
          aria-label="Paginação de usuários"
        >
          <button
            type="button"
            className="btn btn-outline-primary"
            disabled={!hasPrevious}
            onClick={() => onChangePage(result.page - 1)}
          >
            Anterior
          </button>
          <button
            type="button"
            className="btn btn-outline-primary"
            disabled={!hasNext}
            onClick={() => onChangePage(result.page + 1)}
          >
            Próxima
          </button>
        </nav>
      )}
    </section>
  )
}
