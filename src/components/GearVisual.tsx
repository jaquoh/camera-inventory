import type { InventoryItem } from '../domain/types'

const placeholder = '/assets/placeholders/equipment-silhouette.svg'

export function GearVisual({ item, detail = false }: { item: InventoryItem; detail?: boolean }) {
  const source = detail ? item.detailImage ?? item.thumbnail : item.thumbnail
  return (
    <figure className={`gear-visual ${detail ? 'gear-visual--detail' : ''}`}>
      <img src={source ?? placeholder} alt={source ? `${item.displayName} pixel art` : ''} />
      {!source && <figcaption>Reference photos needed</figcaption>}
    </figure>
  )
}
