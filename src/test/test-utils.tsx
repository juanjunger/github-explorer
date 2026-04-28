import type { ReactElement, ReactNode } from 'react'
import { render, type RenderOptions } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'

interface ProvidersProps {
  children: ReactNode
  initialEntries?: string[]
}

function AllProviders({ children, initialEntries = ['/'] }: ProvidersProps) {
  return (
    <MemoryRouter
      initialEntries={initialEntries}
      future={{
        v7_startTransition: true,
        v7_relativeSplatPath: true,
      }}
    >
      {children}
    </MemoryRouter>
  )
}

interface CustomRenderOptions extends Omit<RenderOptions, 'wrapper'> {
  initialEntries?: string[]
}

/**
 * Renders a component with all app-level providers (router, etc).
 * Use this instead of RTL's bare `render` so tests reflect production wiring.
 */
export function renderWithProviders(
  ui: ReactElement,
  { initialEntries, ...options }: CustomRenderOptions = {},
) {
  return render(ui, {
    wrapper: ({ children }) => (
      <AllProviders initialEntries={initialEntries}>{children}</AllProviders>
    ),
    ...options,
  })
}

export * from '@testing-library/react'
