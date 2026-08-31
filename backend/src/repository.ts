import { v4 as uuidv4 } from 'uuid'
import { mapOrder, mapProduct, productToRow } from './mappers.js'
import { getSupabase } from './supabase.js'
import type { Currency, Order, OrderStatus, Product } from './types.js'

export async function listProducts(): Promise<Product[]> {
  const { data, error } = await getSupabase()
    .from('products')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) throw error
  return (data ?? []).map(mapProduct)
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  const { data, error } = await getSupabase()
    .from('products')
    .select('*')
    .eq('slug', slug)
    .maybeSingle()

  if (error) throw error
  return data ? mapProduct(data) : null
}

export async function getProductById(id: string): Promise<Product | null> {
  const { data, error } = await getSupabase()
    .from('products')
    .select('*')
    .eq('id', id)
    .maybeSingle()

  if (error) throw error
  return data ? mapProduct(data) : null
}

export async function slugExists(slug: string, excludeId?: string): Promise<boolean> {
  let query = getSupabase().from('products').select('id').eq('slug', slug)
  if (excludeId) query = query.neq('id', excludeId)

  const { data, error } = await query.maybeSingle()
  if (error) throw error
  return data !== null
}

export async function createProduct(
  product: Omit<Product, 'createdAt' | 'updatedAt'>,
): Promise<Product> {
  const now = new Date().toISOString()
  const row = productToRow({ ...product, createdAt: now, updatedAt: now })

  const { data, error } = await getSupabase()
    .from('products')
    .insert(row)
    .select('*')
    .single()

  if (error) throw error
  return mapProduct(data)
}

export async function updateProduct(
  id: string,
  updates: Partial<Product>,
): Promise<Product | null> {
  const existing = await getProductById(id)
  if (!existing) return null

  const merged: Product = {
    ...existing,
    ...updates,
    id: existing.id,
    price: updates.price !== undefined ? Number(updates.price) : existing.price,
    updatedAt: new Date().toISOString(),
  }

  const row = productToRow(merged)
  const { data, error } = await getSupabase()
    .from('products')
    .update({
      ...row,
      updated_at: merged.updatedAt,
    })
    .eq('id', id)
    .select('*')
    .single()

  if (error) throw error
  return mapProduct(data)
}

export async function deleteProduct(id: string): Promise<boolean> {
  const { error, count } = await getSupabase()
    .from('products')
    .delete({ count: 'exact' })
    .eq('id', id)

  if (error) throw error
  return (count ?? 0) > 0
}

export async function listOrders(): Promise<Order[]> {
  const { data, error } = await getSupabase()
    .from('orders')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) throw error
  return (data ?? []).map(mapOrder)
}

export async function getOrderById(id: string): Promise<Order | null> {
  const { data, error } = await getSupabase()
    .from('orders')
    .select('*')
    .eq('id', id)
    .maybeSingle()

  if (error) throw error
  return data ? mapOrder(data) : null
}

export async function createOrder(input: {
  customer: Order['customer']
  items: Order['items']
  subtotal: number
  currency: Currency
  paymentMethod: string
}): Promise<Order> {
  const now = new Date().toISOString()
  const orderNumber = `LL-${Date.now().toString().slice(-8)}`

  const { data, error } = await getSupabase()
    .from('orders')
    .insert({
      id: uuidv4(),
      order_number: orderNumber,
      status: 'pending',
      customer: input.customer,
      items: input.items,
      subtotal: input.subtotal,
      currency: input.currency,
      payment_method: input.paymentMethod,
      created_at: now,
      updated_at: now,
    })
    .select('*')
    .single()

  if (error) throw error
  return mapOrder(data)
}

export async function updateOrderStatus(
  id: string,
  status: OrderStatus,
): Promise<Order | null> {
  const now = new Date().toISOString()
  const { data, error } = await getSupabase()
    .from('orders')
    .update({ status, updated_at: now })
    .eq('id', id)
    .select('*')
    .single()

  if (error) {
    if (error.code === 'PGRST116') return null
    throw error
  }
  return mapOrder(data)
}

export async function getStats() {
  const [products, orders] = await Promise.all([listProducts(), listOrders()])

  const pendingOrders = orders.filter((o) => o.status === 'pending').length
  const totalRevenue = orders
    .filter((o) => o.status !== 'cancelled')
    .reduce((sum, o) => sum + o.subtotal, 0)
  const lowStock = products.filter((p) => !p.inStock).length

  return {
    totalProducts: products.length,
    totalOrders: orders.length,
    pendingOrders,
    totalRevenue,
    lowStock,
  }
}

export async function countProducts(): Promise<number> {
  const { count, error } = await getSupabase()
    .from('products')
    .select('*', { count: 'exact', head: true })

  if (error) throw error
  return count ?? 0
}
