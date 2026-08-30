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
  currency: '$' | 'AED'
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

export interface OrderItem {
  productId: string
  name: string
  variant: string
  price: number
  currency: '$' | 'AED'
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
    emirate: string
    area: string
    street: string
    apartment?: string
    instructions?: string
  }
  items: OrderItem[]
  subtotal: number
  currency: '$' | 'AED'
  paymentMethod: string
}

export interface AdminStats {
  totalProducts: number
  totalOrders: number
  pendingOrders: number
  totalRevenue: number
  lowStock: number
}
