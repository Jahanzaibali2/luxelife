import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
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

  if (loading) return <p className="text-secondary">Loading order...</p>
  if (!order) return <p className="text-error">Order not found.</p>

  return (
    <div className="max-w-4xl space-y-6">
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

      <div className="grid grid-cols-1 md:grid-cols-2 gap-gutter">
        <div className="bg-surface p-6 rounded border border-outline/15">
          <h3 className="font-label-caps text-label-caps text-secondary mb-4 tracking-wider text-[10px]">CUSTOMER</h3>
          <p className="text-primary font-medium">{order.customer.firstName} {order.customer.lastName}</p>
          <p className="text-secondary text-sm mt-1">{order.customer.email}</p>
          <p className="text-secondary text-sm">{order.customer.phone}</p>
        </div>
        <div className="bg-surface p-6 rounded border border-outline/15">
          <h3 className="font-label-caps text-label-caps text-secondary mb-4 tracking-wider text-[10px]">SHIPPING</h3>
          <p className="text-primary">{order.customer.street}</p>
          <p className="text-secondary text-sm">{order.customer.area}, {order.customer.emirate}</p>
          {order.customer.apartment && <p className="text-secondary text-sm">{order.customer.apartment}</p>}
          {order.customer.instructions && (
            <p className="text-secondary text-sm mt-2 italic">Note: {order.customer.instructions}</p>
          )}
        </div>
      </div>

      <div className="bg-surface rounded border border-outline/15 overflow-hidden">
        <div className="px-6 py-4 border-b border-outline/15">
          <h3 className="font-label-caps text-label-caps text-secondary tracking-wider text-[10px]">ITEMS</h3>
        </div>
        {order.items.map((item, i) => (
          <div key={i} className="flex gap-4 px-6 py-4 border-b border-outline/10 items-center">
            <img src={item.image} alt="" className="w-16 h-16 object-cover rounded" />
            <div className="flex-1">
              <p className="text-primary font-medium">{item.name}</p>
              <p className="text-sm text-secondary">{item.variant}</p>
            </div>
            <p className="text-secondary text-sm">Qty: {item.quantity}</p>
            <p className="text-primary font-medium">{item.currency} {(item.price * item.quantity).toFixed(2)}</p>
          </div>
        ))}
        <div className="px-6 py-4 flex justify-between items-center bg-surface-container-low">
          <span className="font-headline-md text-headline-md text-primary">Total</span>
          <span className="font-headline-md text-headline-md text-primary">{order.currency} {order.subtotal.toFixed(2)}</span>
        </div>
      </div>

      <div className="bg-surface p-6 rounded border border-outline/15">
        <h3 className="font-label-caps text-label-caps text-secondary mb-4 tracking-wider text-[10px]">UPDATE STATUS</h3>
        <div className="flex gap-2 flex-wrap">
          {STATUSES.map((s) => (
            <button
              key={s}
              type="button"
              disabled={updating || order.status === s}
              onClick={() => updateStatus(s)}
              className={`px-4 py-2 rounded font-label-caps text-label-caps text-[10px] tracking-wider uppercase transition-colors disabled:opacity-40 ${
                order.status === s ? 'bg-primary text-on-primary' : 'border border-outline/15 text-secondary hover:text-primary'
              }`}
            >
              {s}
            </button>
          ))}
        </div>
        <p className="text-sm text-secondary mt-3">Payment: {order.paymentMethod}</p>
      </div>
    </div>
  )
}
