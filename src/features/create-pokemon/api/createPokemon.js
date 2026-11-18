import { demoApi } from '../../../shared/api/client'

export async function createPokemon(pokemon) {
  const { data } = await demoApi.post('/posts', pokemon)
  return data
}
