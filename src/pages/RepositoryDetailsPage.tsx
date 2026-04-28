import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { RepositoryDetails } from '@/components/RepositoryDetails/RepositoryDetails'
import { githubApi } from '@/services/githubApi'
import type { Repository } from '@/types'
import { parseGitHubError, type AppError } from '@/utils/errors'

export function RepositoryDetailsPage() {
  const { username, repoName } = useParams<{
    username: string
    repoName: string
  }>()
  const [repository, setRepository] = useState<Repository | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<AppError | null>(null)

  useEffect(() => {
    const fetchRepositoryDetails = async () => {
      if (!username || !repoName) {
        return
      }

      setIsLoading(true)
      setError(null)

      try {
        const repositoryData = await githubApi.getRepositoryDetails(
          username,
          repoName,
        )
        setRepository(repositoryData)
      } catch (fetchError) {
        setError(parseGitHubError(fetchError))
        setRepository(null)
      } finally {
        setIsLoading(false)
      }
    }

    void fetchRepositoryDetails()
  }, [repoName, username])

  return (
    <main className="page-shell">
      <div className="page-content d-grid gap-4">
        <Link to={`/user/${username ?? ''}`} className="btn btn-link p-0 text-start">
          Voltar para usuário
        </Link>
        <RepositoryDetails
          repository={repository}
          isLoading={isLoading}
          error={error}
        />
      </div>
    </main>
  )
}
