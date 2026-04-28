import { memo } from 'react'
import { FiGitBranch, FiStar } from 'react-icons/fi'
import type { Repository } from '@/types'
import { formatNumber, truncateText } from '@/utils/formatting'

interface RepoCardProps {
  repository: Repository
  onOpenDetails: (repository: Repository) => void
}

function RepoCardComponent({ repository, onOpenDetails }: RepoCardProps) {
  return (
    <article className="card github-card repo-card border-0 transition-all">
      <div className="card-body d-flex flex-column justify-content-between h-100 gap-2">
        <div className="d-flex justify-content-between align-items-start gap-2 min-w-0">
          <h3 className="h6 mb-0 text-break flex-grow-1 min-w-0 pe-1">
            {repository.name}
          </h3>
          <span className="badge rounded-pill text-bg-primary flex-shrink-0">
            <FiStar className="me-1" />
            {formatNumber(repository.stargazers_count)}
          </span>
        </div>
        <p className="text-secondary mb-0 repo-card-description">
          {truncateText(repository.description ?? 'Sem descrição disponível.', 120)}
        </p>
        <div className="d-flex flex-wrap justify-content-between align-items-center mt-auto pt-2 gap-2 w-100 min-w-0">
          <span className="badge bg-success-subtle text-success-emphasis border border-success-subtle text-break">
            <FiGitBranch className="me-1" />
            {repository.language ?? 'Sem linguagem'}
          </span>
          <button
            type="button"
            className="btn btn-sm btn-outline-primary flex-shrink-0"
            onClick={() => onOpenDetails(repository)}
          >
            Ver detalhes
          </button>
        </div>
      </div>
    </article>
  )
}

export const RepoCard = memo(RepoCardComponent)
