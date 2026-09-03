import { useMemo, useState } from 'react'
import { GearCard } from '../components/GearCard'
import { DetailPanel } from '../components/DetailPanel'
import { filterInventory, mountLabels } from '../domain/inventory'
import { collectionRoles, mounts, type CollectionRole, type InventoryItem, type Mount, type OwnershipStatus } from '../domain/types'

const categories = ['CAMERA', 'LENS', 'ADAPTER', 'ACCESSORY'] as const
const sectionLabels = { CAMERA: 'Camera bodies', LENS: 'Lenses', ADAPTER: 'Adapters', ACCESSORY: 'Accessories' }

export function InventoryScreen({ items }: { items: InventoryItem[] }) {
  const [selected, setSelected] = useState<InventoryItem | null>(null)
  const [search, setSearch] = useState('')
  const [ownership, setOwnership] = useState<OwnershipStatus | 'ALL'>('ALL')
  const [mount, setMount] = useState<Mount | 'ALL'>('ALL')
  const [role, setRole] = useState<CollectionRole | 'ALL'>('ALL')
  const filtered = useMemo(() => filterInventory(items, { search, ownership, mount, role }), [items, search, ownership, mount, role])
  const fieldKit = filtered.filter((item) => ['OWNED', 'ON_THE_WAY'].includes(item.ownershipStatus))
  const desired = filtered.filter((item) => !['OWNED', 'ON_THE_WAY'].includes(item.ownershipStatus))

  return (
    <div className={`inventory-layout ${selected ? 'has-detail' : ''}`}>
      <div className="inventory-content">
        <header className="screen-heading"><p className="eyebrow">Gear codex · {items.length} records</p><h1>Inventory</h1><p>Owned kit, experiments, and a deliberately curated wishlist.</p></header>
        <div className="filter-bar" aria-label="Inventory filters">
          <label className="search-field"><span>Search</span><input type="search" value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Lens, maker, mount…" /></label>
          <label><span>Status</span><select value={ownership} onChange={(event) => setOwnership(event.target.value as OwnershipStatus | 'ALL')}><option value="ALL">All</option><option value="OWNED">Owned</option><option value="ON_THE_WAY">On the way</option><option value="WISHLIST">Wishlist</option><option value="CONSIDERING">Considering</option></select></label>
          <label><span>Mount</span><select value={mount} onChange={(event) => setMount(event.target.value as Mount | 'ALL')}><option value="ALL">All mounts</option>{mounts.map((value) => <option key={value} value={value}>{mountLabels[value]}</option>)}</select></label>
          <label><span>Role</span><select value={role} onChange={(event) => setRole(event.target.value as CollectionRole | 'ALL')}><option value="ALL">All roles</option>{collectionRoles.map((value) => <option key={value}>{value}</option>)}</select></label>
        </div>
        {categories.map((category) => {
          const categoryItems = fieldKit.filter((item) => item.category === category)
          return categoryItems.length > 0 && <section className="gear-section" key={category}><div className="section-title"><h2>{sectionLabels[category]}</h2><span>{categoryItems.length.toString().padStart(2, '0')}</span></div><div className="gear-grid">{categoryItems.map((item) => <GearCard key={item.id} item={item} onOpen={setSelected} />)}</div></section>
        })}
        {desired.length > 0 && <section className="gear-section wishlist"><div className="section-title"><div><p className="eyebrow">Desired gear · not owned</p><h2>Wishlist & candidates</h2></div><span>{desired.length.toString().padStart(2, '0')}</span></div><div className="gear-grid">{desired.map((item) => <GearCard key={item.id} item={item} onOpen={setSelected} />)}</div></section>}
        {filtered.length === 0 && <div className="empty-state"><h2>No gear found</h2><p>Clear or adjust the filters to see more of the field kit.</p></div>}
      </div>
      {selected && <DetailPanel item={selected} onClose={() => setSelected(null)} />}
    </div>
  )
}
