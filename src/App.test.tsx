import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'
import App from './App'

describe('App', () => {
  it('renderiza o título principal', async () => {
    render(<App />)

    expect(
      await screen.findByRole('heading', { name: /github explorer/i }),
    ).toBeInTheDocument()
  })
})
