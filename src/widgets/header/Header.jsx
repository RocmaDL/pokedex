import { Link, NavLink } from 'react-router-dom'
import { useCreatedPokemonStore } from '../../entities/pokemon/model/createdPokemonStore'

function Header() {
  // On ne lit que la longueur : pas de re-rendu quand un pokémon créé est modifié.
  const createdCount = useCreatedPokemonStore((state) => state.pokemons.length)

  return (
    <header className="site-header">
      <div className="site-header__inner">
        <Link to="/" className="site-header__brand">
          Pokédex
        </Link>
        <nav aria-label="Navigation principale">
          <ul className="site-nav">
            <li>
              <NavLink to="/" end className="site-nav__link">
                Liste
              </NavLink>
            </li>
            <li>
              <NavLink to="/creer" className="site-nav__link">
                Créer un pokémon
                {createdCount > 0 && <span className="site-nav__count">{createdCount}</span>}
              </NavLink>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  )
}

export default Header
