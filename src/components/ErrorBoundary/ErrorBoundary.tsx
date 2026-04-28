import { type ReactNode, useEffect, useState } from 'react'
import { ErrorMessage } from '@/components/ErrorMessage/ErrorMessage'

interface ErrorBoundaryProps {
  children: ReactNode
}

export function ErrorBoundary({ children }: ErrorBoundaryProps) {
  const [hasRuntimeError, setHasRuntimeError] = useState(false)

  useEffect(() => {
    const handleWindowError = () => {
      setHasRuntimeError(true)
    }

    window.addEventListener('error', handleWindowError)
    window.addEventListener('unhandledrejection', handleWindowError)

    return () => {
      window.removeEventListener('error', handleWindowError)
      window.removeEventListener('unhandledrejection', handleWindowError)
    }
  }, [])

  if (hasRuntimeError) {
    return (
      <main className="container py-5">
        <ErrorMessage
          title="Falha inesperada"
          message="A aplicação encontrou um erro inesperado."
        />
      </main>
    )
  }

  return children
}
