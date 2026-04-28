interface LoadingSpinnerProps {
  label?: string
}

export function LoadingSpinner({
  label = 'Carregando dados...',
}: LoadingSpinnerProps) {
  return (
    <div className="d-flex align-items-center gap-2" role="status" aria-live="polite">
      <div className="spinner-border spinner-border-sm text-primary" />
      <span>{label}</span>
    </div>
  )
}
