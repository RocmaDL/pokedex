import { Link } from 'react-router-dom'

function NotFoundPage() {
  return (
    <section className="page">
      <h1>Page introuvable</h1>
      <p>
        Cette adresse ne correspond à aucune page. <Link to="/">Revenir à la liste</Link>
      </p>
    </section>
  )
}

export default NotFoundPage
