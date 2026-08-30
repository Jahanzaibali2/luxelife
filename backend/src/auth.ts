import { randomBytes } from 'crypto'
import type { Request, Response, NextFunction } from 'express'

const ADMIN_ID = process.env.ADMIN_ID ?? 'admin'
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD ?? 'admin'
const tokens = new Map<string, number>()
const TOKEN_TTL_MS = 24 * 60 * 60 * 1000

export function createToken(): string {
  const token = randomBytes(32).toString('hex')
  tokens.set(token, Date.now() + TOKEN_TTL_MS)
  return token
}

export function validateToken(token: string | undefined): boolean {
  if (!token) return false
  const expiry = tokens.get(token)
  if (!expiry) return false
  if (Date.now() > expiry) {
    tokens.delete(token)
    return false
  }
  return true
}

export function loginHandler(req: Request, res: Response) {
  const { username, id, password } = req.body as {
    username?: string
    id?: string
    password?: string
  }
  const loginId = username ?? id
  if (loginId !== ADMIN_ID || password !== ADMIN_PASSWORD) {
    res.status(401).json({ error: 'Invalid credentials' })
    return
  }
  const token = createToken()
  res.json({ token })
}

export function requireAuth(req: Request, res: Response, next: NextFunction) {
  const header = req.headers.authorization
  const token = header?.startsWith('Bearer ') ? header.slice(7) : undefined
  if (!validateToken(token)) {
    res.status(401).json({ error: 'Unauthorized' })
    return
  }
  next()
}
