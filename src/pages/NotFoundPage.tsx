import { Link } from 'react-router-dom'

export function NotFoundPage() {
  return (
    <main className="container py-5 text-center">
      <h1 className="display-6">404</h1>
      <p className="text-muted">Página não encontrada.</p>
      <Link to="/" className="btn btn-primary">
        Voltar para início
      </Link>
    </main>
  )
}
