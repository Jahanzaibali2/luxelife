import { getSupabase } from './supabase'
import type { AdminStats, Currency, Order, OrderStatus, Product } from '../types/api'

type ProductRow = {
  id: string
  slug: string
  name: string
  subtitle: string
  description: string
  price: number
  currency: Currency
  image: string
  gallery: string[] | null
  category: Product['category']
  badge: Product['badge'] | null
  in_stock: boolean
  preorder: boolean
  created_at: string
  updated_at: string
}

type OrderRow = {
  id: string
  order_number: string
  status: OrderStatus
  customer: Order['customer']
  items: Order['items']
  subtotal: number
  currency: Currency
  payment_method: string
  created_at: string
  updated_at: string
}

function mapProduct(row: ProductRow): Product {
  return {
    id: row.id,
    slug: row.slug,
    name: row.name,
    subtitle: row.subtitle,
    description: row.description,
    price: Number(row.price),
    currency: row.currency,
    image: row.image,
    gallery: row.gallery ?? [],
    category: row.category,
    badge: row.badge ?? undefined,
    inStock: row.in_stock,
    preorder: row.preorder,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  }
}

function mapOrder(row: OrderRow): Order {
  return {
    id: row.id,
    orderNumber: row.order_number,
    status: row.status,
    customer: row.customer,
    items: row.items,
    subtotal: Number(row.subtotal),
    currency: row.currency,
    paymentMethod: row.payment_method,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  }
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
}

function throwIfError(error: { message: string } | null) {
  if (error) throw new Error(error.message)
}

function apiUrl(path: string): string {
  const base = import.meta.env.VITE_API_URL
  if (!base) {
    throw new Error('Missing VITE_API_URL. Set it in frontend/.env.local to your backend URL (e.g. http://localhost:3001).')
  }
  return `${base}${path}`
}

async function apiFetch<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(apiUrl(path), {
    ...init,
    headers: { 'Content-Type': 'application/json', ...init?.headers },
  })
  const data = await res.json()
  if (!res.ok) throw new Error(data.error ?? `Request failed (${res.status})`)
  return data as T
}

export const api = {
  async getProducts(): Promise<Product[]> {
    const { data, error } = await getSupabase()
      .from('products')
      .select('*')
      .order('created_at', { ascending: false })
    throwIfError(error)
    return (data ?? []).map(mapProduct)
  },

  async getProduct(slug: string): Promise<Product> {
    const { data, error } = await getSupabase()
      .from('products')
      .select('*')
      .eq('slug', slug)
      .maybeSingle()
    throwIfError(error)
    if (!data) throw new Error('Product not found')
    return mapProduct(data)
  },

  async createOrder(input: {
    customer: Order['customer']
    items: Order['items']
    subtotal: number
    currency: Currency
    paymentMethod: string
    paymentProvider: Order['paymentProvider']
  }): Promise<Order> {
    if (!input.items.length) throw new Error('Your cart is empty')
    return apiFetch<Order>('/api/orders', {
      method: 'POST',
      body: JSON.stringify(input),
    })
  },

  async createZiinaPayment(
    orderId: string,
    successUrl: string,
    cancelUrl: string,
  ): Promise<{ redirectUrl: string }> {
    return apiFetch('/api/payments/ziina/create', {
      method: 'POST',
      body: JSON.stringify({ orderId, successUrl, cancelUrl }),
    })
  },

  async getZiinaPaymentStatus(orderId: string): Promise<Order> {
    return apiFetch(`/api/payments/ziina/status/${orderId}`)
  },
}

export const adminApi = {
  // ponytail: sample login, no real auth
  async login(username: string, password: string): Promise<{ token: string }> {
    if (username.trim() !== 'admin' || password !== 'admin') {
      throw new Error('Invalid ID or password.')
    }
    return { token: 'sample-admin' }
  },

  async getProducts(): Promise<Product[]> {
    return api.getProducts()
  },

  async getProduct(id: string): Promise<Product> {
    const { data, error } = await getSupabase()
      .from('products')
      .select('*')
      .eq('id', id)
      .maybeSingle()
    throwIfError(error)
    if (!data) throw new Error('Product not found')
    return mapProduct(data)
  },

  async createProduct(input: Partial<Product>): Promise<Product> {
    const name = input.name?.trim()
    if (!name || !input.price || !input.image) {
      throw new Error('Name, price, and image are required')
    }
    const slug = input.slug?.trim() || slugify(name)
    const now = new Date().toISOString()
    const { data, error } = await getSupabase()
      .from('products')
      .insert({
        id: slug,
        slug,
        name,
        subtitle: input.subtitle ?? '',
        description: input.description ?? '',
        price: Number(input.price),
        currency: input.currency ?? 'AED',
        image: input.image,
        gallery: input.gallery ?? [],
        category: input.category ?? 'fashion',
        badge: input.badge ?? null,
        in_stock: input.inStock ?? true,
        preorder: input.preorder ?? false,
        created_at: now,
        updated_at: now,
      })
      .select('*')
      .single()
    throwIfError(error)
    return mapProduct(data)
  },

  async updateProduct(id: string, updates: Partial<Product>): Promise<Product> {
    const existing = await this.getProduct(id)
    const merged = {
      ...existing,
      ...updates,
      id: existing.id,
      price: updates.price !== undefined ? Number(updates.price) : existing.price,
      updatedAt: new Date().toISOString(),
    }
    const { data, error } = await getSupabase()
      .from('products')
      .update({
        slug: merged.slug,
        name: merged.name,
        subtitle: merged.subtitle,
        description: merged.description ?? '',
        price: merged.price,
        currency: merged.currency,
        image: merged.image,
        gallery: merged.gallery ?? [],
        category: merged.category,
        badge: merged.badge ?? null,
        in_stock: merged.inStock,
        preorder: merged.preorder ?? false,
        updated_at: merged.updatedAt,
      })
      .eq('id', id)
      .select('*')
      .single()
    throwIfError(error)
    return mapProduct(data)
  },

  async deleteProduct(id: string): Promise<void> {
    const { error } = await getSupabase().from('products').delete().eq('id', id)
    throwIfError(error)
  },

  async uploadImage(file: File, slug?: string, filename = 'main'): Promise<{ url: string; slug: string }> {
    const folder = slug?.trim() || `upload-${Date.now()}`
    const ext = file.name.split('.').pop()?.toLowerCase() || 'jpg'
    const path = `${folder}/${filename}.${ext}`
    const { error } = await getSupabase().storage.from('product-images').upload(path, file, {
      upsert: true,
      contentType: file.type || 'image/jpeg',
    })
    throwIfError(error)
    const { data } = getSupabase().storage.from('product-images').getPublicUrl(path)
    return { url: data.publicUrl, slug: folder }
  },

  async getOrders(): Promise<Order[]> {
    const { data, error } = await getSupabase()
      .from('orders')
      .select('*')
      .order('created_at', { ascending: false })
    throwIfError(error)
    return (data ?? []).map(mapOrder)
  },

  async getOrder(id: string): Promise<Order> {
    const { data, error } = await getSupabase()
      .from('orders')
      .select('*')
      .eq('id', id)
      .maybeSingle()
    throwIfError(error)
    if (!data) throw new Error('Order not found')
    return mapOrder(data)
  },

  async updateOrderStatus(id: string, status: OrderStatus): Promise<Order> {
    const { data, error } = await getSupabase()
      .from('orders')
      .update({ status, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select('*')
      .single()
    throwIfError(error)
    return mapOrder(data)
  },

  async getStats(): Promise<AdminStats> {
    const [products, orders] = await Promise.all([this.getProducts(), this.getOrders()])
    return {
      totalProducts: products.length,
      totalOrders: orders.length,
      pendingOrders: orders.filter((o) => o.status === 'pending').length,
      totalRevenue: orders
        .filter((o) => o.status !== 'cancelled')
        .reduce((sum, o) => sum + o.subtotal, 0),
      lowStock: products.filter((p) => !p.inStock).length,
    }
  },
}
