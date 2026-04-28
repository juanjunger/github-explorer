import { useCallback, useMemo, useState } from 'react'
import { githubApi } from '@/services/githubApi'
import type { Repository, RepositorySort, RepositorySortField, SortDirection } from '@/types'
import { parseGitHubError, type AppError } from '@/utils/errors'
import { sortRepositories } from '@/utils/repository'

const REPOSITORIES_PER_PAGE = 18

interface UseRepositoriesResult {
  repositories: Repository[]
  isLoadingRepositories: boolean
  isLoadingMoreRepositories: boolean
  hasMoreRepositories: boolean
  repositoriesError: AppError | null
  sortBy: RepositorySort
  setSortField: (field: RepositorySortField) => void
  setSortDirection: (direction: SortDirection) => void
  fetchRepositories: (username: string) => Promise<void>
  fetchMoreRepositories: () => Promise<void>
}

export function useRepositories(): UseRepositoriesResult {
  const [repositories, setRepositories] = useState<Repository[]>([])
  const [isLoadingRepositories, setIsLoadingRepositories] = useState(false)
  const [isLoadingMoreRepositories, setIsLoadingMoreRepositories] = useState(false)
  const [hasMoreRepositories, setHasMoreRepositories] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [currentUsername, setCurrentUsername] = useState('')
  const [repositoriesError, setRepositoriesError] =
    useState<AppError | null>(null)
  const [sortBy, setSortBy] = useState<RepositorySort>({
    field: 'stars',
    direction: 'desc',
  })

  const fetchRepositories = useCallback(async (username: string) => {
    const normalizedUsername = username.trim()
    if (!normalizedUsername) {
      setRepositories([])
      setCurrentUsername('')
      setCurrentPage(1)
      setHasMoreRepositories(false)
      setRepositoriesError(null)
      return
    }

    setIsLoadingRepositories(true)
    setRepositoriesError(null)
    setCurrentUsername(normalizedUsername)
    setCurrentPage(1)

    try {
      const response = await githubApi.getUserRepositories(
        normalizedUsername,
        1,
        REPOSITORIES_PER_PAGE,
      )
      setRepositories(response.items)
      setHasMoreRepositories(response.hasNext)
    } catch (error) {
      setRepositories([])
      setHasMoreRepositories(false)
      setRepositoriesError(parseGitHubError(error))
    } finally {
      setIsLoadingRepositories(false)
    }
  }, [])

  const fetchMoreRepositories = useCallback(async () => {
    if (
      isLoadingRepositories ||
      isLoadingMoreRepositories ||
      !hasMoreRepositories ||
      !currentUsername
    ) {
      return
    }

    setIsLoadingMoreRepositories(true)
    setRepositoriesError(null)

    const nextPage = currentPage + 1

    try {
      const response = await githubApi.getUserRepositories(
        currentUsername,
        nextPage,
        REPOSITORIES_PER_PAGE,
      )

      setRepositories((current) => [...current, ...response.items])
      setCurrentPage(nextPage)
      setHasMoreRepositories(response.hasNext)
    } catch (error) {
      setRepositoriesError(parseGitHubError(error))
    } finally {
      setIsLoadingMoreRepositories(false)
    }
  }, [
    currentPage,
    currentUsername,
    hasMoreRepositories,
    isLoadingMoreRepositories,
    isLoadingRepositories,
  ])

  const sortedRepositories = useMemo(
    () => sortRepositories(repositories, sortBy),
    [repositories, sortBy],
  )

  return {
    repositories: sortedRepositories,
    isLoadingRepositories,
    isLoadingMoreRepositories,
    hasMoreRepositories,
    repositoriesError,
    sortBy,
    setSortField: (field) => setSortBy((current) => ({ ...current, field })),
    setSortDirection: (direction) =>
      setSortBy((current) => ({ ...current, direction })),
    fetchRepositories,
    fetchMoreRepositories,
  }
}
