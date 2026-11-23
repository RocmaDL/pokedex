import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { useCreatedPokemonStore } from '../../../entities/pokemon/model/createdPokemonStore'
import { createPokemon } from '../api/createPokemon'
import CreatePokemonForm from './CreatePokemonForm'

jest.mock('../api/createPokemon', () => ({ createPokemon: jest.fn() }))

beforeEach(() => {
  useCreatedPokemonStore.setState({ pokemons: [] })
})

afterEach(() => {
  jest.clearAllMocks()
})

describe('CreatePokemonForm Functional Test Suites', () => {
  it('should POST the pokemon and add it to the store', async () => {
    const user = userEvent.setup()
    createPokemon.mockResolvedValue({ id: 101 })
    render(<CreatePokemonForm />)

    await user.type(screen.getByLabelText('Nom'), 'Flamby')
    await user.selectOptions(screen.getByLabelText('Élément'), 'fire')
    await user.type(screen.getByLabelText('Taille (m)'), '1.2')
    await user.click(screen.getByRole('button', { name: 'Ajouter le pokémon' }))

    expect(createPokemon).toHaveBeenCalledWith({
      name: 'Flamby',
      type: 'fire',
      height: 1.2,
      weight: null,
    })
    expect(await screen.findByText('Flamby a été ajouté.')).toBeInTheDocument()
    expect(useCreatedPokemonStore.getState().pokemons).toHaveLength(1)
    expect(useCreatedPokemonStore.getState().pokemons[0]).toMatchObject({
      name: 'Flamby',
      remoteId: 101,
    })
    expect(screen.getByLabelText('Nom')).toHaveValue('')
  })

  it('should not send anything when the name is too short', async () => {
    const user = userEvent.setup()
    render(<CreatePokemonForm />)

    await user.type(screen.getByLabelText('Nom'), 'F')
    await user.click(screen.getByRole('button', { name: 'Ajouter le pokémon' }))

    expect(screen.getByRole('alert')).toHaveTextContent(
      'Le nom doit contenir au moins 2 caractères.',
    )
    expect(createPokemon).not.toHaveBeenCalled()
  })

  it('should show an error when the request fails', async () => {
    const user = userEvent.setup()
    createPokemon.mockRejectedValue(new Error('Network Error'))
    render(<CreatePokemonForm />)

    await user.type(screen.getByLabelText('Nom'), 'Flamby')
    await user.click(screen.getByRole('button', { name: 'Ajouter le pokémon' }))

    expect(await screen.findByRole('alert')).toHaveTextContent('L’envoi a échoué.')
    expect(useCreatedPokemonStore.getState().pokemons).toHaveLength(0)
  })
})
