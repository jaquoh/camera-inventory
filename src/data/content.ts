import { z } from 'zod'
import { inventoryItemSchema } from './schema'
import type { InventoryItem } from '../domain/types'

const inventoryModules = import.meta.glob('../../data/inventory/**/*.json', { eager: true, import: 'default' })

export const inventory: InventoryItem[] = Object.values(inventoryModules)
  .map((value) => inventoryItemSchema.parse(value, { reportInput: true }))
  .sort((a, b) => a.displayName.localeCompare(b.displayName))

const uniqueIds = new Set(inventory.map((item) => item.id))
if (uniqueIds.size !== inventory.length) throw new Error('Inventory item IDs must be unique.')

export const goalSchema = z.object({
  id: z.string(), title: z.string(), description: z.string(),
  status: z.enum(['ACTIVE', 'SOMEDAY', 'COMPLETED', 'BLOCKED']),
  priority: z.enum(['HIGH', 'MEDIUM', 'LOW']), relatedGear: z.array(z.string()), tags: z.array(z.string()),
  notes: z.string(), createdAt: z.string().nullable(), completedAt: z.string().nullable(),
})
export type Goal = z.infer<typeof goalSchema>

export const tipSchema = z.object({
  id: z.string(), title: z.string(), body: z.string(), category: z.string(), relatedGear: z.array(z.string()), tags: z.array(z.string()),
})
export type Tip = z.infer<typeof tipSchema>

const goalModules = import.meta.glob('../../data/goals/*.json', { eager: true, import: 'default' })
const tipModules = import.meta.glob('../../data/tips/*.json', { eager: true, import: 'default' })
export const goals = Object.values(goalModules).map((goal) => goalSchema.parse(goal))
export const tips = Object.values(tipModules).map((tip) => tipSchema.parse(tip))

export interface NotebookPage {
  id: string
  title: string
  tab: string
  order: number
  summary: string
  body: string
}

function parseNotebookPage(source: string): NotebookPage {
  const match = source.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/)
  if (!match) throw new Error('Notebook pages require frontmatter.')
  const metadata = Object.fromEntries(match[1].split('\n').map((line) => {
    const separator = line.indexOf(':')
    return [line.slice(0, separator).trim(), line.slice(separator + 1).trim()]
  }))
  return {
    id: metadata.id,
    title: metadata.title,
    tab: metadata.tab,
    order: Number(metadata.order),
    summary: metadata.summary,
    body: match[2],
  }
}

const notebookModules = import.meta.glob('../../data/notebook/**/*.md', { eager: true, query: '?raw', import: 'default' })
export const notebookPages = Object.values(notebookModules)
  .map((source) => parseNotebookPage(source as string))
  .sort((a, b) => a.tab.localeCompare(b.tab) || a.order - b.order)
