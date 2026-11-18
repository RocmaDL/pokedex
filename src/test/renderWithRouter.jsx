import { render } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'

// Rend un composant dans un routeur en mémoire, à l'URL voulue.
export function renderWithRouter(ui, { route = '/' } = {}) {
  return render(<MemoryRouter initialEntries={[route]}>{ui}</MemoryRouter>)
}
