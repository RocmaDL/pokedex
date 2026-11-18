import { useEffect, useState } from 'react'
import { Link, useLocation, useParams } from 'react-router-dom'
import { fetchPokemonDetails } from '../../entities/pokemon/api/pokemonApi'
import { formatHeight, formatPokemonNumber, formatWeight } from '../../entities/pokemon/lib/pokemon'
import TypeBadge from '../../entities/pokemon/ui/TypeBadge'
import StatusMessage from '../../shared/ui/StatusMessage'

// Valeur maximale d'une statistique de base dans les jeux, pour la longueur des barres.
const MAX_STAT = 255

function PokemonDetailsPage() {
  const { id } = useParams()
  const location = useLocation()
  const backTo = location.state?.from ?? '/'

  const [pokemon, setPokemon] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const controller = new AbortController()

    async function loadPokemon() {
      setIsLoading(true)
      setError(null)
      try {
        setPokemon(await fetchPokemonDetails(id, { signal: controller.signal }))
      } catch (err) {
        if (controller.signal.aborted) return
        setError(
          err.response?.status === 404
            ? 'Ce pokémon n’existe pas.'
            : 'Impossible de charger ce pokémon. Vérifie ta connexion puis réessaie.',
        )
      } finally {
        if (!controller.signal.aborted) setIsLoading(false)
      }
    }

    loadPokemon()
    return () => controller.abort()
  }, [id])

  return (
    <section className="page">
      <Link to={backTo} className="back-link arrow arrow--prev">
        Retour à la liste
      </Link>

      {isLoading && <StatusMessage>Chargement de la fiche…</StatusMessage>}
      {error && <StatusMessage tone="error">{error}</StatusMessage>}

      {!isLoading && pokemon && (
        <article className="details">
          <div className={`details__visual type-${pokemon.types[0]}`}>
            {/* Élément LCP de la page : pas de lazy loading, priorité haute. */}
            <img
              src={pokemon.image}
              alt={pokemon.name}
              width="475"
              height="475"
              fetchPriority="high"
            />
          </div>

          <div className="details__info">
            <p className="details__number">{formatPokemonNumber(pokemon.id)}</p>
            <h1 className="details__name">{pokemon.name}</h1>
            {pokemon.genus && <p className="details__genus">{pokemon.genus}</p>}

            <p className="details__types">
              {pokemon.types.map((type) => (
                <TypeBadge key={type} type={type} />
              ))}
            </p>

            {pokemon.description && <p className="details__description">{pokemon.description}</p>}

            <dl className="details__measures">
              <div>
                <dt>Taille</dt>
                <dd>{formatHeight(pokemon.height)}</dd>
              </div>
              <div>
                <dt>Poids</dt>
                <dd>{formatWeight(pokemon.weight)}</dd>
              </div>
            </dl>

            <h2 className="details__subtitle">Statistiques de base</h2>
            <ul className="stats">
              {pokemon.stats.map((stat) => (
                <li key={stat.key} className="stats__row">
                  <span className="stats__label">{stat.label}</span>
                  <span className="stats__value">{stat.value}</span>
                  <span className="stats__bar" aria-hidden="true">
                    <span style={{ width: `${Math.min(stat.value / MAX_STAT, 1) * 100}%` }} />
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </article>
      )}
    </section>
  )
}

export default PokemonDetailsPage
