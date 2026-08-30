import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'fs'
import { dirname, join } from 'path'
import { fileURLToPath } from 'url'
import type { Database } from './types.js'

const __dirname = dirname(fileURLToPath(import.meta.url))
const DB_PATH = join(__dirname, '..', 'data', 'db.json')

const EMPTY_DB: Database = { products: [], orders: [] }

function ensureDbFile() {
  const dir = dirname(DB_PATH)
  if (!existsSync(dir)) mkdirSync(dir, { recursive: true })
  if (!existsSync(DB_PATH)) {
    writeFileSync(DB_PATH, JSON.stringify(EMPTY_DB, null, 2))
  }
}

export function readDb(): Database {
  ensureDbFile()
  const raw = readFileSync(DB_PATH, 'utf-8')
  return JSON.parse(raw) as Database
}

export function writeDb(db: Database) {
  ensureDbFile()
  writeFileSync(DB_PATH, JSON.stringify(db, null, 2))
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
}
