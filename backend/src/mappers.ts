import type { Currency, Order, OrderItem, OrderStatus, Product } from './types.js'

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
  category: string
  badge: string | null
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
  items: OrderItem[]
  subtotal: number
  currency: Currency
  payment_method: string
  created_at: string
  updated_at: string
}

export function mapProduct(row: ProductRow): Product {
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
    category: row.category as Product['category'],
    badge: (row.badge as Product['badge']) ?? undefined,
    inStock: row.in_stock,
    preorder: row.preorder,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  }
}

export function mapOrder(row: OrderRow): Order {
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

export function productToRow(
  product: Omit<Product, 'createdAt' | 'updatedAt'> & {
    createdAt?: string
    updatedAt?: string
  },
): Omit<ProductRow, 'created_at' | 'updated_at'> & {
  created_at?: string
  updated_at?: string
} {
  return {
    id: product.id,
    slug: product.slug,
    name: product.name,
    subtitle: product.subtitle,
    description: product.description ?? '',
    price: product.price,
    currency: product.currency,
    image: product.image,
    gallery: product.gallery ?? [],
    category: product.category,
    badge: product.badge ?? null,
    in_stock: product.inStock,
    preorder: product.preorder ?? false,
    created_at: product.createdAt,
    updated_at: product.updatedAt,
  }
}
