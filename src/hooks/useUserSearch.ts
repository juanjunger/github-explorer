import { useCallback, useState } from 'react'
import { githubApi } from '@/services/githubApi'
import type { PaginatedUsers } from '@/types'
import { parseGitHubError, type AppError } from '@/utils/errors'

const DEFAULT_PER_PAGE = 20

interface UseUserSearchResult {
  result: PaginatedUsers | null
  isLoading: boolean
  error: AppError | null
  currentQuery: string
  search: (query: string, page?: number) => Promise<void>
  goToPage: (page: number) => Promise<void>
}

export function useUserSearch(): UseUserSearchResult {
  const [result, setResult] = useState<PaginatedUsers | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<AppError | null>(null)
  const [currentQuery, setCurrentQuery] = useState('')

  const search = useCallback(async (query: string, page = 1) => {
    const normalizedQuery = query.trim()
    if (!normalizedQuery) {
      setCurrentQuery('')
      setResult(null)
      setError(null)
      return
    }

    setIsLoading(true)
    setError(null)
    setCurrentQuery(normalizedQuery)

    try {
      const data = await githubApi.searchUsers(normalizedQuery, page, DEFAULT_PER_PAGE)
      setResult(data)
    } catch (searchError) {
      setResult(null)
      setError(parseGitHubError(searchError))
    } finally {
      setIsLoading(false)
    }
  }, [])

  const goToPage = useCallback(
    async (page: number) => {
      if (!currentQuery) {
        return
      }

      await search(currentQuery, page)
    },
    [currentQuery, search],
  )

  return { result, isLoading, error, currentQuery, search, goToPage }
}
