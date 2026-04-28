import { ErrorMessage } from '@/components/ErrorMessage/ErrorMessage'
import { LoadingSpinner } from '@/components/LoadingSpinner/LoadingSpinner'
import { SearchUserForm } from '@/components/SearchUserForm/SearchUserForm'
import { UserSearchResults } from '@/components/UserSearchResults/UserSearchResults'
import { useUserSearch } from '@/hooks/useUserSearch'

export function HomePage() {
  const { result, isLoading, error, currentQuery, search, goToPage } =
    useUserSearch()
  const showEmptyState = !isLoading && !error && result?.items.length === 0

  return (
    <main className="page-shell">
      <div className="page-content">
        <header className="mb-4 pb-3 border-bottom border-secondary-subtle">
          <h1 className="display-6 fw-bold mb-2">GitHub Explorer</h1>
          <p className="text-secondary mb-0">
            Busque qualquer usuário do GitHub e explore seus repositórios.
          </p>
        </header>
        <section className="d-grid gap-3">
          <SearchUserForm
            onSearch={(query) => void search(query)}
            isLoading={isLoading}
          />

          {isLoading && <LoadingSpinner label="Buscando usuários..." />}

          {error && (
            <ErrorMessage
              title="Não foi possível buscar usuários"
              message={error.message}
              detail={error.detail}
            />
          )}

          {showEmptyState && (
            <ErrorMessage
              title={`Nenhum usuário encontrado para "${currentQuery}"`}
              message="Tente outro termo de busca, sem acentos ou com menos palavras."
            />
          )}

          {result && result.items.length > 0 && (
            <UserSearchResults
              query={currentQuery}
              result={result}
              onChangePage={(page) => void goToPage(page)}
            />
          )}
        </section>
      </div>
    </main>
  )
}
