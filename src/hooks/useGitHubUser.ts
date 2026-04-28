import { useCallback, useState } from 'react'
import { githubApi } from '@/services/githubApi'
import type { User } from '@/types'
import { parseGitHubError, type AppError } from '@/utils/errors'

interface UseGitHubUserResult {
  user: User | null
  isLoadingUser: boolean
  userError: AppError | null
  searchUser: (username: string) => Promise<void>
}

export function useGitHubUser(): UseGitHubUserResult {
  const [user, setUser] = useState<User | null>(null)
  const [isLoadingUser, setIsLoadingUser] = useState(false)
  const [userError, setUserError] = useState<AppError | null>(null)

  const searchUser = useCallback(async (username: string) => {
    setIsLoadingUser(true)
    setUserError(null)

    try {
      const userData = await githubApi.getUser(username)
      setUser(userData)
    } catch (error) {
      setUser(null)
      setUserError(parseGitHubError(error))
    } finally {
      setIsLoadingUser(false)
    }
  }, [])

  return { user, isLoadingUser, userError, searchUser }
}
