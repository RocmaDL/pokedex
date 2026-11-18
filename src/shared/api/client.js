import axios from 'axios'

export const pokeApi = axios.create({
  baseURL: 'https://pokeapi.co/api/v2',
  timeout: 10000,
})

// PokéAPI est en lecture seule, donc le POST du formulaire part ici.
// JSONPlaceholder répond 201 comme un vrai backend mais ne garde rien.
export const demoApi = axios.create({
  baseURL: 'https://jsonplaceholder.typicode.com',
  timeout: 10000,
})
