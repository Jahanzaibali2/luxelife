import { Router } from 'express'
import multer from 'multer'
import { loginHandler, requireAuth } from './auth.js'
import * as repo from './repository.js'
import { uploadProductImage } from './storage.js'
import type { Currency, Order, OrderStatus, Product } from './types.js'
import { slugify } from './utils.js'

export const publicRouter = Router()
export const adminRouter = Router()

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true)
    } else {
      cb(new Error('Only image files are allowed'))
    }
  },
})

function handleError(res: import('express').Response, err: unknown) {
  console.error(err)
  res.status(500).json({ error: 'Internal server error' })
}

// --- Public routes ---

publicRouter.get('/products', async (_req, res) => {
  try {
    const products = await repo.listProducts()
    res.json(products)
  } catch (err) {
    handleError(res, err)
  }
})

publicRouter.get('/products/:slug', async (req, res) => {
  try {
    const product = await repo.getProductBySlug(req.params.slug)
    if (!product) {
      res.status(404).json({ error: 'Product not found' })
      return
    }
    res.json(product)
  } catch (err) {
    handleError(res, err)
  }
})

publicRouter.post('/orders', async (req, res) => {
  try {
    const body = req.body as {
      customer: Order['customer']
      items: Order['items']
      subtotal: number
      currency: Currency
      paymentMethod: string
    }

    if (!body.customer?.email || !body.items?.length) {
      res.status(400).json({ error: 'Invalid order data' })
      return
    }

    const order = await repo.createOrder({
      customer: body.customer,
      items: body.items,
      subtotal: body.subtotal,
      currency: body.currency,
      paymentMethod: body.paymentMethod,
    })
    res.status(201).json(order)
  } catch (err) {
    handleError(res, err)
  }
})

// --- Admin auth ---

adminRouter.post('/login', loginHandler)

// --- Admin routes (protected) ---

adminRouter.use(requireAuth)

adminRouter.post('/upload', upload.single('file'), async (req, res) => {
  try {
    const file = req.file
    if (!file) {
      res.status(400).json({ error: 'Image file is required' })
      return
    }

    const slug =
      (req.body.slug as string | undefined)?.trim() ||
      slugify((req.body.name as string | undefined) ?? '') ||
      `upload-${Date.now()}`

    const url = await uploadProductImage(slug, file.buffer, file.mimetype)
    res.json({ url, slug })
  } catch (err) {
    handleError(res, err)
  }
})

adminRouter.get('/stats', async (_req, res) => {
  try {
    res.json(await repo.getStats())
  } catch (err) {
    handleError(res, err)
  }
})

adminRouter.get('/products', async (_req, res) => {
  try {
    res.json(await repo.listProducts())
  } catch (err) {
    handleError(res, err)
  }
})

adminRouter.get('/products/:id', async (req, res) => {
  try {
    const product = await repo.getProductById(req.params.id)
    if (!product) {
      res.status(404).json({ error: 'Product not found' })
      return
    }
    res.json(product)
  } catch (err) {
    handleError(res, err)
  }
})

adminRouter.post('/products', async (req, res) => {
  try {
    const body = req.body as Partial<Product>
    const name = body.name?.trim()
    if (!name || !body.price || !body.image) {
      res.status(400).json({ error: 'Name, price, and image are required' })
      return
    }

    const slug = body.slug?.trim() || slugify(name)
    if (await repo.slugExists(slug)) {
      res.status(409).json({ error: 'Product slug already exists' })
      return
    }

    const product = await repo.createProduct({
      id: slug,
      slug,
      name,
      subtitle: body.subtitle ?? '',
      description: body.description ?? '',
      price: Number(body.price),
      currency: body.currency ?? 'AED',
      image: body.image,
      gallery: body.gallery ?? [],
      category: body.category ?? 'fashion',
      badge: body.badge,
      inStock: body.inStock ?? true,
      preorder: body.preorder ?? false,
    })
    res.status(201).json(product)
  } catch (err) {
    handleError(res, err)
  }
})

adminRouter.put('/products/:id', async (req, res) => {
  try {
    const existing = await repo.getProductById(req.params.id)
    if (!existing) {
      res.status(404).json({ error: 'Product not found' })
      return
    }

    const body = req.body as Partial<Product>
    const slug = body.slug?.trim() || existing.slug

    if (slug !== existing.slug && (await repo.slugExists(slug, existing.id))) {
      res.status(409).json({ error: 'Product slug already exists' })
      return
    }

    const updated = await repo.updateProduct(req.params.id, { ...body, slug })
    res.json(updated)
  } catch (err) {
    handleError(res, err)
  }
})

adminRouter.delete('/products/:id', async (req, res) => {
  try {
    const deleted = await repo.deleteProduct(req.params.id)
    if (!deleted) {
      res.status(404).json({ error: 'Product not found' })
      return
    }
    res.status(204).send()
  } catch (err) {
    handleError(res, err)
  }
})

adminRouter.get('/orders', async (_req, res) => {
  try {
    res.json(await repo.listOrders())
  } catch (err) {
    handleError(res, err)
  }
})

adminRouter.get('/orders/:id', async (req, res) => {
  try {
    const order = await repo.getOrderById(req.params.id)
    if (!order) {
      res.status(404).json({ error: 'Order not found' })
      return
    }
    res.json(order)
  } catch (err) {
    handleError(res, err)
  }
})

adminRouter.patch('/orders/:id', async (req, res) => {
  try {
    const { status } = req.body as { status?: OrderStatus }
    const valid: OrderStatus[] = [
      'pending',
      'processing',
      'shipped',
      'delivered',
      'cancelled',
    ]
    if (!status || !valid.includes(status)) {
      res.status(400).json({ error: 'Invalid status' })
      return
    }

    const order = await repo.updateOrderStatus(req.params.id, status)
    if (!order) {
      res.status(404).json({ error: 'Order not found' })
      return
    }
    res.json(order)
  } catch (err) {
    handleError(res, err)
  }
})
