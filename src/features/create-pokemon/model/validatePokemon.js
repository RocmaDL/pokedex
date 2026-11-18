export function validatePokemon(values) {
  if (values.name.trim().length < 2) {
    return 'Le nom doit contenir au moins 2 caractères.'
  }
  if (values.height !== '' && Number(values.height) <= 0) {
    return 'La taille doit être supérieure à 0.'
  }
  if (values.weight !== '' && Number(values.weight) <= 0) {
    return 'Le poids doit être supérieur à 0.'
  }
  return null
}
