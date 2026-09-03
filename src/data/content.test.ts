import { describe, expect, it } from 'vitest'
import { goals, inventory, notebookPages, tips } from './content'

describe('repository content', () => {
  it('loads unique, validated equipment records', () => {
    expect(inventory.length).toBeGreaterThan(10)
    expect(new Set(inventory.map((item) => item.id)).size).toBe(inventory.length)
  })

  it('keeps candidates out of owned inventory', () => {
    const notOwned = ['tair-3-phs', 'canon-fd-24-28', 'nikkor-300-45-ed', 'helios-44-2']
    expect(inventory.filter((item) => notOwned.includes(item.id)).every((item) => item.ownershipStatus !== 'OWNED')).toBe(true)
  })

  it('loads repository-backed notebook, goal, and tip content', () => {
    expect(notebookPages.length).toBeGreaterThan(0)
    expect(goals.length).toBeGreaterThan(0)
    expect(tips.length).toBeGreaterThan(0)
  })
})
