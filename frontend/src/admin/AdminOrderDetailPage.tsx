import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { Price } from '../components/Price'
import { adminApi } from '../lib/api'
import type { Order, OrderStatus } from '../types/api'
import { PaymentBadge, StatusBadge } from './AdminDashboardPage'

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
      <div className="max-w-4xl w-full space-y-5">
        <div className="admin-skeleton h-4 w-24" />
        <div className="admin-skeleton h-8 w-48" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="admin-skeleton h-36" />
          <div className="admin-skeleton h-36" />
        </div>
        <div className="admin-skeleton h-64" />
      </div>
    )
  }
  if (!order) return <p className="text-admin-red-ink">Order not found.</p>

  return (
    <div className="max-w-4xl w-full space-y-5">
      <Link to="/admin/orders" className="inline-flex items-center gap-1 text-[13px] font-medium text-admin-muted hover:text-admin-ink">
        <span className="material-symbols-outlined text-[18px]">arrow_back</span>
        Back to orders
      </Link>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="admin-title">{order.orderNumber}</h2>
          <p className="admin-hint">Placed {new Date(order.createdAt).toLocaleString()}</p>
        </div>
        <StatusBadge status={order.status} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <section className="admin-card p-4 sm:p-5">
          <h3 className="admin-card-title flex items-center gap-2 mb-3">
            <span className="material-symbols-outlined text-[18px] text-admin-gold">person</span>
            Customer
          </h3>
          <p className="font-semibold">
            {order.customer.firstName} {order.customer.lastName}
          </p>
          <p className="text-admin-muted text-[13px] mt-1">{order.customer.email}</p>
          <p className="text-admin-muted text-[13px]">{order.customer.phone}</p>
        </section>
        <section className="admin-card p-4 sm:p-5">
          <h3 className="admin-card-title flex items-center gap-2 mb-3">
            <span className="material-symbols-outlined text-[18px] text-admin-gold">local_shipping</span>
            Shipping
          </h3>
          <p>{order.customer.street}</p>
          <p className="text-admin-muted text-[13px]">
            {order.customer.area}, {order.customer.state}, {order.customer.country}
          </p>
          {order.customer.apartment && <p className="text-admin-muted text-[13px]">{order.customer.apartment}</p>}
          {order.customer.instructions && (
            <p className="text-[13px] mt-3 bg-admin-gold-tint text-admin-gold-ink rounded-[10px] px-3 py-2">Note: {order.customer.instructions}</p>
          )}
        </section>
      </div>

      <section className="admin-card overflow-hidden">
        <h3 className="admin-card-title px-4 sm:px-5 py-4 border-b border-admin-border">Items</h3>
        <div className="divide-y divide-admin-border">
          {order.items.map((item, i) => (
            <div key={i} className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 px-4 sm:px-5 py-3.5">
              <div className="flex items-center gap-3 flex-1 min-w-0">
                <img src={item.image} alt="" className="w-14 h-14 object-cover rounded-[10px] shrink-0" loading="lazy" decoding="async" />
                <div className="min-w-0">
                  <p className="font-semibold truncate">{item.name}</p>
                  <p className="text-[13px] text-admin-muted truncate">{item.variant}</p>
                </div>
              </div>
              <div className="flex items-center justify-between sm:justify-end gap-4 sm:gap-6 pl-[4.25rem] sm:pl-0">
                <p className="text-admin-muted text-[13px]">Qty {item.quantity}</p>
                <Price amount={item.price * item.quantity} variant="line" className="whitespace-nowrap shrink-0" />
              </div>
            </div>
          ))}
        </div>
        <div className="px-4 sm:px-5 py-4 flex justify-between items-center bg-admin-canvas/70 border-t border-admin-border">
          <span className="font-semibold">Total</span>
          <Price amount={order.subtotal} variant="emphasis" />
        </div>
      </section>

      <section className="admin-card p-4 sm:p-5">
        <h3 className="admin-card-title mb-3">Update status</h3>
        <div className="flex gap-2 flex-wrap">
          {STATUSES.map((s) => (
            <button
              key={s}
              type="button"
              disabled={updating || order.status === s}
              data-active={order.status === s}
              onClick={() => updateStatus(s)}
              className="admin-chip disabled:cursor-default data-[active=false]:disabled:opacity-50"
            >
              {order.status === s && <span className="material-symbols-outlined text-[16px]">check</span>}
              {s}
            </button>
          ))}
        </div>
        <div className="text-[13px] text-admin-muted mt-4 pt-4 border-t border-admin-border flex items-center gap-2 flex-wrap">
          <span>Payment: {order.paymentMethod}</span>
          <PaymentBadge status={order.paymentStatus} />
          {order.paymentProvider === 'cod' && <span>— collect cash on delivery.</span>}
          {order.paymentReference && <span className="text-[12px]">Ref: {order.paymentReference}</span>}
        </div>
      </section>
    </div>
  )
}
