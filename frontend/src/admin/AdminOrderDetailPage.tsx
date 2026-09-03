import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { Price } from '../components/Price'
import { adminApi } from '../lib/api'
import type { Order, OrderStatus } from '../types/api'
import { StatusBadge } from './AdminDashboardPage'

const STATUSES: OrderStatus[] = ['pending', 'processing', 'shipped', 'delivered', 'cancelled']

export default function AdminOrderDetailPage() {
  const { id } = useParams<{ id: string }>()
  const [order, setOrder] = useState<Order | null>(null)
  const [loading, setLoading] = useState(true)
  const [updating, setUpdating] = useState(false)

  useEffect(() => {
    if (!id) return
    adminApi.getOrder(id).then(setOrder).finally(() => setLoading(false))
  }, [id])

  const updateStatus = async (status: OrderStatus) => {
    if (!id) return
    setUpdating(true)
    try {
      const updated = await adminApi.updateOrderStatus(id, status)
      setOrder(updated)
    } finally {
      setUpdating(false)
    }
  }

  if (loading) {
    return (
      <div className="max-w-4xl w-full space-y-6">
        <div className="animate-pulse bg-outline/10 rounded h-4 w-24" />
        <div className="space-y-2">
          <div className="animate-pulse bg-outline/10 rounded h-8 w-48" />
          <div className="animate-pulse bg-outline/10 rounded h-3 w-36" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="animate-pulse bg-surface rounded-lg border border-outline/15 h-36" />
          <div className="animate-pulse bg-surface rounded-lg border border-outline/15 h-36" />
        </div>
        <div className="animate-pulse bg-surface rounded-lg border border-outline/15 h-64" />
      </div>
    )
  }
  if (!order) return <p className="text-error">Order not found.</p>

  return (
    <div className="max-w-4xl w-full space-y-4 sm:space-y-6">
      <Link to="/admin/orders" className="text-secondary hover:text-primary font-label-sm text-label-sm flex items-center gap-1">
        <span className="material-symbols-outlined text-[16px]">arrow_back</span>
        Back to Orders
      </Link>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-headline-md text-headline-md text-primary">{order.orderNumber}</h2>
          <p className="text-secondary text-sm">{new Date(order.createdAt).toLocaleString()}</p>
        </div>
        <StatusBadge status={order.status} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-gutter">
        <div className="bg-surface p-4 sm:p-6 rounded-lg border border-outline/15">
          <h3 className="font-label-caps text-label-caps text-secondary mb-4 tracking-wider text-[10px]">CUSTOMER</h3>
          <p className="text-primary font-medium">{order.customer.firstName} {order.customer.lastName}</p>
          <p className="text-secondary text-sm mt-1">{order.customer.email}</p>
          <p className="text-secondary text-sm">{order.customer.phone}</p>
        </div>
        <div className="bg-surface p-4 sm:p-6 rounded-lg border border-outline/15">
          <h3 className="font-label-caps text-label-caps text-secondary mb-4 tracking-wider text-[10px]">SHIPPING</h3>
          <p className="text-primary">{order.customer.street}</p>
          <p className="text-secondary text-sm">{order.customer.area}, {order.customer.emirate}</p>
          {order.customer.apartment && <p className="text-secondary text-sm">{order.customer.apartment}</p>}
          {order.customer.instructions && (
            <p className="text-secondary text-sm mt-2 italic">Note: {order.customer.instructions}</p>
          )}
        </div>
      </div>

      <div className="bg-surface rounded-lg border border-outline/15 overflow-hidden">
        <div className="px-4 sm:px-6 py-4 border-b border-outline/15">
          <h3 className="font-label-caps text-label-caps text-secondary tracking-wider text-[10px]">ITEMS</h3>
        </div>
        {order.items.map((item, i) => (
          <div
            key={i}
            className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 px-4 sm:px-6 py-4 border-b border-outline/10"
          >
            <div className="flex items-center gap-3 flex-1 min-w-0">
              <img
                src={item.image}
                alt=""
                className="w-14 h-14 sm:w-16 sm:h-16 object-cover rounded shrink-0"
                loading="lazy"
                decoding="async"
              />
              <div className="min-w-0">
                <p className="text-primary font-medium truncate">{item.name}</p>
                <p className="text-sm text-secondary truncate">{item.variant}</p>
              </div>
            </div>
            <div className="flex items-center justify-between sm:justify-end gap-4 sm:gap-6 pl-[4.25rem] sm:pl-0">
              <p className="text-secondary text-sm">Qty: {item.quantity}</p>
              <Price amount={item.price * item.quantity} variant="line" className="whitespace-nowrap shrink-0" />
            </div>
          </div>
        ))}
        <div className="px-4 sm:px-6 py-4 flex justify-between items-center bg-surface-container-low">
          <span className="font-headline-md text-headline-md text-primary">Total</span>
          <Price amount={order.subtotal} variant="emphasis" />
        </div>
      </div>

      <div className="bg-surface p-4 sm:p-6 rounded-lg border border-outline/15">
        <h3 className="font-label-caps text-label-caps text-secondary mb-4 tracking-wider text-[10px]">UPDATE STATUS</h3>
        <div className="flex gap-2 flex-wrap">
          {STATUSES.map((s) => (
            <button
              key={s}
              type="button"
              disabled={updating || order.status === s}
              onClick={() => updateStatus(s)}
              className={`px-4 py-1.5 rounded-full font-label-caps text-label-caps text-[10px] tracking-wider uppercase transition-colors disabled:opacity-40 cursor-pointer disabled:cursor-default ${
                order.status === s ? 'bg-primary text-on-primary' : 'border border-outline/20 text-secondary hover:text-primary hover:border-outline/40'
              }`}
            >
              {s}
            </button>
          ))}
        </div>
        <p className="text-sm text-secondary mt-3">Payment: {order.paymentMethod} — collect cash on delivery.</p>
      </div>
    </div>
  )
}
