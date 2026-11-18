import { useCreatedPokemonStore } from './createdPokemonStore'

const flamby = { id: 'a', name: 'Flamby', type: 'fire', height: null, weight: null }
const aquali = { id: 'b', name: 'Aquali', type: 'water', height: 1, weight: 29 }

beforeEach(() => {
  useCreatedPokemonStore.setState({ pokemons: [] })
})

describe('createdPokemonStore Unit Test Suites', () => {
  it('should add the newest pokemon first', () => {
    const { addPokemon } = useCreatedPokemonStore.getState()
    addPokemon(flamby)
    addPokemon(aquali)

    expect(useCreatedPokemonStore.getState().pokemons).toEqual([aquali, flamby])
  })

  it('should remove a pokemon by id', () => {
    useCreatedPokemonStore.setState({ pokemons: [aquali, flamby] })
    useCreatedPokemonStore.getState().removePokemon('b')

    expect(useCreatedPokemonStore.getState().pokemons).toEqual([flamby])
  })
})
