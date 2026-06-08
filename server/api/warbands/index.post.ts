import { getDb } from '#server/database/db'
import { warbands } from '#server/database/schema'
import { randomUUID } from 'crypto'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const { faction, name, riceLimit = 35 } = body

  if (!faction || !name) {
    throw createError({ statusCode: 400, message: 'faction and name are required' })
  }

  const now = new Date().toISOString()
  const id = randomUUID()

  const db = getDb()
  await db.insert(warbands).values({
    id,
    name,
    faction,
    riceLimit,
    slots:    '[]',
    notes:    '',
    createdAt: now,
    updatedAt: now,
  })

  return {
    id,
    name,
    faction,
    riceLimit,
    slots:     [],
    notes:     '',
    createdAt: now,
    updatedAt: now,
  }
})
