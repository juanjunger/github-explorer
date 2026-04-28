export function isValidUsername(username: string): boolean {
  const trimmedUsername = username.trim()
  const githubUsernameRegex = /^(?!-)[A-Za-z0-9-]{1,39}(?<!-)$/

  return githubUsernameRegex.test(trimmedUsername)
}

export function isValidUserSearchQuery(query: string): boolean {
  const normalizedQuery = query.trim()
  if (normalizedQuery.length < 2) {
    return false
  }

  const allowedCharsRegex = /^[\p{L}\p{N}_\-\s]+$/u
  return allowedCharsRegex.test(normalizedQuery)
}
