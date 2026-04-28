import { ErrorMessage } from '@/components/ErrorMessage/ErrorMessage'
import { LoadingSpinner } from '@/components/LoadingSpinner/LoadingSpinner'
import type { User } from '@/types'
import type { AppError } from '@/utils/errors'
import { formatNumber } from '@/utils/formatting'

interface UserProfileProps {
  user: User | null
  loading: boolean
  error: AppError | null
}

export function UserProfile({ user, loading, error }: UserProfileProps) {
  if (loading) {
    return <LoadingSpinner label="Carregando usuário..." />
  }

  if (error) {
    return (
      <ErrorMessage
        title="Erro ao carregar perfil"
        message={error.message}
        detail={error.detail}
      />
    )
  }

  if (!user) {
    return null
  }

  return (
    <section className="card github-card border-0 shadow-sm">
      <div className="card-body d-flex flex-column flex-md-row gap-3 align-items-start">
        <img
          src={user.avatar_url}
          alt={`Avatar de ${user.username}`}
          width={120}
          height={120}
          className="rounded-circle border"
        />
        <div className="flex-grow-1">
          <h1 className="h3 mb-2">{user.username}</h1>
          {user.bio && <p className="text-secondary mb-3">{user.bio}</p>}
          <div className="d-flex flex-wrap align-items-center gap-3 gap-md-4">
            <div>
              <span className="fw-semibold">Followers:</span>{' '}
              {formatNumber(user.followers)}
            </div>
            <div>
              <span className="fw-semibold">Following:</span>{' '}
              {formatNumber(user.following)}
            </div>
            <div>
              <span className="fw-semibold">Repos:</span>{' '}
              {formatNumber(user.public_repos)}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
