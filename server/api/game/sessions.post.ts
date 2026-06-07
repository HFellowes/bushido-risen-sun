import { randomUUID } from 'crypto'

function generateCode(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789' // no ambiguous chars
  let code = ''
  for (let i = 0; i < 4; i++) {
    code += chars[Math.floor(Math.random() * chars.length)]
  }
  return code
}

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const { warbandId } = body

  const code = generateCode()
  const playerId = randomUUID()

  return { code, playerId }
})
