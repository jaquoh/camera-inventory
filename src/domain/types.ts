export const ownershipStatuses = ['OWNED', 'ON_THE_WAY', 'WISHLIST', 'PLANNED', 'CONSIDERING', 'SOLD'] as const
export type OwnershipStatus = (typeof ownershipStatuses)[number]

export const collectionRoles = ['KEEPER', 'EXPERIMENT', 'TEMPORARY', 'RESELL', 'UTILITY', 'FUTURE'] as const
export type CollectionRole = (typeof collectionRoles)[number]

export const itemCategories = ['CAMERA', 'LENS', 'ADAPTER', 'ACCESSORY'] as const
export type ItemCategory = (typeof itemCategories)[number]

export const mounts = ['SONY_E', 'M42', 'MINOLTA_MC_MD', 'CONTAX_YASHICA', 'CANON_FD', 'NIKON_F', 'CANON_EF'] as const
export type Mount = (typeof mounts)[number]

export interface Acquisition {
  price?: number | null
  currency?: string | null
  date?: string | null
  source?: string | null
  condition?: string | null
  notes?: string | null
}

export interface InventoryItem {
  id: string
  category: ItemCategory
  manufacturer: string
  model: string
  displayName: string
  ownershipStatus: OwnershipStatus
  collectionRole: CollectionRole
  mount: Mount | null
  compatibility: {
    cropFactor?: number
    sourceMount?: Mount
    targetMount?: Mount
    usedWith?: string[]
  }
  acquisition?: Acquisition
  specifications: Record<string, string | number | boolean | null>
  description: string
  personalNotes: string
  tags: string[]
  referenceImages: string[]
  thumbnail: string | null
  detailImage: string | null
  links: Array<{ label: string; url: string }>
}

export interface InventoryFilters {
  search?: string
  ownership?: OwnershipStatus | 'ALL'
  mount?: Mount | 'ALL'
  role?: CollectionRole | 'ALL'
  category?: ItemCategory | 'ALL'
}
