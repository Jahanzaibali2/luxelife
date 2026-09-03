import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Price } from '../components/Price'
import { adminApi } from '../lib/api'
import type { AdminStats, Order } from '../types/api'

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<AdminStats | null>(null)
  const [recentOrders, setRecentOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([adminApi.getStats(), adminApi.getOrders()])
      .then(([s, orders]) => {
        setStats(s)
        setRecentOrders(orders.slice(0, 5))
      })
      .finally(() => setLoading(false))
  }, [])

  if (loading) {
    return (
      <div className="space-y-6 sm:space-y-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-gutter">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-surface p-5 rounded-lg border border-outline/15 space-y-3">
              <div className="animate-pulse bg-outline/10 rounded-lg w-11 h-11" />
              <div className="animate-pulse bg-outline/10 rounded h-8 w-14" />
              <div className="animate-pulse bg-outline/10 rounded h-3 w-24" />
            </div>
          ))}
        </div>
        <div className="animate-pulse bg-surface rounded-lg border border-outline/15 h-64" />
      </div>
    )
  }

  const cards = [
    { label: 'Total Products', value: stats?.totalProducts ?? 0, icon: 'inventory_2', iconBg: 'bg-secondary-container text-primary' },
    { label: 'Total Orders', value: stats?.totalOrders ?? 0, icon: 'receipt_long', iconBg: 'bg-soft-blush text-primary' },
    { label: 'Pending Orders', value: stats?.pendingOrders ?? 0, icon: 'pending_actions', iconBg: 'bg-primary-fixed/60 text-primary' },
    { label: 'Out of Stock', value: stats?.lowStock ?? 0, icon: 'warning', iconBg: 'bg-error-container text-error' },
  ]

  return (
    <div className="space-y-6 sm:space-y-8">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-gutter">
        {cards.map((card) => (
          <div key={card.label} className="bg-surface p-5 rounded-lg border border-outline/15">
            <div className={`inline-flex p-2.5 rounded-lg mb-4 ${card.iconBg}`}>
              <span className="material-symbols-outlined text-[20px]">{card.icon}</span>
            </div>
            <p className="font-headline-lg text-headline-lg text-primary tabular-nums leading-none mb-1.5">
              {card.value}
            </p>
            <span className="font-label-caps text-label-caps text-secondary text-[10px] tracking-wider">
              {card.label}
            </span>
          </div>
        ))}
      </div>

      <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
        <Link
          to="/admin/products/new"
          className="inline-flex items-center justify-center gap-2 bg-primary text-on-primary font-label-caps text-label-caps px-5 sm:px-6 py-3 rounded hover:opacity-90 btn-lift w-full sm:w-auto"
        >
          <span className="material-symbols-outlined text-[18px]">add</span>
          Add Product
        </Link>
        <Link
          to="/admin/orders"
          className="inline-flex items-center justify-center gap-2 minimal-border text-primary font-label-caps text-label-caps px-5 sm:px-6 py-3 rounded hover:bg-surface-variant btn-lift-secondary w-full sm:w-auto"
        >
          View All Orders
        </Link>
      </div>

      <div className="bg-surface rounded-lg border border-outline/15 overflow-hidden">
        <div className="px-4 sm:px-6 py-4 border-b border-outline/15 flex justify-between items-center gap-3">
          <h2 className="font-headline-md text-headline-md text-primary">Recent Orders</h2>
          <Link to="/admin/orders" className="font-label-sm text-label-sm text-secondary hover:text-primary shrink-0">
            View all
          </Link>
        </div>
        {recentOrders.length === 0 ? (
          <div className="py-12 px-6 text-center">
            <span className="material-symbols-outlined text-[48px] text-secondary/30 block mb-3">receipt_long</span>
            <p className="text-secondary text-sm">No orders yet.</p>
          </div>
        ) : (
          <>
            <div className="md:hidden divide-y divide-outline/10">
              {recentOrders.map((order) => (
                <Link
                  key={order.id}
                  to={`/admin/orders/${order.id}`}
                  className="block px-4 py-4 hover:bg-surface-container-low transition-colors cursor-pointer"
                >
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <span className="text-primary font-medium">{order.orderNumber}</span>
                    <StatusBadge status={order.status} />
                  </div>
                  <p className="text-secondary text-sm">
                    {order.customer.firstName} {order.customer.lastName}
                  </p>
                  <div className="flex items-center justify-between mt-2 text-sm">
                    <Price amount={order.subtotal} variant="inline" />
                    <span className="text-secondary">{new Date(order.createdAt).toLocaleDateString()}</span>
                  </div>
                </Link>
              ))}
            </div>
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-left min-w-[640px]">
                <thead>
                  <tr className="border-b border-outline/15 bg-surface-container-low/50 font-label-caps text-label-caps text-[10px] text-secondary tracking-wider">
                    <th className="px-6 py-3.5">Order</th>
                    <th className="px-6 py-3.5">Customer</th>
                    <th className="px-6 py-3.5">Total</th>
                    <th className="px-6 py-3.5">Status</th>
                    <th className="px-6 py-3.5">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {recentOrders.map((order) => (
                    <tr key={order.id} className="border-b border-outline/10 hover:bg-surface-container-low transition-colors cursor-pointer">
                      <td className="px-6 py-4">
                        <Link to={`/admin/orders/${order.id}`} className="text-primary font-medium hover:underline">
                          {order.orderNumber}
                        </Link>
                      </td>
                      <td className="px-6 py-4 text-secondary">
                        {order.customer.firstName} {order.customer.lastName}
                      </td>
                      <td className="px-6 py-4">
                        <Price amount={order.subtotal} variant="inline" />
                      </td>
                      <td className="px-6 py-4">
                        <StatusBadge status={order.status} />
                      </td>
                      <td className="px-6 py-4 text-secondary text-sm">
                        {new Date(order.createdAt).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

export function StatusBadge({ status }: { status: string }) {
  const colors: Record<string, string> = {
    pending: 'bg-soft-blush text-primary',
    processing: 'bg-secondary-container text-primary',
    shipped: 'bg-primary-container text-on-primary',
    delivered: 'bg-surface-variant text-primary',
    cancelled: 'bg-error-container text-error',
  }
  return (
    <span
      className={`inline-block px-2.5 py-1 rounded-full text-[10px] font-label-caps text-label-caps tracking-wider uppercase whitespace-nowrap ${colors[status] ?? 'bg-surface-variant text-primary'}`}
    >
      {status}
    </span>
  )
}
