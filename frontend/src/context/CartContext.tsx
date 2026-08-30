import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'

export interface CartItem {
  id: string
  name: string
  variant: string
  price: number
  currency: '$' | 'AED'
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

const STORAGE_KEY = 'luxelife-cart'

const DEFAULT_ITEMS: CartItem[] = [
  {
    id: 'aura-ceramic-vase',
    name: 'Aura Ceramic Vase',
    variant: 'Warm Ivory / Medium',
    price: 145,
    currency: '$',
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuBAJxF-R0gPVVzZtzoq-mbiQLVDDGYpCtxDGjVlC2XITbQMEWseWIsoogi2TIwXDDBB15vFQPnQ7HwQ-sWL68IwFM9sGCLUGPsg35AekvLK05u9XlVSBeRMV_kMVqWET1U3_EUAoxHrIOxDpvRtd-h0tgR2pEubvyu6uPrLBBSrIz95rznmhS2t8u5p49BOTN5zN0CiMCGJNBCn1CTP-HrMqjMprrRV4Bf7GJU0Hrq2SkQAuZiR49Hq7g',
    quantity: 1,
  },
  {
    id: 'woven-linen-throw',
    name: 'Woven Linen Throw',
    variant: 'Natural Oatmeal / Standard',
    price: 180,
    currency: '$',
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuCGawvI3zLxfFb1-OIMtcwHyZwA3ORC2YeV9ZpTU-bB3Q3gJXf8icq7H4TqQEsih198AjG5_7AGchB3mvwsKy9hh5nJenho8y4vSaYbt1jxDfSaTBk0LCtlvgyjgpJbmAnNlDuwR6uIKBichtH5ulMKP7qOM3lWV9tG6uznrL1_tcXo-v6ViGIVEcGggcNqZ3Ff2uSdGQQd2BsF9L24rdRKp2YBRDcEIj7JYfgLw4yxEJ7mltPZNKenbw',
    quantity: 2,
  },
]

const CartContext = createContext<CartContextValue | null>(null)

function loadCart(): CartItem[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) return JSON.parse(stored) as CartItem[]
  } catch {
    /* use defaults */
  }
  return DEFAULT_ITEMS
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
    if (quantity < 1) return
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

export function formatPrice(amount: number, currency: '$' | 'AED') {
  if (currency === 'AED') return `AED ${amount.toLocaleString()}`
  return `$${amount.toFixed(2)}`
}
