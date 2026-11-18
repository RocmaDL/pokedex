import { useCreatedPokemonStore } from '../../../entities/pokemon/model/createdPokemonStore'
import TypeBadge from '../../../entities/pokemon/ui/TypeBadge'
import Button from '../../../shared/ui/Button'

const dateFormatter = new Intl.DateTimeFormat('fr-FR', { dateStyle: 'medium', timeStyle: 'short' })

function formatMeasures(pokemon) {
  const parts = []
  if (pokemon.height !== null) parts.push(`${pokemon.height.toLocaleString('fr-FR')} m`)
  if (pokemon.weight !== null) parts.push(`${pokemon.weight.toLocaleString('fr-FR')} kg`)
  return parts.join(' · ')
}

function CreatedPokemonList() {
  const pokemons = useCreatedPokemonStore((state) => state.pokemons)
  const removePokemon = useCreatedPokemonStore((state) => state.removePokemon)

  if (pokemons.length === 0) {
    return <p className="created-list__empty">Tu n’as encore créé aucun pokémon.</p>
  }

  return (
    <ul className="created-list">
      {pokemons.map((pokemon) => (
        <li key={pokemon.id} className="created-list__item">
          <div>
            <p className="created-list__name">{pokemon.name}</p>
            <p className="created-list__meta">
              <TypeBadge type={pokemon.type} />
              {formatMeasures(pokemon) && <span>{formatMeasures(pokemon)}</span>}
            </p>
            <p className="created-list__date">
              Créé le {dateFormatter.format(new Date(pokemon.createdAt))}
            </p>
          </div>
          <Button
            variant="ghost"
            onClick={() => removePokemon(pokemon.id)}
            aria-label={`Supprimer ${pokemon.name}`}
          >
            Supprimer
          </Button>
        </li>
      ))}
    </ul>
  )
}

export default CreatedPokemonList
