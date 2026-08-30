import 'dotenv/config'
import app from './app.js'
import { seedDatabase } from './seed.js'

const PORT = Number(process.env.PORT ?? 3001)

async function start() {
  try {
    await seedDatabase()
  } catch (err) {
    console.error('Failed to seed database:', err)
    process.exit(1)
  }

  app.listen(PORT, () => {
    console.log(`LuxeLife API running on http://localhost:${PORT}`)
  })
}

start()
