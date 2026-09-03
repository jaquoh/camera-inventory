import type { InventoryFilters, InventoryItem, Mount } from './types'

export const mountLabels: Record<Mount, string> = {
  SONY_E: 'Sony E',
  M42: 'M42',
  MINOLTA_MC_MD: 'Minolta MC/MD',
  CONTAX_YASHICA: 'C/Y',
  CANON_FD: 'Canon FD',
  NIKON_F: 'Nikon F',
  CANON_EF: 'Canon EF',
}

export function calculateEquivalentFocalLength(focalLength: number, cropFactor: number): number
export function calculateEquivalentFocalLength(focalLength: [number, number], cropFactor: number): [number, number]
export function calculateEquivalentFocalLength(focalLength: number | [number, number], cropFactor: number) {
  if (Array.isArray(focalLength)) return focalLength.map((value) => value * cropFactor) as [number, number]
  return focalLength * cropFactor
}

export function filterInventory(items: InventoryItem[], filters: InventoryFilters): InventoryItem[] {
  const search = filters.search?.trim().toLocaleLowerCase()
  return items.filter((item) => {
    const searchable = [item.displayName, item.manufacturer, item.model, item.mount ? mountLabels[item.mount] : '', ...item.tags]
      .join(' ')
      .toLocaleLowerCase()
    return (!search || searchable.includes(search))
      && (!filters.ownership || filters.ownership === 'ALL' || item.ownershipStatus === filters.ownership)
      && (!filters.mount || filters.mount === 'ALL' || item.mount === filters.mount)
      && (!filters.role || filters.role === 'ALL' || item.collectionRole === filters.role)
      && (!filters.category || filters.category === 'ALL' || item.category === filters.category)
  })
}

export function findMountPath(lens: InventoryItem, camera: InventoryItem, adapters: InventoryItem[]): string[] | null {
  if (!lens.mount || !camera.mount) return null
  if (lens.mount === camera.mount) return [lens.id, camera.id]
  const adapter = adapters.find((item) =>
    item.category === 'ADAPTER'
    && item.compatibility.sourceMount === lens.mount
    && item.compatibility.targetMount === camera.mount,
  )
  return adapter ? [lens.id, adapter.id, camera.id] : null
}

export function getBackpackWarnings(packedIds: string[], items: InventoryItem[]): string[] {
  const packed = packedIds.map((id) => items.find((item) => item.id === id)).filter((item): item is InventoryItem => Boolean(item))
  const camera = packed.find((item) => item.category === 'CAMERA')
  if (!camera) return []

  return packed.filter((item) => item.category === 'LENS').flatMap((lens) => {
    if (lens.mount === camera.mount) return []
    const path = findMountPath(lens, camera, items.filter((item) => item.category === 'ADAPTER'))
    if (!path) return [`${lens.displayName} has no known mount path to ${camera.displayName}.`]
    const adapterId = path[1]
    if (packedIds.includes(adapterId)) return []
    const adapter = items.find((item) => item.id === adapterId)
    return [`Pack ${adapter?.displayName ?? 'the required adapter'} to mount ${lens.displayName}.`]
  })
}
