import { ErrorMessage } from '@/components/ErrorMessage/ErrorMessage'
import { LoadingSpinner } from '@/components/LoadingSpinner/LoadingSpinner'
import type { Repository } from '@/types'
import type { AppError } from '@/utils/errors'
import { formatNumber } from '@/utils/formatting'

interface RepositoryDetailsProps {
  repository: Repository | null
  isLoading: boolean
  error: AppError | null
}

export function RepositoryDetails({
  repository,
  isLoading,
  error,
}: RepositoryDetailsProps) {
  if (isLoading) {
    return <LoadingSpinner label="Carregando repositório..." />
  }

  if (error) {
    return (
      <ErrorMessage
        title="Erro ao carregar repositório"
        message={error.message}
        detail={error.detail}
      />
    )
  }

  if (!repository) {
    return <p className="text-muted">Repositório não encontrado.</p>
  }

  return (
    <section className="card github-card border-0 shadow-sm overflow-hidden">
      <div className="card-body p-4 p-md-5 d-grid gap-3">
        <div className="d-flex justify-content-between align-items-start flex-wrap gap-2">
          <h1 className="h2 mb-0">{repository.name}</h1>
          <span className="badge text-bg-primary rounded-pill px-3 py-2">
            {formatNumber(repository.stargazers_count)} stars
          </span>
        </div>

        <p className="text-secondary mb-0">
          {repository.description ?? 'Este repositório não possui descrição.'}
        </p>

        <div className="d-flex flex-wrap gap-2 mt-1">
          <span className="badge rounded-pill bg-dark-subtle text-light border border-secondary">
            Owner: {repository.owner.login}
          </span>
          <span className="badge rounded-pill bg-success-subtle text-success-emphasis border border-success-subtle">
            Linguagem: {repository.language ?? 'Não informado'}
          </span>
        </div>

        <a
          href={repository.html_url}
          target="_blank"
          rel="noreferrer"
          className="btn btn-primary mt-2 justify-self-start"
        >
          Abrir no GitHub
        </a>
      </div>
    </section>
  )
}
