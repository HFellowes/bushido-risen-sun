/**
 * fetch-jwarref-data.ts
 *
 * Fetches rules content from GCT Studios' open-source JwarRef repository (MIT licensed)
 * and merges with local seed unit data.
 *
 * NOTE: JwarRef does not yet contain unit profiles ("Profiles will follow eventually"
 * per their README). Unit data is maintained in scripts/seed-units/ as JSON files
 * sourced from GCT Studios' official profile card PDFs.
 *
 * Run: npm run fetch-data
 */

import { readFileSync, writeFileSync, mkdirSync, existsSync, readdirSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'
import matter from 'gray-matter'

const __dirname = dirname(fileURLToPath(import.meta.url))
const ROOT = join(__dirname, '..')
const DATA_DIR = join(ROOT, 'app', 'data')
const UNITS_DIR = join(DATA_DIR, 'units')
const RULES_DIR = join(DATA_DIR, 'rules')
const SEED_DIR = join(ROOT, 'scripts', 'seed-units')

const JWARREF_API = 'https://api.github.com/repos/GCT-Studios/JwarRef/contents'
const JWARREF_RAW = 'https://raw.githubusercontent.com/GCT-Studios/JwarRef/v4'
const BRANCH = 'v4'

// Actual folder names in the JwarRef repo (Title-Case, as Quartz/Obsidian uses)
// These are rules chapters, not unit folders
const RULES_CHAPTERS = [
  'Rulebook',
  'Feats',
  'FAQ',
  'Tournament-Pack',
]

async function fetchJson(url: string) {
  const headers: Record<string, string> = {
    'Accept': 'application/vnd.github+json',
    'X-GitHub-Api-Version': '2022-11-28',
    'User-Agent': 'bushido-companion-app',
  }
  if (process.env.GITHUB_TOKEN) {
    headers['Authorization'] = `Bearer ${process.env.GITHUB_TOKEN}`
  }
  const res = await fetch(url, { headers })
  if (!res.ok) throw new Error(`GitHub API error ${res.status}: ${url}`)
  return res.json()
}

async function fetchRaw(path: string): Promise<string> {
  const url = `${JWARREF_RAW}/${path}`
  const headers: Record<string, string> = { 'User-Agent': 'bushido-companion-app' }
  if (process.env.GITHUB_TOKEN) {
    headers['Authorization'] = `Bearer ${process.env.GITHUB_TOKEN}`
  }
  const res = await fetch(url, { headers })
  if (!res.ok) throw new Error(`Raw fetch error ${res.status}: ${url}`)
  return res.text()
}

function ensureDir(dir: string) {
  if (!existsSync(dir)) mkdirSync(dir, { recursive: true })
}

// ─── Unit data from seed files ───────────────────────────────────────────────

async function loadSeedUnits() {
  console.log('\nLoading seed unit data...')
  ensureDir(SEED_DIR)

  const allUnits: any[] = []
  const factionIndex: Record<string, { count: number; units: string[] }> = {}

  if (!existsSync(SEED_DIR)) {
    console.log('  ⚠ No seed directory found. Creating example seed.')
    return { allUnits, factionIndex }
  }

  const files = existsSync(SEED_DIR)
    ? readdirSync(SEED_DIR).filter(f => f.endsWith('.json'))
    : []

  if (files.length === 0) {
    console.log('  ⚠ No seed files found in scripts/seed-units/. Unit cards will be empty.')
    console.log('    Add JSON files there to populate unit data.')
    return { allUnits, factionIndex }
  }

  for (const file of files) {
    const faction = file.replace('.json', '')
    const raw = readFileSync(join(SEED_DIR, file), 'utf-8')
    const units: any[] = JSON.parse(raw)

    writeFileSync(join(UNITS_DIR, file), JSON.stringify(units, null, 2))
    factionIndex[faction] = { count: units.length, units: units.map((u: any) => u.id) }
    allUnits.push(...units)
    console.log(`  ✓ ${faction}: ${units.length} units`)
  }

  return { allUnits, factionIndex }
}

// ─── Rules from JwarRef ───────────────────────────────────────────────────────

async function fetchRulesContent() {
  console.log('\nFetching rules content from JwarRef...')
  ensureDir(RULES_DIR)

  const index: { slug: string; title: string; children: { slug: string; title: string }[] }[] = []

  for (const chapterName of RULES_CHAPTERS) {
    let files: any[]
    try {
      files = await fetchJson(`${JWARREF_API}/content/${chapterName}?ref=${BRANCH}`)
    } catch (e) {
      console.warn(`  ⚠ Could not fetch chapter "${chapterName}": ${(e as Error).message}`)
      continue
    }

    const mdFiles = files.filter((f: any) => f.name.endsWith('.md'))
    if (mdFiles.length === 0) continue

    const chapter = {
      slug: chapterName,
      title: chapterName.replace(/-/g, ' '),
      children: [] as { slug: string; title: string }[],
    }

    ensureDir(join(RULES_DIR, chapterName))

    for (const file of mdFiles) {
      try {
        const raw = await fetchRaw(`content/${chapterName}/${file.name}`)
        const { data: fm, content } = matter(raw)
        const slug = file.name.replace('.md', '')
        const title = fm.title ?? fm.name ?? slug.replace(/-/g, ' ')

        writeFileSync(
          join(RULES_DIR, chapterName, `${slug}.json`),
          JSON.stringify({ slug: `${chapterName}/${slug}`, title, content: content.trim(), frontmatter: fm }, null, 2),
        )

        chapter.children.push({ slug: `${chapterName}/${slug}`, title })
        process.stdout.write('.')
      } catch {
        process.stdout.write('✗')
      }
    }

    console.log(` ${chapterName} [${chapter.children.length} pages]`)
    if (chapter.children.length > 0) index.push(chapter)
  }

  writeFileSync(join(DATA_DIR, 'rules-index.json'), JSON.stringify(index, null, 2))
  return index
}

// ─── Main ─────────────────────────────────────────────────────────────────────

async function main() {
  console.log('🗡  Bushido Risen Sun — Fetching game data\n')

  ensureDir(DATA_DIR)
  ensureDir(UNITS_DIR)

  // 1. Load unit seed data
  const { allUnits, factionIndex } = await loadSeedUnits()

  // Write search index
  const searchIndex = allUnits.map(u => ({
    id:       u.id,
    name:     u.name,
    faction:  u.faction,
    type:     u.type,
    riceCost: u.riceCost,
    traits:   (u.traits ?? []).map((t: any) => t.name),
    kiFeats:  (u.kiFeats ?? []).map((k: any) => k.name),
  }))
  writeFileSync(join(DATA_DIR, 'index.json'), JSON.stringify(searchIndex, null, 2))
  writeFileSync(join(DATA_DIR, 'faction-index.json'), JSON.stringify(factionIndex, null, 2))

  console.log(`\n  ✓ Units: ${allUnits.length} across ${Object.keys(factionIndex).length} factions`)

  // 2. Fetch rules from JwarRef
  try {
    const rulesIndex = await fetchRulesContent()
    const totalPages = rulesIndex.reduce((n, ch) => n + ch.children.length, 0)
    console.log(`  ✓ Rules: ${totalPages} pages across ${rulesIndex.length} chapters`)
  } catch (e) {
    console.warn('\n  ⚠ Rules fetch failed (GitHub may be rate-limiting). Rules will be empty.')
    console.warn('    Set GITHUB_TOKEN env var to avoid rate limits, or run again later.')
    writeFileSync(join(DATA_DIR, 'rules-index.json'), '[]')
  }

  console.log(`\n✓ Done. Data written to app/data/\n`)

  if (allUnits.length === 0) {
    console.log('📝 Next step: Add unit data to scripts/seed-units/')
    console.log('   Create one JSON file per faction, e.g. prefecture-of-ryu.json')
    console.log('   See scripts/seed-units/README.md for the data format.\n')
  }
}

main().catch(e => {
  console.error('\n✗ Failed:', e.message)
  process.exit(1)
})
