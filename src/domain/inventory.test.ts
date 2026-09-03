import { describe, expect, it } from 'vitest'
import type { InventoryItem } from './types'
import {
  calculateEquivalentFocalLength,
  filterInventory,
  findMountPath,
  getBackpackWarnings,
} from './inventory'

const camera: InventoryItem = {
  id: 'camera', category: 'CAMERA', manufacturer: 'Sony', model: 'NEX-5N',
  displayName: 'Sony NEX-5N', ownershipStatus: 'OWNED', collectionRole: 'KEEPER',
  mount: 'SONY_E', compatibility: { cropFactor: 1.5 }, specifications: {},
  description: 'Camera', personalNotes: '', tags: [], referenceImages: [],
  thumbnail: null, detailImage: null, links: [],
}

const lens: InventoryItem = {
  id: 'tokina', category: 'LENS', manufacturer: 'Tokina', model: '80-200mm f/4',
  displayName: 'Tokina 80-200mm f/4', ownershipStatus: 'OWNED', collectionRole: 'EXPERIMENT',
  mount: 'CONTAX_YASHICA', compatibility: {},
  specifications: { focalLengthMin: 80, focalLengthMax: 200, maxAperture: 4 },
  description: 'Lens', personalNotes: '', tags: ['telephoto'], referenceImages: [],
  thumbnail: null, detailImage: null, links: [],
}

const adapter: InventoryItem = {
  id: 'adapter', category: 'ADAPTER', manufacturer: 'Unknown', model: 'C/Y to E',
  displayName: 'C/Y → Sony E adapter', ownershipStatus: 'ON_THE_WAY', collectionRole: 'UTILITY',
  mount: null, compatibility: { sourceMount: 'CONTAX_YASHICA', targetMount: 'SONY_E' },
  specifications: {}, description: 'Adapter', personalNotes: '', tags: [], referenceImages: [],
  thumbnail: null, detailImage: null, links: [],
}

describe('inventory domain', () => {
  it('calculates equivalent framing without changing actual focal length', () => {
    expect(calculateEquivalentFocalLength(55, 1.5)).toBe(82.5)
    expect(calculateEquivalentFocalLength([80, 200], 1.5)).toEqual([120, 300])
  })

  it('finds an adapter path between a lens and camera mount', () => {
    expect(findMountPath(lens, camera, [adapter])).toEqual(['tokina', 'adapter', 'camera'])
  })

  it('warns when a packed lens needs an adapter that is not packed', () => {
    expect(getBackpackWarnings(['camera', 'tokina'], [camera, lens, adapter])[0]).toContain('C/Y → Sony E adapter')
    expect(getBackpackWarnings(['camera', 'tokina', 'adapter'], [camera, lens, adapter])).toEqual([])
  })

  it('filters by text, ownership, mount, and role', () => {
    expect(filterInventory([camera, lens], { search: 'tele', ownership: 'OWNED', mount: 'CONTAX_YASHICA', role: 'EXPERIMENT' })).toEqual([lens])
  })
})
