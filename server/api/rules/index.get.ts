import { readFileSync, existsSync } from 'fs'
import { join } from 'path'

export default defineEventHandler(() => {
  const indexPath = join(process.cwd(), 'app', 'data', 'rules-index.json')
  if (!existsSync(indexPath)) return []
  return JSON.parse(readFileSync(indexPath, 'utf-8'))
})
