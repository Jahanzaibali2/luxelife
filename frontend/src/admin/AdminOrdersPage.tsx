import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Price } from '../components/Price'
import { adminApi } from '../lib/api'
import type { Order, OrderStatus } from '../types/api'
import { PaymentBadge, StatusBadge } from './AdminDashboardPage'

const STATUSES: OrderStatus[] = ['pending', 'processing', 'shipped', 'delivered', 'cancelled']

export default function AdminOrdersPage() {
  const navigate = useNavigate()
  const [orders, setOrders] = useState<Order[]>([])
  const [filter, setFilter] = useState<OrderStatus | 'all'>('all')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    adminApi.getOrders().then(setOrders).finally(() => setLoading(false))
  }, [])

  const filtered = filter === 'all' ? orders : orders.filter((o) => o.status === filter)
  const countFor = (s: OrderStatus | 'all') => (s === 'all' ? orders.length : orders.filter((o) => o.status === s).length)

  return (
    <div className="space-y-5">
      <div className="flex gap-2 -mx-1 px-1 pb-1 overflow-x-auto" role="tablist" aria-label="Filter orders by status">
        {(['all', ...STATUSES] as const).map((s) => (
          <button
            key={s}
            type="button"
            role="tab"
            aria-selected={filter === s}
            data-active={filter === s}
            onClick={() => setFilter(s)}
            className="admin-chip"
          >
            {s}
            {!loading && <span className="tabular-nums opacity-60">{countFor(s)}</span>}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="admin-card divide-y divide-admin-border">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="p-4 space-y-2">
              <div className="flex justify-between">
                <div className="admin-skeleton h-4 w-32" />
                <div className="admin-skeleton h-6 w-20" />
              </div>
              <div className="admin-skeleton h-3 w-48" />
            </div>
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="admin-card py-16 px-6 text-center">
          <span className="material-symbols-outlined text-[40px] text-admin-muted/40 block mb-2">receipt_long</span>
          <p className="text-admin-muted">{filter === 'all' ? 'No orders yet.' : `No ${filter} orders.`}</p>
        </div>
      ) : (
        <>
          <div className="md:hidden space-y-3">
            {filtered.map((order) => (
              <Link key={order.id} to={`/admin/orders/${order.id}`} className="block admin-card p-4 hover:border-admin-gold/40 transition-colors">
                <div className="flex items-start justify-between gap-3 mb-1.5">
                  <span className="font-semibold">{order.orderNumber}</span>
                  <StatusBadge status={order.status} />
                </div>
                <p className="text-[14px]">
                  {order.customer.firstName} {order.customer.lastName}
                </p>
                <p className="text-admin-muted text-[13px] truncate">{order.customer.email}</p>
                <div className="flex flex-wrap items-center justify-between gap-2 mt-3 pt-3 border-t border-admin-border text-[13px]">
                  <span className="text-admin-muted flex items-center gap-2">
                    {order.items.reduce((n, i) => n + i.quantity, 0)} item(s) · {order.paymentMethod}
                    <PaymentBadge status={order.paymentStatus} />
                  </span>
                  <Price amount={order.subtotal} variant="inline" />
                </div>
                <p className="text-admin-muted text-[12px] mt-2">{new Date(order.createdAt).toLocaleString()}</p>
              </Link>
            ))}
          </div>

          <div className="hidden md:block admin-card overflow-x-auto">
            <table className="w-full min-w-[800px]">
              <thead>
                <tr className="border-b border-admin-border">
                  <th className="admin-th">Order</th>
                  <th className="admin-th">Customer</th>
                  <th className="admin-th">Items</th>
                  <th className="admin-th">Payment</th>
                  <th className="admin-th">Total</th>
                  <th className="admin-th">Status</th>
                  <th className="admin-th">Date</th>
                  <th className="admin-th">
                    <span className="sr-only">Open</span>
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-admin-border">
                {filtered.map((order) => (
                  <tr
                    key={order.id}
                    onClick={() => navigate(`/admin/orders/${order.id}`)}
                    className="hover:bg-admin-canvas/70 transition-colors cursor-pointer"
                  >
                    <td className="admin-td font-semibold whitespace-nowrap">{order.orderNumber}</td>
                    <td className="admin-td">
                      <p>
                        {order.customer.firstName} {order.customer.lastName}
                      </p>
                      <p className="text-[13px] text-admin-muted">{order.customer.email}</p>
                    </td>
                    <td className="admin-td text-admin-muted whitespace-nowrap">{order.items.reduce((n, i) => n + i.quantity, 0)} item(s)</td>
                    <td className="admin-td text-admin-muted text-[13px]">
                      <div className="flex items-center gap-2">
                        {order.paymentMethod}
                        <PaymentBadge status={order.paymentStatus} />
                      </div>
                    </td>
                    <td className="admin-td whitespace-nowrap">
                      <Price amount={order.subtotal} variant="inline" />
                    </td>
                    <td className="admin-td">
                      <StatusBadge status={order.status} />
                    </td>
                    <td className="admin-td text-admin-muted text-[13px] whitespace-nowrap">{new Date(order.createdAt).toLocaleString()}</td>
                    <td className="admin-td text-right">
                      <Link
                        to={`/admin/orders/${order.id}`}
                        onClick={(e) => e.stopPropagation()}
                        className="admin-icon-btn"
                        aria-label={`Open order ${order.orderNumber}`}
                      >
                        <span className="material-symbols-outlined text-[20px]">chevron_right</span>
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  )
}
