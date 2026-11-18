import {
  formatHeight,
  formatPokemonNumber,
  formatWeight,
  getIdFromUrl,
  toPokemonSummary,
  translateType,
} from './pokemon'

describe('pokemon utils Unit Test Suites', () => {
  it('should extract the id from a PokéAPI url', () => {
    expect(getIdFromUrl('https://pokeapi.co/api/v2/pokemon/25/')).toBe(25)
    expect(getIdFromUrl('https://pokeapi.co/api/v2/pokemon/10034')).toBe(10034)
    expect(getIdFromUrl('https://pokeapi.co/api/v2/pokemon/')).toBeNull()
  })

  it('should pad the pokédex number to 4 digits', () => {
    expect(formatPokemonNumber(7)).toBe('#0007')
    expect(formatPokemonNumber(1025)).toBe('#1025')
  })

  it('should translate a type and keep unknown types as is', () => {
    expect(translateType('electric')).toBe('Électrik')
    expect(translateType('stellar')).toBe('stellar')
  })

  it('should convert decimeters and hectograms', () => {
    expect(formatHeight(4)).toBe('0,4 m')
    expect(formatWeight(60)).toBe('6 kg')
  })

  it('should keep only what the card needs', () => {
    const apiPokemon = {
      id: 25,
      name: 'pikachu',
      sprites: { front_default: 'pikachu.png' },
      types: [{ slot: 1, type: { name: 'electric' } }],
      height: 4,
    }

    expect(toPokemonSummary(apiPokemon)).toEqual({
      id: 25,
      name: 'Pikachu',
      image: 'pikachu.png',
      types: ['electric'],
    })
  })
})
