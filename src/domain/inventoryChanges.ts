import type { InventoryItem } from './types'

export interface InventoryChanges {
  upserts: InventoryItem[]
  deletedIds: string[]
}

export const emptyInventoryChanges: InventoryChanges = { upserts: [], deletedIds: [] }

export function applyInventoryChanges(seed: InventoryItem[], changes: InventoryChanges): InventoryItem[] {
  const deleted = new Set(changes.deletedIds)
  const overrides = new Map(changes.upserts.map((item) => [item.id, item]))
  const merged = seed.filter((item) => !deleted.has(item.id)).map((item) => overrides.get(item.id) ?? item)
  const seedIds = new Set(seed.map((item) => item.id))
  merged.push(...changes.upserts.filter((item) => !seedIds.has(item.id) && !deleted.has(item.id)))
  return merged.sort((a, b) => a.displayName.localeCompare(b.displayName))
}

export function upsertInventoryItem(changes: InventoryChanges, item: InventoryItem): InventoryChanges {
  return {
    upserts: [...changes.upserts.filter((candidate) => candidate.id !== item.id), item],
    deletedIds: changes.deletedIds.filter((id) => id !== item.id),
  }
}

export function deleteInventoryItem(changes: InventoryChanges, id: string): InventoryChanges {
  return {
    upserts: changes.upserts.filter((item) => item.id !== id),
    deletedIds: [...new Set([...changes.deletedIds, id])],
  }
}

export function createInventoryId(label: string, existingIds: string[]): string {
  const base = label.toLowerCase().normalize('NFKD').replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') || 'new-item'
  if (!existingIds.includes(base)) return base
  let suffix = 2
  while (existingIds.includes(`${base}-${suffix}`)) suffix += 1
  return `${base}-${suffix}`
}
