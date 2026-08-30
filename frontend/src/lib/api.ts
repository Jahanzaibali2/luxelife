import { getSupabase } from './supabase'
import type { AdminStats, Order, OrderStatus, Product } from '../types/api'

type ProductRow = {
  id: string
  slug: string
  name: string
  subtitle: string
  description: string
  price: number
  currency: '$' | 'AED'
  image: string
  gallery: string[] | null
  category: Product['category']
  badge: Product['badge'] | null
  in_stock: boolean
  preorder: boolean
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

const ADMIN_LATER =
  'Admin still uses the Express backend. Manage products in the Supabase Table Editor for now.'

function adminUnavailable(): Promise<never> {
  return Promise.reject(new Error(ADMIN_LATER))
}

export const api = {
  async getProducts(): Promise<Product[]> {
    const { data, error } = await getSupabase()
      .from('products')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) throw error
    return (data ?? []).map(mapProduct)
  },

  async getProduct(slug: string): Promise<Product> {
    const { data, error } = await getSupabase()
      .from('products')
      .select('*')
      .eq('slug', slug)
      .maybeSingle()

    if (error) throw error
    if (!data) throw new Error('Product not found')
    return mapProduct(data)
  },

  async createOrder(input: {
    customer: Order['customer']
    items: Order['items']
    subtotal: number
    currency: '$' | 'AED'
    paymentMethod: string
  }): Promise<Order> {
    const now = new Date().toISOString()
    const orderNumber = `LL-${Date.now().toString().slice(-8)}`
    const order: Order = {
      id: crypto.randomUUID(),
      orderNumber,
      status: 'pending',
      customer: input.customer,
      items: input.items,
      subtotal: input.subtotal,
      currency: input.currency,
      paymentMethod: input.paymentMethod,
      createdAt: now,
      updatedAt: now,
    }

    const { error } = await getSupabase().from('orders').insert({
      id: order.id,
      order_number: order.orderNumber,
      status: order.status,
      customer: order.customer,
      items: order.items,
      subtotal: order.subtotal,
      currency: order.currency,
      payment_method: order.paymentMethod,
      created_at: now,
      updated_at: now,
    })

    if (error) throw error
    return order
  },
}

export const adminApi = {
  login: (_username: string, _password: string) => adminUnavailable(),
  getStats: (): Promise<AdminStats> => adminUnavailable(),
  getProducts: (): Promise<Product[]> => adminUnavailable(),
  getProduct: (_id: string): Promise<Product> => adminUnavailable(),
  createProduct: (_data: Partial<Product>): Promise<Product> => adminUnavailable(),
  updateProduct: (_id: string, _data: Partial<Product>): Promise<Product> => adminUnavailable(),
  deleteProduct: (_id: string): Promise<void> => adminUnavailable(),
  uploadImage: (
    _file: File,
    _slug?: string,
    _name?: string,
  ): Promise<{ url: string; slug: string }> => adminUnavailable(),
  getOrders: (): Promise<Order[]> => adminUnavailable(),
  getOrder: (_id: string): Promise<Order> => adminUnavailable(),
  updateOrderStatus: (_id: string, _status: OrderStatus): Promise<Order> => adminUnavailable(),
}
