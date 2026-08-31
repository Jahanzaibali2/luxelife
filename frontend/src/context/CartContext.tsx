import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import type { Currency } from '../types/api'

export interface CartItem {
  id: string
  name: string
  variant: string
  price: number
  currency: Currency
  image: string
  quantity: number
}

interface CartContextValue {
  items: CartItem[]
  addItem: (item: Omit<CartItem, 'quantity'>, quantity?: number) => void
  removeItem: (id: string) => void
  updateQuantity: (id: string, quantity: number) => void
  clearCart: () => void
  subtotal: number
  itemCount: number
}

const STORAGE_KEY = 'luxelife-cart-v2'

const CartContext = createContext<CartContextValue | null>(null)

function loadCart(): CartItem[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) {
      return (JSON.parse(stored) as CartItem[]).map((item) => ({
        ...item,
        currency: 'AED' as const,
      }))
    }
  } catch {
    /* empty cart */
  }
  return []
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>(loadCart)

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items))
  }, [items])

  const addItem = useCallback(
    (item: Omit<CartItem, 'quantity'>, quantity = 1) => {
      setItems((prev) => {
        const existing = prev.find((i) => i.id === item.id)
        if (existing) {
          return prev.map((i) =>
            i.id === item.id
              ? { ...i, quantity: i.quantity + quantity }
              : i,
          )
        }
        return [...prev, { ...item, quantity }]
      })
    },
    [],
  )

  const removeItem = useCallback((id: string) => {
    setItems((prev) => prev.filter((i) => i.id !== id))
  }, [])

  const updateQuantity = useCallback((id: string, quantity: number) => {
    if (quantity < 1) {
      setItems((prev) => prev.filter((i) => i.id !== id))
      return
    }
    setItems((prev) =>
      prev.map((i) => (i.id === id ? { ...i, quantity } : i)),
    )
  }, [])

  const clearCart = useCallback(() => {
    setItems([])
  }, [])

  const subtotal = useMemo(
    () => items.reduce((sum, i) => sum + i.price * i.quantity, 0),
    [items],
  )

  const itemCount = useMemo(
    () => items.reduce((sum, i) => sum + i.quantity, 0),
    [items],
  )

  const value = useMemo(
    () => ({
      items,
      addItem,
      removeItem,
      updateQuantity,
      clearCart,
      subtotal,
      itemCount,
    }),
    [items, addItem, removeItem, updateQuantity, clearCart, subtotal, itemCount],
  )

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

export function useCart() {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart must be used within CartProvider')
  return ctx
}

export function formatPrice(amount: number) {
  return `AED ${amount.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 2 })}`
}
