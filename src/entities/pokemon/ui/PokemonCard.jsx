import { Link, useLocation } from 'react-router-dom'
import { formatPokemonNumber } from '../lib/pokemon'
import TypeBadge from './TypeBadge'

function PokemonCard({ pokemon, lazyImage = true }) {
  const location = useLocation()

  return (
    <article className={`pokemon-card type-${pokemon.types[0]}`}>
      {/* from : pour que « Retour à la liste » ramène sur la même page */}
      <Link
        to={`/pokemon/${pokemon.id}`}
        state={{ from: location.pathname + location.search }}
        className="pokemon-card__link"
      >
        <span className="pokemon-card__number">{formatPokemonNumber(pokemon.id)}</span>
        {pokemon.image ? (
          <img
            className="pokemon-card__image"
            src={pokemon.image}
            alt=""
            width="96"
            height="96"
            loading={lazyImage ? 'lazy' : 'eager'}
          />
        ) : (
          <span className="pokemon-card__image pokemon-card__image--missing" aria-hidden="true">
            ?
          </span>
        )}
        <h2 className="pokemon-card__name">{pokemon.name}</h2>
      </Link>
      <p className="pokemon-card__types">
        {pokemon.types.map((type) => (
          <TypeBadge key={type} type={type} />
        ))}
      </p>
    </article>
  )
}

export default PokemonCard
