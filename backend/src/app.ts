import express from 'express'
import cors from 'cors'
import { publicRouter, adminRouter } from './routes.js'

const app = express()
app.use(cors())
app.use(express.json())

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok' })
})

app.use('/api', publicRouter)
app.use('/api/admin', adminRouter)

export default app
