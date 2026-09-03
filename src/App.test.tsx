import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it } from 'vitest'
import App from './App'

describe('field kit application', () => {
  beforeEach(() => localStorage.clear())

  it('opens the Takumar detail with verified acquisition and crop information', async () => {
    const user = userEvent.setup()
    render(<App />)

    const cameraSlot = screen.getByRole('button', { name: /view details for sony nex-5n/i })
    const takumarSlot = screen.getByRole('button', { name: /view details for asahi smc takumar/i })

    expect(cameraSlot).toHaveAttribute('aria-pressed', 'true')
    expect(takumarSlot).toHaveAttribute('aria-pressed', 'false')
    await user.click(takumarSlot)

    expect(screen.getByRole('heading', { name: 'Asahi SMC Takumar 55mm f/1.8' })).toBeInTheDocument()
    expect(screen.getByText('€43.00')).toBeInTheDocument()
    expect(screen.getByText(/82.5mm-equivalent framing/i)).toBeInTheDocument()
    expect(cameraSlot).toHaveAttribute('aria-pressed', 'false')
    expect(takumarSlot).toHaveAttribute('aria-pressed', 'true')
  })

  it('clears the Tokina mount warning after its adapter is packed', async () => {
    const user = userEvent.setup()
    render(<App />)

    await user.click(screen.getByRole('button', { name: 'Backpack' }))
    await user.click(screen.getByRole('button', { name: /pack sony nex-5n/i }))
    await user.click(screen.getByRole('button', { name: /pack tokina 80–200mm f\/4/i }))
    expect(screen.getByRole('alert')).toHaveTextContent('C/Y → Sony E adapter')

    await user.click(screen.getByRole('button', { name: /pack c\/y → sony e adapter/i }))
    expect(screen.queryByRole('alert')).not.toBeInTheDocument()
    expect(JSON.parse(localStorage.getItem('vintage-field-kit:backpack') ?? '[]')).toEqual(expect.arrayContaining(['sony-nex-5n', 'tokina-80-200-4', 'cy-to-sony-e']))
  })
})
