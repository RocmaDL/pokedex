import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { fetchPokemonPage, PAGE_SIZE } from '../../entities/pokemon/api/pokemonApi'
import Button from '../../shared/ui/Button'
import Pagination from '../../shared/ui/Pagination'
import StatusMessage from '../../shared/ui/StatusMessage'
import PokemonList from '../../widgets/pokemon-list/PokemonList'

// La page courante vit dans l'URL (?page=3) : le bouton « retour » du navigateur
// et le lien « Retour à la liste » de la fiche ramènent sur la bonne page.
function readPage(searchParams) {
  const page = Number(searchParams.get('page'))
  return Number.isInteger(page) && page > 0 ? page : 1
}

function HomePage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const page = readPage(searchParams)

  const [pokemons, setPokemons] = useState([])
  const [count, setCount] = useState(null)
  const [hasNext, setHasNext] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  const [retryCount, setRetryCount] = useState(0)

  useEffect(() => {
    // Si on change de page avant la réponse, l'ancienne requête est annulée.
    const controller = new AbortController()

    async function loadPage() {
      setIsLoading(true)
      setError(null)
      try {
        const data = await fetchPokemonPage(page, { signal: controller.signal })
        setPokemons(data.pokemons)
        setCount(data.count)
        setHasNext(data.hasNext)
      } catch {
        if (!controller.signal.aborted) {
          setError('Impossible de charger les pokémons. Vérifie ta connexion puis réessaie.')
        }
      } finally {
        if (!controller.signal.aborted) setIsLoading(false)
      }
    }

    loadPage()
    return () => controller.abort()
  }, [page, retryCount])

  function goToPage(nextPage) {
    setSearchParams({ page: String(nextPage) })
    window.scrollTo({ top: 0 })
  }

  return (
    <section className="page">
      <div className="page-heading">
        <h1>Pokédex</h1>
        {count !== null && (
          <p className="page-heading__meta">
            {count.toLocaleString('fr-FR')} entrées dans PokéAPI, {PAGE_SIZE} par page.
          </p>
        )}
      </div>

      {error && (
        <div className="error-block">
          <StatusMessage tone="error">{error}</StatusMessage>
          <Button variant="ghost" onClick={() => setRetryCount((n) => n + 1)}>
            Réessayer
          </Button>
        </div>
      )}

      {!error && isLoading && pokemons.length === 0 && (
        <StatusMessage>Chargement des pokémons…</StatusMessage>
      )}

      {!error && (!isLoading || pokemons.length > 0) && (
        // Pendant un changement de page, l'ancienne liste reste affichée (atténuée)
        // au lieu de disparaître : la page ne saute pas.
        <div
          className={isLoading ? 'list-wrapper is-loading' : 'list-wrapper'}
          aria-busy={isLoading}
        >
          <PokemonList pokemons={pokemons} />
        </div>
      )}

      <Pagination
        page={page}
        onPrev={() => goToPage(page - 1)}
        onNext={() => goToPage(page + 1)}
        disablePrev={page === 1 || isLoading}
        disableNext={!hasNext || isLoading}
      />
    </section>
  )
}

export default HomePage
