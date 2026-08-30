import type { IncomingMessage, ServerResponse } from 'node:http'
import app from '../backend/src/app'

export default function handler(req: IncomingMessage, res: ServerResponse) {
  const url = req.url ?? '/'
  if (!url.startsWith('/api')) {
    req.url = url.startsWith('/') ? `/api${url}` : `/api/${url}`
  }
  app(req, res)
}


export default function handler(req: IncomingMessage, res: ServerResponse) {
  const url = req.url ?? '/'
  if (!url.startsWith('/api')) {
    req.url = url.startsWith('/') ? `/api${url}` : `/api/${url}`
  }
  app(req, res)
}
