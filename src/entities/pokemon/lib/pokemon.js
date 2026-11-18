export const POKEMON_TYPES = {
  normal: 'Normal',
  fire: 'Feu',
  water: 'Eau',
  electric: 'Électrik',
  grass: 'Plante',
  ice: 'Glace',
  fighting: 'Combat',
  poison: 'Poison',
  ground: 'Sol',
  flying: 'Vol',
  psychic: 'Psy',
  bug: 'Insecte',
  rock: 'Roche',
  ghost: 'Spectre',
  dragon: 'Dragon',
  dark: 'Ténèbres',
  steel: 'Acier',
  fairy: 'Fée',
}

const STAT_LABELS = {
  hp: 'PV',
  attack: 'Attaque',
  defense: 'Défense',
  'special-attack': 'Attaque spé.',
  'special-defense': 'Défense spé.',
  speed: 'Vitesse',
}

export function translateType(type) {
  return POKEMON_TYPES[type] ?? type
}

// "https://pokeapi.co/api/v2/pokemon/25/" -> 25
export function getIdFromUrl(url) {
  const match = url.match(/\/(\d+)\/?$/)
  return match ? Number(match[1]) : null
}

// 25 -> "#0025"
export function formatPokemonNumber(id) {
  return `#${String(id).padStart(4, '0')}`
}

// PokéAPI donne la taille en décimètres et le poids en hectogrammes.
export function formatHeight(decimeters) {
  return `${(decimeters / 10).toLocaleString('fr-FR')} m`
}

export function formatWeight(hectograms) {
  return `${(hectograms / 10).toLocaleString('fr-FR')} kg`
}

export function capitalize(text) {
  return text.charAt(0).toUpperCase() + text.slice(1)
}

function findFrench(entries) {
  return entries.find((entry) => entry.language.name === 'fr')
}

export function toPokemonSummary(apiPokemon) {
  return {
    id: apiPokemon.id,
    name: capitalize(apiPokemon.name),
    image: apiPokemon.sprites.front_default,
    types: apiPokemon.types.map((entry) => entry.type.name),
  }
}

export function toPokemonDetails(apiPokemon, apiSpecies) {
  const frenchFlavors = apiSpecies.flavor_text_entries.filter(
    (entry) => entry.language.name === 'fr',
  )
  const latestFlavor = frenchFlavors.at(-1)

  return {
    id: apiPokemon.id,
    name: findFrench(apiSpecies.names)?.name ?? capitalize(apiPokemon.name),
    genus: findFrench(apiSpecies.genera)?.genus ?? null,
    // Les textes du jeu contiennent des retours à la ligne et des sauts de page.
    description: latestFlavor ? latestFlavor.flavor_text.replace(/\s+/g, ' ') : null,
    image:
      apiPokemon.sprites.other?.['official-artwork']?.front_default ??
      apiPokemon.sprites.front_default,
    types: apiPokemon.types.map((entry) => entry.type.name),
    height: apiPokemon.height,
    weight: apiPokemon.weight,
    stats: apiPokemon.stats.map((entry) => ({
      key: entry.stat.name,
      label: STAT_LABELS[entry.stat.name] ?? entry.stat.name,
      value: entry.base_stat,
    })),
  }
}
