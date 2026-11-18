import '@testing-library/jest-dom/vitest'
import { afterEach, vi } from 'vitest'

// jsdom n'implémente pas le défilement.
window.scrollTo = vi.fn()

afterEach(() => {
  localStorage.clear()
})
