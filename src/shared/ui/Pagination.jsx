import Button from './Button'

function Pagination({ page, onPrev, onNext, disablePrev, disableNext }) {
  return (
    <nav className="pagination" aria-label="Pagination">
      <Button variant="ghost" className="arrow arrow--prev" onClick={onPrev} disabled={disablePrev}>
        Page précédente
      </Button>
      <span className="pagination__page">Page {page}</span>
      <Button variant="ghost" className="arrow arrow--next" onClick={onNext} disabled={disableNext}>
        Page suivante
      </Button>
    </nav>
  )
}

export default Pagination
