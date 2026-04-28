interface ErrorMessageProps {
  title?: string
  message: string
  /** Texto adicional (ex.: `message` bruto da API do GitHub). */
  detail?: string
}

export function ErrorMessage({
  title = 'Algo deu errado',
  message,
  detail,
}: ErrorMessageProps) {
  return (
    <div className="error-message" role="alert" aria-live="polite">
      <h2 className="h6 mb-1 error-message__title">{title}</h2>
      <p className="mb-0 error-message__text">{message}</p>
      {detail && (
        <p className="mb-0 mt-2 pt-2 border-top border-secondary-subtle error-message__detail">
          {detail}
        </p>
      )}
    </div>
  )
}
