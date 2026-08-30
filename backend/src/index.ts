import express from 'express'
import cors from 'cors'
import { publicRouter, adminRouter } from './routes.js'
import { seedDatabase } from './seed.js'

const PORT = Number(process.env.PORT ?? 3001)

seedDatabase()

const app = express()
app.use(cors())
app.use(express.json())

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok' })
})

app.use('/api', publicRouter)
app.use('/api/admin', adminRouter)

app.listen(PORT, () => {
  console.log(`LuxeLife API running on http://localhost:${PORT}`)
})
