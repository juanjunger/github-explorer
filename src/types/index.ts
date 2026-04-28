export interface User {
  username: string
  avatar_url: string
  bio?: string
  followers: number
  following: number
  public_repos: number
}

export interface Repository {
  id: number
  name: string
  description?: string
  stargazers_count: number
  forks_count?: number
  open_issues_count?: number
  default_branch?: string
  license_name?: string
  topics?: string[]
  homepage?: string
  language?: string
  html_url: string
  created_at?: string
  updated_at?: string
  owner: {
    login: string
  }
}

export interface UserSearchItem {
  id: number
  username: string
  avatar_url: string
  profile_url: string
}

export interface PaginatedUsers {
  items: UserSearchItem[]
  totalCount: number
  page: number
  perPage: number
}

export type RepositorySortField = 'stars' | 'updated' | 'name'
export type SortDirection = 'asc' | 'desc'

export interface RepositorySort {
  field: RepositorySortField
  direction: SortDirection
}
