import { getDb } from '#server/database/db'
import { warbands } from '#server/database/schema'
import { eq } from 'drizzle-orm'

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')!
  const body = await readBody(event)
  const db = getDb()

  const now = new Date().toISOString()
  await db.update(warbands)
    .set({
      name:      body.name,
      faction:   body.faction,
      riceLimit: body.riceLimit,
      slots:     JSON.stringify(body.slots ?? []),
      notes:     body.notes ?? '',
      updatedAt: now,
    })
    .where(eq(warbands.id, id))

  return { ...body, updatedAt: now }
})
