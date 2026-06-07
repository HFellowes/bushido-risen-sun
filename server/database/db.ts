import { drizzle } from 'drizzle-orm/better-sqlite3'
import Database from 'better-sqlite3'
import { mkdirSync, existsSync } from 'fs'
import { dirname } from 'path'
import * as schema from './schema'

let _db: ReturnType<typeof drizzle> | null = null

export function getDb() {
  if (_db) return _db

  const dbPath = process.env.DB_PATH ?? './data/bushido.db'

  // Ensure directory exists
  const dir = dirname(dbPath)
  if (!existsSync(dir)) mkdirSync(dir, { recursive: true })

  const sqlite = new Database(dbPath)

  // Enable WAL mode for better concurrent read performance
  sqlite.pragma('journal_mode = WAL')
  sqlite.pragma('foreign_keys = ON')

  _db = drizzle(sqlite, { schema })
  runMigrations(sqlite)

  return _db
}

function runMigrations(sqlite: Database.Database) {
  sqlite.exec(`
    CREATE TABLE IF NOT EXISTS warbands (
      id          TEXT PRIMARY KEY,
      name        TEXT NOT NULL,
      faction     TEXT NOT NULL,
      rice_limit  INTEGER NOT NULL DEFAULT 35,
      slots       TEXT NOT NULL DEFAULT '[]',
      notes       TEXT NOT NULL DEFAULT '',
      created_at  TEXT NOT NULL,
      updated_at  TEXT NOT NULL
    );
  `)
}
