import { describe, expect, it } from 'vitest'
import { applyInventoryChanges, createInventoryId, deleteInventoryItem, emptyInventoryChanges, upsertInventoryItem } from './inventoryChanges'
import type { InventoryItem } from './types'

const item = (id: string, displayName: string): InventoryItem => ({
  id, displayName, manufacturer: 'Maker', model: displayName, category: 'LENS', ownershipStatus: 'OWNED', collectionRole: 'KEEPER', mount: 'M42',
  compatibility: {}, specifications: {}, description: '', personalNotes: '', tags: [], referenceImages: [], thumbnail: null, detailImage: null, links: [],
})

describe('inventory changes', () => {
  it('merges edits, additions, and deletions over the repository inventory', () => {
    let changes = upsertInventoryItem(emptyInventoryChanges, item('seed-a', 'Edited A'))
    changes = upsertInventoryItem(changes, item('new-c', 'New C'))
    changes = deleteInventoryItem(changes, 'seed-b')

    expect(applyInventoryChanges([item('seed-a', 'Seed A'), item('seed-b', 'Seed B')], changes).map((entry) => entry.displayName)).toEqual(['Edited A', 'New C'])
  })

  it('creates stable, collision-free item IDs', () => {
    expect(createInventoryId('Asahi SMC Takumar 55mm f/1.8', [])).toBe('asahi-smc-takumar-55mm-f-1-8')
    expect(createInventoryId('New item', ['new-item', 'new-item-2'])).toBe('new-item-3')
  })
})
