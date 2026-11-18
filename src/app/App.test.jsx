import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { fetchPokemonDetails, fetchPokemonPage } from '../entities/pokemon/api/pokemonApi'
import { renderWithRouter } from '../test/renderWithRouter'
import App from './App'

// Les tests fonctionnels ne dépendent pas du réseau : l'API est simulée.
vi.mock('../entities/pokemon/api/pokemonApi', () => ({
  PAGE_SIZE: 20,
  fetchPokemonPage: vi.fn(),
  fetchPokemonDetails: vi.fn(),
}))

function makePage(page, hasNext = true) {
  const firstId = (page - 1) * 20 + 1
  return {
    count: 60,
    hasNext,
    pokemons: [
      { id: firstId, name: `Pokemon ${firstId}`, image: null, types: ['grass'] },
      { id: firstId + 1, name: `Pokemon ${firstId + 1}`, image: null, types: ['fire'] },
    ],
  }
}

const pikachuDetails = {
  id: 25,
  name: 'Pikachu',
  genus: 'Pokémon Souris',
  description: 'Il lui arrive de remettre d’aplomb un Pikachu allié.',
  image: 'pikachu.png',
  types: ['electric'],
  height: 4,
  weight: 60,
  stats: [{ key: 'speed', label: 'Vitesse', value: 90 }],
}

beforeEach(() => {
  vi.mocked(fetchPokemonPage).mockImplementation((page) => Promise.resolve(makePage(page)))
  vi.mocked(fetchPokemonDetails).mockResolvedValue(pikachuDetails)
})

afterEach(() => {
  vi.clearAllMocks()
})

describe('Pokédex Functional Test Suites', () => {
  it('should display the first page and disable « Page précédente »', async () => {
    renderWithRouter(<App />)

    expect(await screen.findByRole('heading', { name: 'Pokemon 1' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Pokemon 2' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /page précédente/i })).toBeDisabled()
    expect(fetchPokemonPage).toHaveBeenCalledWith(1, expect.anything())
  })

  it('should load the next page when clicking « Page suivante »', async () => {
    const user = userEvent.setup()
    renderWithRouter(<App />)
    await screen.findByRole('heading', { name: 'Pokemon 1' })

    await user.click(screen.getByRole('button', { name: /page suivante/i }))

    expect(await screen.findByRole('heading', { name: 'Pokemon 21' })).toBeInTheDocument()
    expect(screen.getByText('Page 2')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /page précédente/i })).toBeEnabled()
  })

  it('should open the detail page when clicking a pokemon, then go back', async () => {
    const user = userEvent.setup()
    vi.mocked(fetchPokemonPage).mockResolvedValue({
      count: 1,
      hasNext: false,
      pokemons: [{ id: 25, name: 'Pikachu', image: null, types: ['electric'] }],
    })
    renderWithRouter(<App />)

    await user.click(await screen.findByRole('link', { name: /pikachu/i }))

    expect(await screen.findByRole('heading', { level: 1, name: 'Pikachu' })).toBeInTheDocument()
    expect(screen.getByText('Pokémon Souris')).toBeInTheDocument()
    expect(screen.getByText('0,4 m')).toBeInTheDocument()
    expect(fetchPokemonDetails).toHaveBeenCalledWith('25', expect.anything())

    await user.click(screen.getByRole('link', { name: /retour à la liste/i }))
    expect(await screen.findByRole('heading', { level: 1, name: 'Pokédex' })).toBeInTheDocument()
  })

  it('should show a message when the list is empty', async () => {
    vi.mocked(fetchPokemonPage).mockResolvedValue({ count: 0, hasNext: false, pokemons: [] })
    renderWithRouter(<App />)

    expect(await screen.findByText('Aucun pokémon disponible.')).toBeInTheDocument()
  })

  it('should show an error message when the API fails', async () => {
    vi.mocked(fetchPokemonPage).mockRejectedValue(new Error('Network Error'))
    renderWithRouter(<App />)

    expect(await screen.findByRole('alert')).toHaveTextContent(
      'Impossible de charger les pokémons.',
    )
  })
})
