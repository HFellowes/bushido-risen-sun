import { getDb } from '~/server/database/db'
import { warbands } from '~/server/database/schema'
import { desc } from 'drizzle-orm'

export default defineEventHandler(async () => {
  const db = getDb()
  const rows = await db.select().from(warbands).orderBy(desc(warbands.updatedAt))

  return rows.map(row => {
    const slots: any[] = JSON.parse(row.slots)
    const riceSpent = slots.reduce((sum: number, s: any) => sum + (s.riceCost ?? 0), 0)
    return {
      id:          row.id,
      name:        row.name,
      faction:     row.faction,
      riceSpent,
      riceLimit:   row.riceLimit,
      modelCount:  slots.length,
      updatedAt:   row.updatedAt,
    }
  })
})
