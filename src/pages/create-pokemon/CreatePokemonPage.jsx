import CreatePokemonForm from '../../features/create-pokemon/ui/CreatePokemonForm'
import CreatedPokemonList from '../../features/create-pokemon/ui/CreatedPokemonList'

function CreatePokemonPage() {
  return (
    <section className="page">
      <div className="page-heading">
        <h1>Créer un pokémon</h1>
        <p className="page-heading__meta">
          PokéAPI est en lecture seule. Le formulaire envoie un POST à JSONPlaceholder, puis garde
          ta création dans ce navigateur.
        </p>
      </div>

      <div className="create-layout">
        <CreatePokemonForm />
        <div>
          <h2 className="create-layout__title">Tes créations</h2>
          <CreatedPokemonList />
        </div>
      </div>
    </section>
  )
}

export default CreatePokemonPage
