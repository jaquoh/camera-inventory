import { mountLabels } from '../domain/inventory'
import type { InventoryItem } from '../domain/types'
import { GearVisual } from './GearVisual'

const roleIcons = { KEEPER: '★', EXPERIMENT: '⌁', TEMPORARY: '↻', RESELL: '⇄', UTILITY: '◆', FUTURE: '◇' }

export function GearCard({ item, onOpen }: { item: InventoryItem; onOpen: (item: InventoryItem) => void }) {
  const min = item.specifications.focalLengthMin
  const max = item.specifications.focalLengthMax
  const aperture = item.specifications.maxAperture
  const lensLine = typeof min === 'number'
    ? `${min}${max !== min ? `–${max}` : ''}mm${typeof aperture === 'number' ? ` · f/${aperture}` : ''}`
    : item.category.replace('_', ' ')

  return (
    <button className={`gear-card role-${item.collectionRole.toLowerCase()}`} onClick={() => onOpen(item)} aria-label={`View details for ${item.displayName}`}>
      <GearVisual item={item} />
      <span className="gear-card__maker">{item.manufacturer}</span>
      <strong>{item.model}</strong>
      <span>{lensLine}</span>
      <span>{item.mount ? mountLabels[item.mount] : item.category}</span>
      <span className="gear-card__state">{roleIcons[item.collectionRole]} {item.collectionRole} · {item.ownershipStatus.replaceAll('_', ' ')}</span>
    </button>
  )
}
