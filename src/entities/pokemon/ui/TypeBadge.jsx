import { translateType } from '../lib/pokemon'

function TypeBadge({ type }) {
  return <span className={`type-badge type-${type}`}>{translateType(type)}</span>
}

export default TypeBadge
