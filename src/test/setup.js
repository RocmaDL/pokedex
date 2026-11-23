import '@testing-library/jest-dom'
import { TextDecoder, TextEncoder } from 'node:util'

// React Router en a besoin, mais l'environnement jsdom de Jest ne les fournit pas.
Object.assign(globalThis, { TextEncoder, TextDecoder })

// jsdom n'implémente pas le défilement.
window.scrollTo = jest.fn()

afterEach(() => {
  localStorage.clear()
})
