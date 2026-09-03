import type { InventoryItem } from '../domain/types'

const placeholder = '/assets/placeholders/equipment-silhouette.svg'

export function GearVisual({ item, detail = false }: { item: InventoryItem; detail?: boolean }) {
  const source = detail ? item.detailImage ?? item.thumbnail : item.thumbnail
  const state = source ? 'gear-visual--art' : 'gear-visual--placeholder'
  return (
    <figure className={`gear-visual ${detail ? 'gear-visual--detail' : ''} ${state}`}>
      <img src={source ?? placeholder} alt={source ? `${item.displayName} pixel art` : ''} />
      {!source && <figcaption>Reference photos needed</figcaption>}
    </figure>
  )
}
