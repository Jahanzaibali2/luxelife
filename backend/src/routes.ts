import { Router } from 'express'
import { v4 as uuidv4 } from 'uuid'
import { readDb, writeDb, slugify } from './db.js'
import { loginHandler, requireAuth } from './auth.js'
import type { Order, OrderStatus, Product } from './types.js'

export const publicRouter = Router()
export const adminRouter = Router()

// --- Public routes ---

publicRouter.get('/products', (_req, res) => {
  const db = readDb()
  res.json(db.products)
})

publicRouter.get('/products/:slug', (req, res) => {
  const db = readDb()
  const product = db.products.find((p) => p.slug === req.params.slug)
  if (!product) {
    res.status(404).json({ error: 'Product not found' })
    return
  }
  res.json(product)
})

publicRouter.post('/orders', (req, res) => {
  const db = readDb()
  const body = req.body as {
    customer: Order['customer']
    items: Order['items']
    subtotal: number
    currency: '$' | 'AED'
    paymentMethod: string
  }

  if (!body.customer?.email || !body.items?.length) {
    res.status(400).json({ error: 'Invalid order data' })
    return
  }

  const now = new Date().toISOString()
  const orderNumber = `LL-${Date.now().toString().slice(-8)}`

  const order: Order = {
    id: uuidv4(),
    orderNumber,
    status: 'pending',
    createdAt: now,
    updatedAt: now,
    customer: body.customer,
    items: body.items,
    subtotal: body.subtotal,
    currency: body.currency,
    paymentMethod: body.paymentMethod,
  }

  db.orders.unshift(order)
  writeDb(db)
  res.status(201).json(order)
})

// --- Admin auth ---

adminRouter.post('/login', loginHandler)

// --- Admin routes (protected) ---

adminRouter.use(requireAuth)

adminRouter.get('/stats', (_req, res) => {
  const db = readDb()
  const pendingOrders = db.orders.filter((o) => o.status === 'pending').length
  const totalRevenue = db.orders
    .filter((o) => o.status !== 'cancelled')
    .reduce((sum, o) => sum + o.subtotal, 0)
  const lowStock = db.products.filter((p) => !p.inStock).length

  res.json({
    totalProducts: db.products.length,
    totalOrders: db.orders.length,
    pendingOrders,
    totalRevenue,
    lowStock,
  })
})

adminRouter.get('/products', (_req, res) => {
  res.json(readDb().products)
})

adminRouter.get('/products/:id', (req, res) => {
  const product = readDb().products.find((p) => p.id === req.params.id)
  if (!product) {
    res.status(404).json({ error: 'Product not found' })
    return
  }
  res.json(product)
})

adminRouter.post('/products', (req, res) => {
  const db = readDb()
  const body = req.body as Partial<Product>
  const now = new Date().toISOString()
  const name = body.name?.trim()
  if (!name || !body.price || !body.image) {
    res.status(400).json({ error: 'Name, price, and image are required' })
    return
  }

  const slug = body.slug?.trim() || slugify(name)
  if (db.products.some((p) => p.slug === slug)) {
    res.status(409).json({ error: 'Product slug already exists' })
    return
  }

  const product: Product = {
    id: slug,
    slug,
    name,
    subtitle: body.subtitle ?? '',
    description: body.description ?? '',
    price: Number(body.price),
    currency: body.currency ?? '$',
    image: body.image,
    gallery: body.gallery ?? [],
    category: body.category ?? 'fashion',
    badge: body.badge,
    inStock: body.inStock ?? true,
    preorder: body.preorder ?? false,
    createdAt: now,
    updatedAt: now,
  }

  db.products.unshift(product)
  writeDb(db)
  res.status(201).json(product)
})

adminRouter.put('/products/:id', (req, res) => {
  const db = readDb()
  const idx = db.products.findIndex((p) => p.id === req.params.id)
  if (idx === -1) {
    res.status(404).json({ error: 'Product not found' })
    return
  }

  const existing = db.products[idx]
  const body = req.body as Partial<Product>
  const slug = body.slug?.trim() || existing.slug

  if (slug !== existing.slug && db.products.some((p) => p.slug === slug)) {
    res.status(409).json({ error: 'Product slug already exists' })
    return
  }

  const updated: Product = {
    ...existing,
    ...body,
    id: existing.id,
    slug,
    price: body.price !== undefined ? Number(body.price) : existing.price,
    updatedAt: new Date().toISOString(),
  }

  db.products[idx] = updated
  writeDb(db)
  res.json(updated)
})

adminRouter.delete('/products/:id', (req, res) => {
  const db = readDb()
  const idx = db.products.findIndex((p) => p.id === req.params.id)
  if (idx === -1) {
    res.status(404).json({ error: 'Product not found' })
    return
  }
  db.products.splice(idx, 1)
  writeDb(db)
  res.status(204).send()
})

adminRouter.get('/orders', (_req, res) => {
  res.json(readDb().orders)
})

adminRouter.get('/orders/:id', (req, res) => {
  const order = readDb().orders.find((o) => o.id === req.params.id)
  if (!order) {
    res.status(404).json({ error: 'Order not found' })
    return
  }
  res.json(order)
})

adminRouter.patch('/orders/:id', (req, res) => {
  const db = readDb()
  const idx = db.orders.findIndex((o) => o.id === req.params.id)
  if (idx === -1) {
    res.status(404).json({ error: 'Order not found' })
    return
  }

  const { status } = req.body as { status?: OrderStatus }
  const valid: OrderStatus[] = ['pending', 'processing', 'shipped', 'delivered', 'cancelled']
  if (!status || !valid.includes(status)) {
    res.status(400).json({ error: 'Invalid status' })
    return
  }

  db.orders[idx] = {
    ...db.orders[idx],
    status,
    updatedAt: new Date().toISOString(),
  }
  writeDb(db)
  res.json(db.orders[idx])
})
