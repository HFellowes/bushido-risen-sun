import { getDb } from '#server/database/db'
import { warbands } from '#server/database/schema'
import { eq } from 'drizzle-orm'

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')!
  const db = getDb()
  await db.delete(warbands).where(eq(warbands.id, id))
  return { success: true }
})
