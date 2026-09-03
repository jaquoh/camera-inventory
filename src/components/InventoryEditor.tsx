import { useState, type FormEvent } from 'react'
import { inventoryItemSchema } from '../data/schema'
import { createInventoryId } from '../domain/inventoryChanges'
import { collectionRoles, itemCategories, mounts, ownershipStatuses, type InventoryItem } from '../domain/types'

type EditorForm = {
  manufacturer: string
  model: string
  displayName: string
  category: InventoryItem['category']
  ownershipStatus: InventoryItem['ownershipStatus']
  collectionRole: InventoryItem['collectionRole']
  mount: Exclude<InventoryItem['mount'], null> | ''
  description: string
  personalNotes: string
  tags: string
  price: string
  currency: string
  specifications: string
}

function initialForm(item?: InventoryItem): EditorForm {
  return {
    manufacturer: item?.manufacturer ?? '', model: item?.model ?? '', displayName: item?.displayName ?? '',
    category: item?.category ?? 'LENS', ownershipStatus: item?.ownershipStatus ?? 'OWNED', collectionRole: item?.collectionRole ?? 'KEEPER', mount: item?.mount ?? '',
    description: item?.description ?? '', personalNotes: item?.personalNotes ?? '', tags: item?.tags.join(', ') ?? '',
    price: item?.acquisition?.price?.toString() ?? '', currency: item?.acquisition?.currency ?? 'EUR',
    specifications: JSON.stringify(item?.specifications ?? {}, null, 2),
  }
}

export function InventoryEditor({ item, existingIds, onSave, onDelete, onClose }: {
  item?: InventoryItem
  existingIds: string[]
  onSave: (item: InventoryItem) => void
  onDelete: (id: string) => void
  onClose: () => void
}) {
  const [form, setForm] = useState(() => initialForm(item))
  const [error, setError] = useState('')
  const [confirmDelete, setConfirmDelete] = useState(false)
  const set = <K extends keyof EditorForm>(key: K, value: EditorForm[K]) => setForm((current) => ({ ...current, [key]: value }))
  const setIdentity = (key: 'manufacturer' | 'model', value: string) => setForm((current) => {
    const wasAutomatic = !current.displayName || current.displayName === `${current.manufacturer} ${current.model}`.trim()
    const next = { ...current, [key]: value }
    return { ...next, displayName: wasAutomatic ? `${next.manufacturer} ${next.model}`.trim() : next.displayName }
  })

  const submit = (event: FormEvent) => {
    event.preventDefault()
    try {
      const specifications = JSON.parse(form.specifications) as unknown
      const price = form.price.trim() === '' ? null : Number(form.price)
      const saved = inventoryItemSchema.parse({
        ...(item ?? {}),
        id: item?.id ?? createInventoryId(form.displayName, existingIds),
        manufacturer: form.manufacturer.trim(), model: form.model.trim(), displayName: form.displayName.trim(),
        category: form.category, ownershipStatus: form.ownershipStatus, collectionRole: form.collectionRole, mount: form.mount || null,
        compatibility: item?.compatibility ?? {}, acquisition: { ...(item?.acquisition ?? {}), price, currency: form.currency.trim() || 'EUR' },
        specifications, description: form.description.trim(), personalNotes: form.personalNotes.trim(),
        tags: form.tags.split(',').map((tag) => tag.trim()).filter(Boolean), referenceImages: item?.referenceImages ?? [],
        thumbnail: item?.thumbnail ?? null, detailImage: item?.detailImage ?? null, links: item?.links ?? [],
      })
      onSave(saved)
    } catch (cause) {
      setError(cause instanceof SyntaxError ? 'Specifications must be valid JSON.' : 'Complete the required fields and check numeric values.')
    }
  }

  return (
    <div className="editor-backdrop" role="presentation">
      <section className="inventory-editor" role="dialog" aria-modal="true" aria-labelledby="inventory-editor-title">
        <header><div><p className="eyebrow">Inventory record</p><h2 id="inventory-editor-title">{item ? 'Edit gear' : 'Add gear'}</h2></div><button type="button" className="icon-button" onClick={onClose} aria-label="Close editor">×</button></header>
        <form onSubmit={submit}>
          <div className="editor-grid">
            <label>Manufacturer<input required value={form.manufacturer} onChange={(event) => setIdentity('manufacturer', event.target.value)} /></label>
            <label>Model<input required value={form.model} onChange={(event) => setIdentity('model', event.target.value)} /></label>
            <label className="editor-wide">Display name<input required value={form.displayName} onChange={(event) => set('displayName', event.target.value)} /></label>
            <label>Category<select value={form.category} onChange={(event) => set('category', event.target.value as EditorForm['category'])}>{itemCategories.map((value) => <option key={value} value={value}>{value}</option>)}</select></label>
            <label>Status<select value={form.ownershipStatus} onChange={(event) => set('ownershipStatus', event.target.value as EditorForm['ownershipStatus'])}>{ownershipStatuses.map((value) => <option key={value} value={value}>{value.replaceAll('_', ' ')}</option>)}</select></label>
            <label>Collection role<select value={form.collectionRole} onChange={(event) => set('collectionRole', event.target.value as EditorForm['collectionRole'])}>{collectionRoles.map((value) => <option key={value} value={value}>{value}</option>)}</select></label>
            <label>Mount<select value={form.mount} onChange={(event) => set('mount', event.target.value as EditorForm['mount'])}><option value="">None / unknown</option>{mounts.map((value) => <option key={value} value={value}>{value.replaceAll('_', ' ')}</option>)}</select></label>
            <label>Price<input type="number" min="0" step="0.01" value={form.price} onChange={(event) => set('price', event.target.value)} /></label>
            <label>Currency<input maxLength={3} value={form.currency} onChange={(event) => set('currency', event.target.value.toUpperCase())} /></label>
            <label className="editor-wide">Description<textarea rows={3} value={form.description} onChange={(event) => set('description', event.target.value)} /></label>
            <label className="editor-wide">Field notes<textarea rows={4} value={form.personalNotes} onChange={(event) => set('personalNotes', event.target.value)} /></label>
            <label className="editor-wide">Tags, comma separated<input value={form.tags} onChange={(event) => set('tags', event.target.value)} /></label>
            <label className="editor-wide">Specifications (JSON)<textarea className="editor-code" rows={7} value={form.specifications} onChange={(event) => set('specifications', event.target.value)} spellCheck={false} /></label>
          </div>
          {error && <p className="editor-error" role="alert">{error}</p>}
          <footer className="editor-actions">
            {item && !confirmDelete && <button type="button" className="danger-button" onClick={() => setConfirmDelete(true)}>Remove item</button>}
            {item && confirmDelete && <div className="delete-confirm"><strong>Remove this item?</strong><button type="button" onClick={() => setConfirmDelete(false)}>Cancel</button><button type="button" className="danger-button" onClick={() => onDelete(item.id)}>Yes, remove</button></div>}
            <button type="button" onClick={onClose}>Cancel</button><button type="submit" className="primary-button">Save item</button>
          </footer>
        </form>
      </section>
    </div>
  )
}
