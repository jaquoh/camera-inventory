import { calculateEquivalentFocalLength, mountLabels } from '../domain/inventory'
import type { InventoryItem } from '../domain/types'
import { GearVisual } from './GearVisual'

const specificationLabels: Record<string, string> = {
  focalLengthMin: 'Focal length (wide)', focalLengthMax: 'Focal length (long)', maxAperture: 'Maximum aperture',
  focusType: 'Focus', sensorFormat: 'Sensor format', sensorType: 'Sensor type', megapixels: 'Megapixels',
  cameraType: 'Camera type', cropFactor: 'Crop factor', stabilization: 'Stabilization', accessoryType: 'Accessory type',
  electronic: 'Electronic contacts', autofocusSupport: 'Autofocus support', tilt: 'Tilt', fullFrameCoverage: 'Full-frame coverage', specialFeatures: 'Special features',
}

function formatSpec(key: string, value: string | number | boolean | null) {
  if (value === null) return 'Unknown'
  if (typeof value === 'boolean') return value ? 'Yes' : 'No'
  if (key.startsWith('focalLength')) return `${value}mm`
  if (key === 'maxAperture') return `f/${value}`
  return String(value)
}

export function DetailPanel({ item, onClose }: { item: InventoryItem; onClose: () => void }) {
  const min = item.specifications.focalLengthMin
  const max = item.specifications.focalLengthMax
  const equivalent = item.category === 'LENS' && typeof min === 'number' && typeof max === 'number'
    ? calculateEquivalentFocalLength([min, max], 1.5)
    : null

  return (
    <aside className="detail-panel" aria-label={`${item.displayName} details`}>
      <button className="icon-button detail-panel__close" onClick={onClose} aria-label="Close item details">×</button>
      <GearVisual item={item} detail />
      <div className="detail-panel__content">
        <p className="eyebrow">{item.manufacturer} · {item.category}</p>
        <h2>{item.displayName}</h2>
        <div className="status-line"><span>{item.ownershipStatus.replaceAll('_', ' ')}</span><span>{item.collectionRole}</span></div>
        <p>{item.description}</p>
        {equivalent && (
          <div className="field-readout">
            <span>On Sony NEX-5N</span>
            <strong>{equivalent[0] === equivalent[1] ? equivalent[0] : `${equivalent[0]}–${equivalent[1]}`}mm-equivalent framing</strong>
            <small>Actual focal length remains {min === max ? min : `${min}–${max}`}mm.</small>
          </div>
        )}
        <h3>Specifications</h3>
        <dl className="spec-list">
          {item.mount && <div><dt>Mount</dt><dd>{mountLabels[item.mount]}</dd></div>}
          {Object.entries(item.specifications).map(([key, value]) => <div key={key}><dt>{specificationLabels[key] ?? key}</dt><dd>{formatSpec(key, value)}</dd></div>)}
        </dl>
        {item.specificationSources && <div className="source-list"><strong>Specification sources</strong>{Object.entries(item.specificationSources).flatMap(([field, sources]) => sources.map((source) => <a href={source.url} target="_blank" rel="noreferrer" key={`${field}-${source.url}`}>{specificationLabels[field] ?? field}: {source.label}</a>))}</div>}
        {item.acquisition && <><h3>Acquisition</h3><dl className="spec-list"><div><dt>Price</dt><dd>{item.acquisition.price != null ? new Intl.NumberFormat('en-IE', { style: 'currency', currency: item.acquisition.currency ?? 'EUR' }).format(item.acquisition.price) : 'Unknown'}</dd></div>{item.acquisition.notes && <div><dt>Notes</dt><dd>{item.acquisition.notes}</dd></div>}</dl></>}
        <h3>Field notes</h3>
        <p>{item.personalNotes || 'No personal notes yet.'}</p>
        <div className="tag-list">{item.tags.map((tag) => <span key={tag}>{tag}</span>)}</div>
      </div>
    </aside>
  )
}
