import { create } from 'zustand'
import { persist } from 'zustand/middleware'

// Partagé entre le formulaire et l'en-tête, qui sont loin l'un de l'autre dans l'arbre.
export const useCreatedPokemonStore = create(
  persist(
    (set) => ({
      pokemons: [],
      addPokemon: (pokemon) => set((state) => ({ pokemons: [pokemon, ...state.pokemons] })),
      removePokemon: (id) =>
        set((state) => ({ pokemons: state.pokemons.filter((pokemon) => pokemon.id !== id) })),
    }),
    { name: 'pokedex-created' },
  ),
)
