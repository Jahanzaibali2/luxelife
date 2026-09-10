export type Currency = 'AED'

export type ProductCategory =
  | 'fashion'
  | 'home-lifestyle'
  | 'accessories'
  | 'jewelry'
  | 'gadgets'
  | 'gifts'

export type ProductBadge = 'New Arrival' | 'Limited'

export interface Product {
  id: string
  slug: string
  name: string
  subtitle: string
  description?: string
  price: number
  currency: Currency
  image: string
  gallery?: string[]
  category: ProductCategory
  badge?: ProductBadge
  inStock: boolean
  preorder?: boolean
  createdAt?: string
  updatedAt?: string
}

export type OrderStatus =
  | 'pending'
  | 'processing'
  | 'shipped'
  | 'delivered'
  | 'cancelled'

export type PaymentProvider = 'cod' | 'ziina'
export type PaymentStatus = 'unpaid' | 'paid' | 'failed'

export interface OrderItem {
  productId: string
  name: string
  variant: string
  price: number
  currency: Currency
  quantity: number
  image: string
}

export interface Order {
  id: string
  orderNumber: string
  status: OrderStatus
  createdAt: string
  updatedAt: string
  customer: {
    email: string
    firstName: string
    lastName: string
    phone: string
    country: string
    state: string
    area: string
    street: string
    apartment?: string
    instructions?: string
  }
  items: OrderItem[]
  subtotal: number
  currency: Currency
  paymentMethod: string
  paymentProvider: PaymentProvider
  paymentStatus: PaymentStatus
  paymentReference: string | null
}

export interface AdminStats {
  totalProducts: number
  totalOrders: number
  pendingOrders: number
  totalRevenue: number
  lowStock: number
}
