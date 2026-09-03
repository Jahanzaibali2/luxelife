import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Price } from '../components/Price'
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
    <div className="space-y-4 sm:space-y-6">
      <h2 className="font-headline-md text-headline-md text-primary">Orders</h2>

      <div className="flex gap-2 flex-wrap -mx-1 px-1 pb-1 overflow-x-auto">
        {(['all', ...STATUSES] as const).map((s) => (
          <button
            key={s}
            type="button"
            onClick={() => setFilter(s)}
            className={`px-4 py-1.5 rounded-full font-label-caps text-label-caps text-[10px] tracking-wider uppercase transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
              filter === s
                ? 'bg-primary text-on-primary'
                : 'bg-surface border border-outline/20 text-secondary hover:text-primary hover:border-outline/40'
            }`}
          >
            {s}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="space-y-3">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="bg-surface rounded-lg border border-outline/15 p-4 space-y-2">
              <div className="flex justify-between">
                <div className="animate-pulse bg-outline/10 rounded h-4 w-32" />
                <div className="animate-pulse bg-outline/10 rounded-full h-6 w-20" />
              </div>
              <div className="animate-pulse bg-outline/10 rounded h-3 w-48" />
              <div className="animate-pulse bg-outline/10 rounded h-3 w-24" />
            </div>
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="bg-surface rounded-lg border border-outline/15 py-16 px-6 text-center">
          <span className="material-symbols-outlined text-[48px] text-secondary/30 block mb-3">receipt_long</span>
          <p className="text-secondary text-sm">
            {filter === 'all' ? 'No orders yet.' : `No ${filter} orders.`}
          </p>
        </div>
      ) : (
        <>
          <div className="md:hidden space-y-3">
            {filtered.map((order) => (
              <Link
                key={order.id}
                to={`/admin/orders/${order.id}`}
                className="block bg-surface rounded-lg border border-outline/15 p-4 hover:bg-surface-container-low transition-colors cursor-pointer"
              >
                <div className="flex items-start justify-between gap-3 mb-2">
                  <span className="font-medium text-primary">{order.orderNumber}</span>
                  <StatusBadge status={order.status} />
                </div>
                <p className="text-primary text-sm">
                  {order.customer.firstName} {order.customer.lastName}
                </p>
                <p className="text-secondary text-sm truncate">{order.customer.email}</p>
                <div className="flex flex-wrap items-center justify-between gap-2 mt-3 pt-3 border-t border-outline/10 text-sm">
                  <span className="text-secondary">
                    {order.items.reduce((n, i) => n + i.quantity, 0)} item(s) · {order.paymentMethod}
                  </span>
                  <Price amount={order.subtotal} variant="inline" />
                </div>
                <p className="text-secondary text-xs mt-2">{new Date(order.createdAt).toLocaleString()}</p>
              </Link>
            ))}
          </div>

          <div className="hidden md:block bg-surface rounded-lg border border-outline/15 overflow-x-auto">
            <table className="w-full text-left min-w-[800px]">
              <thead>
                <tr className="border-b border-outline/15 bg-surface-container-low/50 font-label-caps text-label-caps text-[10px] text-secondary tracking-wider">
                  <th className="px-6 py-3.5">Order #</th>
                  <th className="px-6 py-3.5">Customer</th>
                  <th className="px-6 py-3.5">Items</th>
                  <th className="px-6 py-3.5">Payment</th>
                  <th className="px-6 py-3.5">Total</th>
                  <th className="px-6 py-3.5">Status</th>
                  <th className="px-6 py-3.5">Date</th>
                  <th className="px-6 py-3.5"></th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((order) => (
                  <tr key={order.id} className="border-b border-outline/10 hover:bg-surface-container-low transition-colors cursor-pointer">
                    <td className="px-6 py-4 font-medium text-primary">{order.orderNumber}</td>
                    <td className="px-6 py-4">
                      <p className="text-primary">
                        {order.customer.firstName} {order.customer.lastName}
                      </p>
                      <p className="text-sm text-secondary">{order.customer.email}</p>
                    </td>
                    <td className="px-6 py-4 text-secondary">
                      {order.items.reduce((n, i) => n + i.quantity, 0)} item(s)
                    </td>
                    <td className="px-6 py-4 text-secondary text-sm">{order.paymentMethod}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Price amount={order.subtotal} variant="inline" />
                    </td>
                    <td className="px-6 py-4">
                      <StatusBadge status={order.status} />
                    </td>
                    <td className="px-6 py-4 text-secondary text-sm whitespace-nowrap">
                      {new Date(order.createdAt).toLocaleString()}
                    </td>
                    <td className="px-6 py-4">
                      <Link
                        to={`/admin/orders/${order.id}`}
                        className="text-primary hover:underline font-label-sm text-label-sm"
                      >
                        View
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
