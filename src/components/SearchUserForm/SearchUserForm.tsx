import { type FormEvent, useState } from 'react'
import { isValidUserSearchQuery } from '@/utils/validators'
import styles from './SearchUserForm.module.css'

interface SearchUserFormProps {
  initialUsername?: string
  isLoading?: boolean
  onSearch: (username: string) => void
}

export function SearchUserForm({
  initialUsername = '',
  isLoading = false,
  onSearch,
}: SearchUserFormProps) {
  const [query, setQuery] = useState(initialUsername)
  const [formError, setFormError] = useState('')

  const handleSearchSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    const normalizedQuery = query.trim()

    if (!isValidUserSearchQuery(normalizedQuery)) {
      setFormError('Informe ao menos 2 caracteres (ex: "juan junger").')
      return
    }

    setFormError('')
    onSearch(normalizedQuery)
  }

  return (
    <form className={styles.formCard} onSubmit={handleSearchSubmit}>
      <label htmlFor="github-username" className="form-label fw-semibold">
        Username do GitHub
      </label>
      <div className="d-flex gap-2 flex-column flex-sm-row">
        <input
          id="github-username"
          className={`form-control ${styles.searchInput}`}
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder='ex: "juan junger"'
          autoComplete="off"
        />
        <button
          type="submit"
          className={`btn ${styles.searchButton}`}
          disabled={isLoading}
        >
          {isLoading ? 'Buscando...' : 'Buscar'}
        </button>
      </div>
      {formError && (
        <p className="text-danger mt-2 mb-0" role="alert">
          {formError}
        </p>
      )}
    </form>
  )
}
