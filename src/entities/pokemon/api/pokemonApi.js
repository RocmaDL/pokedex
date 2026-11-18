import { pokeApi } from '../../../shared/api/client'
import { toPokemonDetails, toPokemonSummary } from '../lib/pokemon'

export const PAGE_SIZE = 20

// /pokemon ne renvoie que des noms : il faut un appel par pokémon pour l'image et les types.
export async function fetchPokemonPage(page, { signal } = {}) {
  const { data } = await pokeApi.get('/pokemon', {
    params: { offset: (page - 1) * PAGE_SIZE, limit: PAGE_SIZE },
    signal,
  })

  const pokemons = await Promise.all(
    data.results.map(async (result) => {
      const response = await pokeApi.get(`/pokemon/${result.name}`, { signal })
      return toPokemonSummary(response.data)
    }),
  )

  return { count: data.count, hasNext: data.next !== null, pokemons }
}

// Le nom et la description en français sont dans /pokemon-species, pas dans /pokemon.
export async function fetchPokemonDetails(id, { signal } = {}) {
  const { data: pokemon } = await pokeApi.get(`/pokemon/${id}`, { signal })
  const { data: species } = await pokeApi.get(pokemon.species.url, { signal })
  return toPokemonDetails(pokemon, species)
}
