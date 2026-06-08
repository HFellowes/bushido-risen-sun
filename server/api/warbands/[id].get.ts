import { getDb } from '#server/database/db'
import { warbands } from '#server/database/schema'
import { eq } from 'drizzle-orm'

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')!
  const db = getDb()
  const [row] = await db.select().from(warbands).where(eq(warbands.id, id))

  if (!row) throw createError({ statusCode: 404, message: 'Warband not found' })

  return {
    id:        row.id,
    name:      row.name,
    faction:   row.faction,
    riceLimit: row.riceLimit,
    slots:     JSON.parse(row.slots),
    notes:     row.notes,
    createdAt: row.createdAt,
    updatedAt: row.updatedAt,
  }
})
