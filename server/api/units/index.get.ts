import { readFileSync, existsSync } from 'fs'
import { join } from 'path'

export default defineEventHandler(() => {
  const indexPath = join(process.cwd(), 'app', 'data', 'index.json')

  if (!existsSync(indexPath)) {
    throw createError({
      statusCode: 404,
      message: 'Unit data not found. Run `npm run fetch-data` first.',
    })
  }

  return JSON.parse(readFileSync(indexPath, 'utf-8'))
})
