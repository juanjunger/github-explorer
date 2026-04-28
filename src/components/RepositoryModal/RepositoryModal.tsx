import { FiExternalLink, FiGitBranch, FiGitPullRequest, FiStar, FiX } from 'react-icons/fi'
import type { Repository } from '@/types'
import { formatNumber } from '@/utils/formatting'

interface RepositoryModalProps {
  repository: Repository
  onClose: () => void
}

function normalizeExternalUrl(url: string): string {
  const trimmedUrl = url.trim()
  if (/^https?:\/\//i.test(trimmedUrl)) {
    return trimmedUrl
  }

  return `https://${trimmedUrl}`
}

export function RepositoryModal({ repository, onClose }: RepositoryModalProps) {
  return (
    <div
      className="repo-modal-backdrop"
      onClick={(event) => {
        if (event.target === event.currentTarget) {
          onClose()
        }
      }}
      onKeyDown={(event) => {
        if (event.key === 'Enter' || event.key === ' ') {
          onClose()
        }
      }}
      role="button"
      tabIndex={0}
      aria-label="Fechar modal de detalhes"
    >
      <section
        className="repo-modal-panel"
        role="dialog"
        aria-modal="true"
        aria-label={`Detalhes do repositório ${repository.name}`}
      >
        <button
          type="button"
          className="repo-modal-close"
          onClick={onClose}
          aria-label="Fechar detalhes"
        >
          <FiX />
        </button>

        <div className="repo-modal-section repo-modal-section--header">
          <h3 className="h3 mb-2">{repository.name}</h3>
          <p className="text-secondary mb-0">
            {repository.description ?? 'Este repositório não possui descrição.'}
          </p>
        </div>

        <div className="repo-modal-section">
          <p className="repo-modal-section__label">Métricas</p>
          <div className="d-flex flex-wrap gap-2">
            <span className="badge text-bg-primary rounded-pill">
              <FiStar className="me-1" />
              {formatNumber(repository.stargazers_count)} stars
            </span>
            <span className="badge rounded-pill bg-info-subtle text-info-emphasis border border-info-subtle">
              <FiGitBranch className="me-1" />
              {formatNumber(repository.forks_count ?? 0)} forks
            </span>
            <span className="badge rounded-pill bg-warning-subtle text-warning-emphasis border border-warning-subtle">
              <FiGitPullRequest className="me-1" />
              {formatNumber(repository.open_issues_count ?? 0)} issues
            </span>
          </div>
        </div>

        <div className="repo-modal-section">
          <p className="repo-modal-section__label">Informações técnicas</p>
          <div className="d-flex flex-wrap gap-2">
            <span className="badge rounded-pill bg-success-subtle text-success-emphasis border border-success-subtle">
              {repository.language ?? 'Sem linguagem'}
            </span>
            {repository.default_branch && (
              <span className="badge rounded-pill badge-branch">
                Branch: {repository.default_branch}
              </span>
            )}
            {repository.license_name && (
              <span className="badge rounded-pill bg-secondary-subtle text-secondary-emphasis border border-secondary-subtle">
                Licença: {repository.license_name}
              </span>
            )}
          </div>
        </div>

        {((repository.topics?.length ?? 0) > 0 || repository.homepage != null) && (
          <div className="repo-modal-section">
            {repository.topics && repository.topics.length > 0 && (
              <>
                <p className="repo-modal-section__label">Tópicos</p>
                <div className="d-flex flex-wrap gap-2 mb-2">
                  {repository.topics.slice(0, 4).map((topic) => (
                    <span
                      key={topic}
                      className="badge rounded-pill bg-primary-subtle text-primary-emphasis border border-primary-subtle"
                    >
                      {topic}
                    </span>
                  ))}
                </div>
              </>
            )}

            {repository.homepage && (
              <a
                href={normalizeExternalUrl(repository.homepage)}
                target="_blank"
                rel="noreferrer"
                className="repo-modal-homepage text-secondary small"
              >
                Projeto/Homepage: {repository.homepage}
              </a>
            )}
          </div>
        )}

        <div className="repo-modal-section repo-modal-section--footer">
          <a
            href={repository.html_url}
            target="_blank"
            rel="noreferrer"
            className="btn btn-primary"
          >
            Abrir no GitHub <FiExternalLink className="ms-1" />
          </a>
        </div>
      </section>
    </div>
  )
}
