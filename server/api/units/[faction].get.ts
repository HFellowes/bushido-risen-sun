import { readFileSync, existsSync } from 'fs'
import { join } from 'path'

export default defineEventHandler((event) => {
  const faction = getRouterParam(event, 'faction')!
  const filePath = join(process.cwd(), 'app', 'data', 'units', `${faction}.json`)

  if (!existsSync(filePath)) {
    throw createError({
      statusCode: 404,
      message: `No data for faction "${faction}". Run \`npm run fetch-data\` first.`,
    })
  }

  return JSON.parse(readFileSync(filePath, 'utf-8'))
})
