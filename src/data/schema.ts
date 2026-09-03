import { z } from 'zod'
import { collectionRoles, itemCategories, mounts, ownershipStatuses, type InventoryItem } from '../domain/types'

const optionalText = z.string().nullable().optional()

export const inventoryItemSchema = z.object({
  id: z.string().regex(/^[a-z0-9-]+$/),
  category: z.enum(itemCategories),
  manufacturer: z.string().min(1),
  model: z.string().min(1),
  displayName: z.string().min(1),
  ownershipStatus: z.enum(ownershipStatuses),
  collectionRole: z.enum(collectionRoles),
  mount: z.enum(mounts).nullable(),
  compatibility: z.object({
    cropFactor: z.number().positive().optional(),
    sourceMount: z.enum(mounts).optional(),
    targetMount: z.enum(mounts).optional(),
    usedWith: z.array(z.string()).optional(),
  }),
  acquisition: z.object({
    price: z.number().nonnegative().nullable().optional(),
    currency: optionalText,
    date: optionalText,
    source: optionalText,
    condition: optionalText,
    notes: optionalText,
  }).optional(),
  specifications: z.record(z.string(), z.union([z.string(), z.number(), z.boolean(), z.null()])),
  description: z.string(),
  personalNotes: z.string(),
  tags: z.array(z.string()),
  referenceImages: z.array(z.string()),
  thumbnail: z.string().nullable(),
  detailImage: z.string().nullable(),
  links: z.array(z.object({ label: z.string(), url: z.url() })),
}) satisfies z.ZodType<InventoryItem>
