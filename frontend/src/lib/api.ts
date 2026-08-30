import type { AdminStats, Order, OrderStatus, Product } from '../types/api'

const API_BASE = '/api'

function getAdminToken(): string | null {
  return localStorage.getItem('luxelife-admin-token')
}

async function request<T>(
  path: string,
  options: RequestInit = {},
  auth = false,
): Promise<T> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  }

  if (auth) {
    const token = getAdminToken()
    if (token) headers.Authorization = `Bearer ${token}`
  }

  const res = await fetch(`${API_BASE}${path}`, { ...options, headers })

  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: res.statusText }))
    throw new Error(err.error ?? 'Request failed')
  }

  if (res.status === 204) return undefined as T
  return res.json() as Promise<T>
}

// Public
export const api = {
  getProducts: () => request<Product[]>('/products'),
  getProduct: (slug: string) => request<Product>(`/products/${slug}`),
  createOrder: (data: {
    customer: Order['customer']
    items: Order['items']
    subtotal: number
    currency: '$' | 'AED'
    paymentMethod: string
  }) =>
    request<Order>('/orders', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
}

// Admin
export const adminApi = {
  login: (username: string, password: string) =>
    request<{ token: string }>('/admin/login', {
      method: 'POST',
      body: JSON.stringify({ username, password }),
    }),

  getStats: () => request<AdminStats>('/admin/stats', {}, true),

  getProducts: () => request<Product[]>('/admin/products', {}, true),
  getProduct: (id: string) => request<Product>(`/admin/products/${id}`, {}, true),
  createProduct: (data: Partial<Product>) =>
    request<Product>('/admin/products', {
      method: 'POST',
      body: JSON.stringify(data),
    }, true),
  updateProduct: (id: string, data: Partial<Product>) =>
    request<Product>(`/admin/products/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }, true),
  deleteProduct: (id: string) =>
    request<void>(`/admin/products/${id}`, { method: 'DELETE' }, true),

  getOrders: () => request<Order[]>('/admin/orders', {}, true),
  getOrder: (id: string) => request<Order>(`/admin/orders/${id}`, {}, true),
  updateOrderStatus: (id: string, status: OrderStatus) =>
    request<Order>(`/admin/orders/${id}`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    }, true),
}
