import { readFileSync, existsSync } from 'fs'
import { join } from 'path'

export default defineEventHandler((event) => {
  const slug = getRouterParam(event, 'slug') ?? ''
  const filePath = join(process.cwd(), 'app', 'data', 'rules', `${slug}.json`)

  if (!existsSync(filePath)) {
    throw createError({ statusCode: 404, message: `Rule "${slug}" not found` })
  }

  return JSON.parse(readFileSync(filePath, 'utf-8'))
})
