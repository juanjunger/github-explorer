import { useEffect } from 'react'
import { Link, useParams } from 'react-router-dom'
import { RepositoryList } from '@/components/RepositoryList/RepositoryList'
import { UserProfile } from '@/components/UserProfile/UserProfile'
import { useGitHubUser } from '@/hooks/useGitHubUser'
import { useRepositories } from '@/hooks/useRepositories'

export function UserPage() {
  const { username } = useParams<{ username: string }>()
  const { user, isLoadingUser, userError, searchUser } = useGitHubUser()
  const {
    repositories,
    isLoadingRepositories,
    isLoadingMoreRepositories,
    hasMoreRepositories,
    repositoriesError,
    sortBy,
    setSortField,
    setSortDirection,
    fetchRepositories,
    fetchMoreRepositories,
  } = useRepositories()

  useEffect(() => {
    if (!username) {
      return
    }

    void searchUser(username)
    void fetchRepositories(username)
  }, [fetchRepositories, searchUser, username])

  return (
    <main className="page-shell">
      <div className="page-content d-grid gap-4">
        <Link to="/" className="btn btn-link p-0 text-start">
          Voltar para busca
        </Link>
        <UserProfile user={user} loading={isLoadingUser} error={userError} />
        <RepositoryList
          repositories={repositories}
          isLoading={isLoadingRepositories}
          isLoadingMore={isLoadingMoreRepositories}
          hasMore={hasMoreRepositories}
          error={repositoriesError}
          sortBy={sortBy}
          onChangeSortField={setSortField}
          onChangeSortDirection={setSortDirection}
          onLoadMore={() => void fetchMoreRepositories()}
        />
      </div>
    </main>
  )
}
