import { lazy, Suspense } from 'react'
import { Route, Routes } from 'react-router-dom'
import HomePage from '../pages/home/HomePage'
import StatusMessage from '../shared/ui/StatusMessage'
import Header from '../widgets/header/Header'

// Code splitting par route : la page d'accueil est dans le bundle initial,
// les autres pages sont téléchargées seulement quand on les visite.
const PokemonDetailsPage = lazy(() => import('../pages/pokemon-details/PokemonDetailsPage'))
const CreatePokemonPage = lazy(() => import('../pages/create-pokemon/CreatePokemonPage'))
const NotFoundPage = lazy(() => import('../pages/not-found/NotFoundPage'))

function App() {
  return (
    <>
      <a href="#contenu" className="skip-link">
        Aller au contenu
      </a>
      <Header />
      <main id="contenu" className="site-main">
        <Suspense fallback={<StatusMessage>Chargement de la page…</StatusMessage>}>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/pokemon/:id" element={<PokemonDetailsPage />} />
            <Route path="/creer" element={<CreatePokemonPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </Suspense>
      </main>
      <footer className="site-footer">
        <p>
          Données : <a href="https://pokeapi.co">PokéAPI</a>. TP du module Développement frontend
          avancé.
        </p>
      </footer>
    </>
  )
}

export default App
