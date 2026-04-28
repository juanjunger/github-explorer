import { useNavigate } from 'react-router-dom'
import { FiArrowRight } from 'react-icons/fi'
import type { User } from '@/types'
import { formatNumber } from '@/utils/formatting'

interface UserPreviewCardProps {
  user: User
}

export function UserPreviewCard({ user }: UserPreviewCardProps) {
  const navigate = useNavigate()

  return (
    <section className="card github-card border-0 shadow-sm">
      <div className="card-body d-flex flex-column flex-md-row align-items-start gap-3">
        <img
          src={user.avatar_url}
          alt={`Avatar de ${user.username}`}
          width={88}
          height={88}
          className="rounded-circle border border-secondary-subtle"
        />
        <div className="flex-grow-1">
          <h2 className="h4 mb-1">{user.username}</h2>
          <p className="text-secondary mb-3">{user.bio ?? 'Sem bio disponível.'}</p>
          <div className="d-flex flex-wrap gap-3 mb-3">
            <span>
              <strong>{formatNumber(user.followers)}</strong> seguidores
            </span>
            <span>
              <strong>{formatNumber(user.following)}</strong> seguindo
            </span>
          </div>
          <button
            type="button"
            className="btn btn-primary"
            onClick={() => navigate(`/user/${user.username}`)}
          >
            Ver perfil completo <FiArrowRight className="ms-1" />
          </button>
        </div>
      </div>
    </section>
  )
}
