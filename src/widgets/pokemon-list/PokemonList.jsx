import PokemonCard from '../../entities/pokemon/ui/PokemonCard'
import StatusMessage from '../../shared/ui/StatusMessage'

// À peu près ce qui tient sans défiler sur un écran large.
const EAGER_IMAGES = 8

function PokemonList({ pokemons }) {
  if (pokemons.length === 0) {
    return <StatusMessage>Aucun pokémon disponible.</StatusMessage>
  }

  return (
    <ul className="pokemon-list">
      {pokemons.map((pokemon, index) => (
        <li key={pokemon.id}>
          <PokemonCard pokemon={pokemon} lazyImage={index >= EAGER_IMAGES} />
        </li>
      ))}
    </ul>
  )
}

export default PokemonList
