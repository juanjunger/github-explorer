import type { Repository, RepositorySort } from '@/types'

export function sortRepositories(
  repositories: Repository[],
  sortBy: RepositorySort,
): Repository[] {
  const repositoriesCopy = [...repositories]
  const directionFactor = sortBy.direction === 'asc' ? 1 : -1

  switch (sortBy.field) {
    case 'updated':
      return repositoriesCopy.sort((left, right) => {
        const leftDate = left.updated_at ? Date.parse(left.updated_at) : 0
        const rightDate = right.updated_at ? Date.parse(right.updated_at) : 0

        return (leftDate - rightDate) * directionFactor
      })
    case 'name':
      return repositoriesCopy.sort(
        (left, right) =>
          left.name.localeCompare(right.name, 'pt-BR') * directionFactor,
      )
    case 'stars':
    default:
      return repositoriesCopy.sort(
        (left, right) =>
          (left.stargazers_count - right.stargazers_count) * directionFactor,
      )
  }
}
