import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
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
    return <p className="text-secondary">Loading dashboard...</p>
  }

  const cards = [
    { label: 'Total Products', value: stats?.totalProducts ?? 0, icon: 'inventory_2' },
    { label: 'Total Orders', value: stats?.totalOrders ?? 0, icon: 'receipt_long' },
    { label: 'Pending Orders', value: stats?.pendingOrders ?? 0, icon: 'pending_actions' },
    { label: 'Out of Stock', value: stats?.lowStock ?? 0, icon: 'warning' },
  ]

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-gutter">
        {cards.map((card) => (
          <div key={card.label} className="bg-surface p-6 rounded border border-outline/15">
            <div className="flex items-center justify-between mb-4">
              <span className="font-label-caps text-label-caps text-secondary text-[10px] tracking-wider">{card.label}</span>
              <span className="material-symbols-outlined text-primary/40">{card.icon}</span>
            </div>
            <p className="font-headline-lg text-headline-lg text-primary">{card.value}</p>
          </div>
        ))}
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <Link to="/admin/products/new" className="inline-flex items-center justify-center gap-2 bg-primary text-on-primary font-label-caps text-label-caps px-6 py-3 rounded hover:opacity-90 transition-opacity">
          <span className="material-symbols-outlined text-[18px]">add</span>
          Add Product
        </Link>
        <Link to="/admin/orders" className="inline-flex items-center justify-center gap-2 minimal-border text-primary font-label-caps text-label-caps px-6 py-3 rounded hover:bg-surface-variant transition-colors">
          View All Orders
        </Link>
      </div>

      <div className="bg-surface rounded border border-outline/15 overflow-hidden">
        <div className="px-6 py-4 border-b border-outline/15 flex justify-between items-center">
          <h2 className="font-headline-md text-headline-md text-primary">Recent Orders</h2>
          <Link to="/admin/orders" className="font-label-sm text-label-sm text-secondary hover:text-primary">View all</Link>
        </div>
        {recentOrders.length === 0 ? (
          <p className="p-6 text-secondary">No orders yet.</p>
        ) : (
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-outline/15 font-label-caps text-label-caps text-[10px] text-secondary tracking-wider">
                <th className="px-6 py-3">Order</th>
                <th className="px-6 py-3">Customer</th>
                <th className="px-6 py-3">Total</th>
                <th className="px-6 py-3">Status</th>
                <th className="px-6 py-3">Date</th>
              </tr>
            </thead>
            <tbody>
              {recentOrders.map((order) => (
                <tr key={order.id} className="border-b border-outline/10 hover:bg-surface-container-low transition-colors">
                  <td className="px-6 py-4">
                    <Link to={`/admin/orders/${order.id}`} className="text-primary font-medium hover:underline">
                      {order.orderNumber}
                    </Link>
                  </td>
                  <td className="px-6 py-4 text-secondary">{order.customer.firstName} {order.customer.lastName}</td>
                  <td className="px-6 py-4 text-primary">{order.currency} {order.subtotal.toFixed(2)}</td>
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
    <span className={`inline-block px-2 py-1 rounded text-[10px] font-label-caps text-label-caps tracking-wider uppercase ${colors[status] ?? 'bg-surface-variant'}`}>
      {status}
    </span>
  )
}
