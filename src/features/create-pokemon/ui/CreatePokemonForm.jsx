import { useState } from 'react'
import { useCreatedPokemonStore } from '../../../entities/pokemon/model/createdPokemonStore'
import { POKEMON_TYPES } from '../../../entities/pokemon/lib/pokemon'
import Button from '../../../shared/ui/Button'
import StatusMessage from '../../../shared/ui/StatusMessage'
import { createPokemon } from '../api/createPokemon'
import { validatePokemon } from '../model/validatePokemon'

const INITIAL_VALUES = { name: '', type: 'normal', height: '', weight: '' }

function CreatePokemonForm() {
  const addPokemon = useCreatedPokemonStore((state) => state.addPokemon)
  const [values, setValues] = useState(INITIAL_VALUES)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState(null)
  const [successName, setSuccessName] = useState(null)

  function handleChange(event) {
    const { name, value } = event.target
    setValues((current) => ({ ...current, [name]: value }))
  }

  async function handleSubmit(event) {
    event.preventDefault()
    setSuccessName(null)

    const validationError = validatePokemon(values)
    if (validationError) {
      setError(validationError)
      return
    }

    const pokemon = {
      name: values.name.trim(),
      type: values.type,
      height: values.height === '' ? null : Number(values.height),
      weight: values.weight === '' ? null : Number(values.weight),
    }

    setIsSubmitting(true)
    setError(null)
    try {
      const saved = await createPokemon(pokemon)
      addPokemon({
        ...pokemon,
        id: crypto.randomUUID(),
        remoteId: saved.id,
        createdAt: new Date().toISOString(),
      })
      setSuccessName(pokemon.name)
      setValues(INITIAL_VALUES)
    } catch {
      setError('L’envoi a échoué. Vérifie ta connexion puis réessaie.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form className="create-form" onSubmit={handleSubmit} noValidate>
      <div className="field">
        <label htmlFor="pokemon-name">Nom</label>
        <input
          id="pokemon-name"
          name="name"
          type="text"
          value={values.name}
          onChange={handleChange}
          required
          minLength={2}
          maxLength={30}
          autoComplete="off"
        />
      </div>

      <div className="field">
        <label htmlFor="pokemon-type">Élément</label>
        <select id="pokemon-type" name="type" value={values.type} onChange={handleChange}>
          {Object.entries(POKEMON_TYPES).map(([key, label]) => (
            <option key={key} value={key}>
              {label}
            </option>
          ))}
        </select>
      </div>

      <div className="field-row">
        <div className="field">
          <label htmlFor="pokemon-height">Taille (m)</label>
          <input
            id="pokemon-height"
            name="height"
            type="number"
            min="0.1"
            step="0.1"
            inputMode="decimal"
            value={values.height}
            onChange={handleChange}
          />
        </div>
        <div className="field">
          <label htmlFor="pokemon-weight">Poids (kg)</label>
          <input
            id="pokemon-weight"
            name="weight"
            type="number"
            min="0.1"
            step="0.1"
            inputMode="decimal"
            value={values.weight}
            onChange={handleChange}
          />
        </div>
      </div>

      {error && <StatusMessage tone="error">{error}</StatusMessage>}
      {successName && <StatusMessage tone="success">{successName} a été ajouté.</StatusMessage>}

      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? 'Envoi…' : 'Ajouter le pokémon'}
      </Button>
    </form>
  )
}

export default CreatePokemonForm
