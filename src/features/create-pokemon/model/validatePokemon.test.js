import { validatePokemon } from './validatePokemon'

const validValues = { name: 'Flamby', type: 'fire', height: '', weight: '' }

describe('validatePokemon Unit Test Suites', () => {
  it('should accept a valid pokemon', () => {
    expect(validatePokemon(validValues)).toBeNull()
  })

  it('should refuse a name shorter than 2 characters', () => {
    expect(validatePokemon({ ...validValues, name: ' a ' })).toBe(
      'Le nom doit contenir au moins 2 caractères.',
    )
  })

  it('should refuse a negative height or weight', () => {
    expect(validatePokemon({ ...validValues, height: '-1' })).toBe(
      'La taille doit être supérieure à 0.',
    )
    expect(validatePokemon({ ...validValues, weight: '0' })).toBe(
      'Le poids doit être supérieur à 0.',
    )
  })
})
