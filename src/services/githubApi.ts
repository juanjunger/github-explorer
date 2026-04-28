import axios from 'axios'
import type { PaginatedUsers, Repository, User, UserSearchItem } from '@/types'

const API_BASE_URL = 'https://api.github.com'

const client = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
})

/** Token opcional: aumenta limite (~5000 req/h com token vs ~60 sem, por IP). */
function getGithubToken(): string | undefined {
  const token = import.meta.env.VITE_GITHUB_TOKEN?.trim()
  return token && token.length > 0 ? token : undefined
}

client.interceptors.request.use((config) => {
  const token = getGithubToken()
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

interface GitHubUserResponse {
  login: string
  avatar_url: string
  bio: string | null
  followers: number
  following: number
  public_repos: number
}

interface GitHubRepositoryResponse {
  id: number
  name: string
  description: string | null
  stargazers_count: number
  forks_count: number
  open_issues_count: number
  default_branch: string
  license: {
    name: string
  } | null
  topics: string[]
  homepage: string | null
  language: string | null
  html_url: string
  created_at: string
  updated_at: string
  owner: {
    login: string
  }
}

interface GitHubSearchUsersResponse {
  total_count: number
  items: {
    id: number
    login: string
    avatar_url: string
    html_url: string
  }[]
}

interface PaginatedRepositories {
  items: Repository[]
  hasNext: boolean
}

function readResponseHeader(headers: unknown, name: string): string | undefined {
  if (!headers || typeof headers !== 'object') {
    return undefined
  }

  const record = headers as Record<string, unknown>
  const rawValue = record[name]

  if (typeof rawValue === 'string') {
    return rawValue
  }

  if (Array.isArray(rawValue) && typeof rawValue[0] === 'string') {
    return rawValue[0]
  }

  return undefined
}

function mapUser(data: GitHubUserResponse): User {
  return {
    username: data.login,
    avatar_url: data.avatar_url,
    bio: data.bio ?? undefined,
    followers: data.followers,
    following: data.following,
    public_repos: data.public_repos,
  }
}

function mapRepository(data: GitHubRepositoryResponse): Repository {
  return {
    id: data.id,
    name: data.name,
    description: data.description ?? undefined,
    stargazers_count: data.stargazers_count,
    forks_count: data.forks_count,
    open_issues_count: data.open_issues_count,
    default_branch: data.default_branch,
    license_name: data.license?.name ?? undefined,
    topics: data.topics?.length ? data.topics : undefined,
    homepage: data.homepage ?? undefined,
    language: data.language ?? undefined,
    html_url: data.html_url,
    created_at: data.created_at,
    updated_at: data.updated_at,
    owner: {
      login: data.owner.login,
    },
  }
}

function mapSearchUserItem(
  data: GitHubSearchUsersResponse['items'][number],
): UserSearchItem {
  return {
    id: data.id,
    username: data.login,
    avatar_url: data.avatar_url,
    profile_url: data.html_url,
  }
}

function buildSearchQuery(query: string): string {
  const normalizedTerms = query
    .trim()
    .toLowerCase()
    .split(/\s+/)
    .filter((term) => term.length > 0)

  return `${normalizedTerms.join(' ')} in:login`
}

function extractSearchTerms(query: string): string[] {
  return query
    .toLowerCase()
    .split(/\s+/)
    .map((term) => term.replace(/[^a-z0-9]/g, ''))
    .filter((term) => term.length > 0)
}

function matchesAllSearchTerms(username: string, terms: string[]): boolean {
  if (terms.length === 0) {
    return true
  }

  const normalizedUsername = username.toLowerCase().replace(/[^a-z0-9]/g, '')
  return terms.every((term) => normalizedUsername.includes(term))
}

export const githubApi = {
  async getUser(username: string): Promise<User> {
    const { data } = await client.get<GitHubUserResponse>(`/users/${username}`)
    return mapUser(data)
  },

  async getUserRepositories(
    username: string,
    page: number,
    perPage: number,
  ): Promise<PaginatedRepositories> {
    const response = await client.get<GitHubRepositoryResponse[]>(
      `/users/${username}/repos`,
      {
        params: {
          page,
          per_page: perPage,
        },
      },
    )

    const linkHeader = readResponseHeader(response.headers, 'link')
    const hasNext = typeof linkHeader === 'string' && linkHeader.includes('rel="next"')

    return {
      items: response.data.map(mapRepository),
      hasNext,
    }
  },

  async getRepositoryDetails(owner: string, repo: string): Promise<Repository> {
    const { data } = await client.get<GitHubRepositoryResponse>(
      `/repos/${owner}/${repo}`,
    )
    return mapRepository(data)
  },

  async searchUsers(
    query: string,
    page: number,
    perPage: number,
  ): Promise<PaginatedUsers> {
    const normalizedTerms = query
      .trim()
      .toLowerCase()
      .split(/\s+/)
      .filter((term) => term.length > 0)

    const compactQuery = normalizedTerms.join('')
    const searchQueries = new Set<string>([buildSearchQuery(query)])
    if (normalizedTerms.length > 1 && compactQuery.length > 0) {
      searchQueries.add(`${compactQuery} in:login`)
    }

    const responses = await Promise.all(
      [...searchQueries].map(async (searchQuery) => {
        const { data } = await client.get<GitHubSearchUsersResponse>('/search/users', {
          params: {
            q: searchQuery,
            page,
            per_page: perPage,
          },
        })
        return data
      }),
    )

    const uniqueUsersMap = new Map<number, UserSearchItem>()
    const terms = extractSearchTerms(query)

    for (const response of responses) {
      for (const item of response.items) {
        const mappedItem = mapSearchUserItem(item)
        if (matchesAllSearchTerms(mappedItem.username, terms)) {
          uniqueUsersMap.set(mappedItem.id, mappedItem)
        }
      }
    }

    const mergedItems = [...uniqueUsersMap.values()]
    const totalCount = Math.max(...responses.map((response) => response.total_count), 0)

    return {
      items: mergedItems,
      totalCount,
      page,
      perPage,
    }
  },
}
