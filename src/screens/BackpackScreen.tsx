import { useState } from 'react'
import { getBackpackWarnings, mountLabels } from '../domain/inventory'
import type { InventoryItem } from '../domain/types'
import { useLocalStorage } from '../hooks/useLocalStorage'

const roleSlots = { CAMERA: 'Camera body', LENS: 'Lens slot', ADAPTER: 'Adapter slot', ACCESSORY: 'Accessory slot' }

export function BackpackScreen({ items }: { items: InventoryItem[] }) {
  const [packedIds, setPackedIds] = useLocalStorage<string[]>('vintage-field-kit:backpack', [])
  const [draggedId, setDraggedId] = useState<string | null>(null)
  const packable = items.filter((item) => ['OWNED', 'ON_THE_WAY'].includes(item.ownershipStatus))
  const packed = packedIds.map((id) => items.find((item) => item.id === id)).filter((item): item is InventoryItem => Boolean(item))
  const warnings = getBackpackWarnings(packedIds, items)
  const add = (id: string) => setPackedIds((current) => current.includes(id) ? current : [...current, id])
  const remove = (id: string) => setPackedIds((current) => current.filter((entry) => entry !== id))
  const packedLenses = packed.filter((item) => item.category === 'LENS')
  const focalMin = Math.min(...packedLenses.map((item) => Number(item.specifications.focalLengthMin)))
  const focalMax = Math.max(...packedLenses.map((item) => Number(item.specifications.focalLengthMax)))

  return (
    <div>
      <header className="screen-heading"><p className="eyebrow">Loadout builder · locally saved</p><h1>Backpack</h1><p>Plan the real kit before heading into the field.</p></header>
      <div className="loadout-summary"><div><span>Packed</span><strong>{packed.length} items</strong></div><div><span>Focal range</span><strong>{packedLenses.length ? `${focalMin}–${focalMax}mm` : 'No lenses'}</strong></div><div><span>Known weight</span><strong>Awaiting verified data</strong></div></div>
      {warnings.length > 0 && <div className="warning-stack" role="alert">{warnings.map((warning) => <p key={warning}>⚠ {warning}</p>)}</div>}
      <div className="backpack-layout">
        <section className="loadout-panel" onDragOver={(event) => event.preventDefault()} onDrop={() => { if (draggedId) add(draggedId); setDraggedId(null) }}>
          <div className="section-title"><h2>Packed kit</h2><span>{packed.length.toString().padStart(2, '0')}</span></div>
          {packed.length === 0 ? <div className="empty-slot"><span>+</span><p>Drop gear here or use a Pack button</p></div> : <div className="packed-list">{packed.map((item) => <article className="packed-item" key={item.id} draggable onDragStart={() => setDraggedId(item.id)}><div><small>{roleSlots[item.category]}</small><strong>{item.displayName}</strong><span>{item.mount ? mountLabels[item.mount] : item.category} · {item.ownershipStatus.replaceAll('_', ' ')}</span></div><button onClick={() => remove(item.id)} aria-label={`Remove ${item.displayName} from backpack`}>Remove</button></article>)}</div>}
        </section>
        <section className="loadout-panel inventory-pool"><div className="section-title"><h2>Available gear</h2><span>{packable.length.toString().padStart(2, '0')}</span></div><div className="packed-list">{packable.map((item) => <article className="packed-item" key={item.id} draggable onDragStart={() => setDraggedId(item.id)}><div><small>{item.category}</small><strong>{item.displayName}</strong><span>{item.ownershipStatus.replaceAll('_', ' ')}</span></div><button disabled={packedIds.includes(item.id)} onClick={() => add(item.id)} aria-label={`Pack ${item.displayName}`}>{packedIds.includes(item.id) ? 'Packed' : 'Pack'}</button></article>)}</div></section>
      </div>
    </div>
  )
}
