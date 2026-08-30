import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { adminApi } from '../lib/api'
import type { Order, OrderStatus } from '../types/api'
import { StatusBadge } from './AdminDashboardPage'

const STATUSES: OrderStatus[] = ['pending', 'processing', 'shipped', 'delivered', 'cancelled']

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([])
  const [filter, setFilter] = useState<OrderStatus | 'all'>('all')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    adminApi.getOrders().then(setOrders).finally(() => setLoading(false))
  }, [])

  const filtered = filter === 'all' ? orders : orders.filter((o) => o.status === filter)

  return (
    <div className="space-y-6">
      <h2 className="font-headline-md text-headline-md text-primary">Orders</h2>

      <div className="flex gap-2 flex-wrap">
        {(['all', ...STATUSES] as const).map((s) => (
          <button
            key={s}
            type="button"
            onClick={() => setFilter(s)}
            className={`px-4 py-2 rounded font-label-caps text-label-caps text-[10px] tracking-wider uppercase transition-colors ${
              filter === s ? 'bg-primary text-on-primary' : 'bg-surface border border-outline/15 text-secondary hover:text-primary'
            }`}
          >
            {s}
          </button>
        ))}
      </div>

      {loading ? (
        <p className="text-secondary">Loading orders...</p>
      ) : filtered.length === 0 ? (
        <p className="text-secondary">No orders found.</p>
      ) : (
        <div className="bg-surface rounded border border-outline/15 overflow-x-auto">
          <table className="w-full text-left min-w-[800px]">
            <thead>
              <tr className="border-b border-outline/15 font-label-caps text-label-caps text-[10px] text-secondary tracking-wider">
                <th className="px-6 py-3">Order #</th>
                <th className="px-6 py-3">Customer</th>
                <th className="px-6 py-3">Items</th>
                <th className="px-6 py-3">Payment</th>
                <th className="px-6 py-3">Total</th>
                <th className="px-6 py-3">Status</th>
                <th className="px-6 py-3">Date</th>
                <th className="px-6 py-3"></th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((order) => (
                <tr key={order.id} className="border-b border-outline/10 hover:bg-surface-container-low">
                  <td className="px-6 py-4 font-medium text-primary">{order.orderNumber}</td>
                  <td className="px-6 py-4">
                    <p className="text-primary">{order.customer.firstName} {order.customer.lastName}</p>
                    <p className="text-sm text-secondary">{order.customer.email}</p>
                  </td>
                  <td className="px-6 py-4 text-secondary">{order.items.reduce((n, i) => n + i.quantity, 0)} item(s)</td>
                  <td className="px-6 py-4 text-secondary text-sm">{order.paymentMethod}</td>
                  <td className="px-6 py-4 text-primary">{order.currency} {order.subtotal.toFixed(2)}</td>
                  <td className="px-6 py-4"><StatusBadge status={order.status} /></td>
                  <td className="px-6 py-4 text-secondary text-sm">{new Date(order.createdAt).toLocaleString()}</td>
                  <td className="px-6 py-4">
                    <Link to={`/admin/orders/${order.id}`} className="text-primary hover:underline font-label-sm text-label-sm">
                      View
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
