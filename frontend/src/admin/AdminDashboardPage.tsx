import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Price } from '../components/Price'
import { adminApi } from '../lib/api'
import type { AdminStats, Order, OrderStatus } from '../types/api'

// SVG needs raw colors; these mirror the `admin` palette in tailwind.config.ts.
const HEX = { gold: '#A9834E', sage: '#6F8A6C', plum: '#8A6A84', rose: '#B9746E', red: '#C2410C' }

const STATUS_COLORS: Record<OrderStatus, string> = {
  pending: HEX.gold,
  processing: HEX.sage,
  shipped: HEX.plum,
  delivered: HEX.rose,
  cancelled: HEX.red,
}

export default function AdminDashboardPage() {
  const navigate = useNavigate()
  const [stats, setStats] = useState<AdminStats | null>(null)
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const recentOrders = orders.slice(0, 5)

  useEffect(() => {
    Promise.all([adminApi.getStats(), adminApi.getOrders()])
      .then(([s, o]) => {
        setStats(s)
        setOrders(o)
      })
      .finally(() => setLoading(false))
  }, [])

  if (loading) {
    return (
      <div className="space-y-5">
        <div className="admin-skeleton h-10 w-full sm:w-80" />
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="admin-skeleton h-[104px]" />
          ))}
        </div>
        <div className="grid lg:grid-cols-3 gap-3 sm:gap-4">
          <div className="admin-skeleton h-72 lg:col-span-2" />
          <div className="admin-skeleton h-72" />
        </div>
        <div className="admin-skeleton h-64" />
      </div>
    )
  }

  const cards = [
    { label: 'Total products', value: stats?.totalProducts ?? 0, icon: 'inventory_2', tint: 'bg-admin-gold-tint', chip: 'bg-admin-gold' },
    { label: 'Total orders', value: stats?.totalOrders ?? 0, icon: 'receipt_long', tint: 'bg-admin-rose-tint', chip: 'bg-admin-rose' },
    { label: 'Pending orders', value: stats?.pendingOrders ?? 0, icon: 'pending_actions', tint: 'bg-admin-sage-tint', chip: 'bg-admin-sage' },
    { label: 'Out of stock', value: stats?.lowStock ?? 0, icon: 'warning', tint: 'bg-admin-plum-tint', chip: 'bg-admin-plum' },
  ]

  return (
    <div className="space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <p className="text-admin-muted">Here's how LuxeLife is doing today.</p>
        <div className="flex gap-2">
          <Link to="/admin/orders" className="admin-btn admin-btn-ghost flex-1 sm:flex-none">
            View all orders
          </Link>
          <Link to="/admin/products/new" className="admin-btn admin-btn-primary flex-1 sm:flex-none">
            <span className="material-symbols-outlined text-[18px]">add</span>
            Add product
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {cards.map((card) => (
          <div key={card.label} className={`${card.tint} rounded-[16px] p-4 sm:p-5 flex items-center gap-3 sm:gap-4 border border-white/60`}>
            <div className={`${card.chip} text-white w-10 h-10 sm:w-11 sm:h-11 rounded-[12px] hidden sm:flex items-center justify-center shrink-0 shadow-sm`}>
              <span className="material-symbols-outlined text-[20px]">{card.icon}</span>
            </div>
            <div className="min-w-0">
              <p className="text-[26px] sm:text-[28px] font-bold leading-none tabular-nums text-admin-ink">{card.value}</p>
              <p className="text-[13px] text-admin-muted mt-1.5 truncate">{card.label}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-3 sm:gap-4">
        <section className="admin-card p-4 sm:p-5 lg:col-span-2">
          <div className="flex items-start justify-between gap-3 mb-4">
            <div>
              <h2 className="admin-card-title">Sales overview</h2>
              <p className="admin-hint">Last 30 days</p>
            </div>
            <div className="text-right">
              <Price amount={stats?.totalRevenue ?? 0} variant="emphasis" className="text-admin-ink" />
              <p className="admin-hint mt-1">Total revenue</p>
            </div>
          </div>
          <RevenueChart orders={orders} />
        </section>
        <section className="admin-card p-4 sm:p-5 flex flex-col">
          <h2 className="admin-card-title">Orders by status</h2>
          <StatusDonut orders={orders} />
        </section>
      </div>

      <section className="admin-card overflow-hidden">
        <div className="px-4 sm:px-5 py-4 flex justify-between items-center gap-3">
          <h2 className="admin-card-title">Recent orders</h2>
          <Link to="/admin/orders" className="text-[13px] font-medium text-admin-gold-ink hover:underline shrink-0">
            View all
          </Link>
        </div>
        {recentOrders.length === 0 ? (
          <div className="py-12 px-6 text-center border-t border-admin-border">
            <span className="material-symbols-outlined text-[40px] text-admin-muted/40 block mb-2">receipt_long</span>
            <p className="text-admin-muted">No orders yet.</p>
          </div>
        ) : (
          <>
            <div className="md:hidden divide-y divide-admin-border border-t border-admin-border">
              {recentOrders.map((order) => (
                <Link key={order.id} to={`/admin/orders/${order.id}`} className="block px-4 py-3.5 hover:bg-admin-canvas transition-colors">
                  <div className="flex items-start justify-between gap-3 mb-1">
                    <span className="font-semibold">{order.orderNumber}</span>
                    <StatusBadge status={order.status} />
                  </div>
                  <p className="text-admin-muted text-[13px]">
                    {order.customer.firstName} {order.customer.lastName}
                  </p>
                  <div className="flex items-center justify-between mt-1.5 text-[13px]">
                    <Price amount={order.subtotal} variant="inline" />
                    <span className="text-admin-muted">{new Date(order.createdAt).toLocaleDateString()}</span>
                  </div>
                </Link>
              ))}
            </div>
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full min-w-[640px]">
                <thead>
                  <tr className="border-y border-admin-border">
                    <th className="admin-th">Order</th>
                    <th className="admin-th">Customer</th>
                    <th className="admin-th">Total</th>
                    <th className="admin-th">Status</th>
                    <th className="admin-th">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-admin-border">
                  {recentOrders.map((order) => (
                    <tr
                      key={order.id}
                      onClick={() => navigate(`/admin/orders/${order.id}`)}
                      className="hover:bg-admin-canvas/70 transition-colors cursor-pointer"
                    >
                      <td className="admin-td">
                        <Link to={`/admin/orders/${order.id}`} className="font-semibold hover:underline" onClick={(e) => e.stopPropagation()}>
                          {order.orderNumber}
                        </Link>
                      </td>
                      <td className="admin-td text-admin-muted">
                        {order.customer.firstName} {order.customer.lastName}
                      </td>
                      <td className="admin-td">
                        <Price amount={order.subtotal} variant="inline" />
                      </td>
                      <td className="admin-td">
                        <StatusBadge status={order.status} />
                      </td>
                      <td className="admin-td text-admin-muted">{new Date(order.createdAt).toLocaleDateString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </section>
    </div>
  )
}

function RevenueChart({ orders }: { orders: Order[] }) {
  const DAYS = 30
  const W = 600
  const H = 200
  const PAD = 8
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const days = Array.from({ length: DAYS }, (_, i) => {
    const d = new Date(today)
    d.setDate(d.getDate() - (DAYS - 1 - i))
    return d
  })
  const totals = days.map(() => 0)
  for (const o of orders) {
    if (o.status === 'cancelled') continue
    const d = new Date(o.createdAt)
    d.setHours(0, 0, 0, 0)
    const idx = Math.round((d.getTime() - days[0].getTime()) / 86_400_000)
    if (idx >= 0 && idx < DAYS) totals[idx] += o.subtotal
  }
  const max = Math.max(...totals, 1)
  const x = (i: number) => (i / (DAYS - 1)) * W
  const y = (v: number) => H - PAD - (v / max) * (H - PAD * 2)
  const line = totals.map((v, i) => `${i ? 'L' : 'M'}${x(i)},${y(v)}`).join(' ')
  const fmt = (d: Date) => d.toLocaleDateString(undefined, { day: 'numeric', month: 'short' })

  return (
    <div>
      <div className="relative h-40 sm:h-48">
        <svg viewBox={`0 0 ${W} ${H}`} className="absolute inset-0 w-full h-full" preserveAspectRatio="none" aria-hidden>
          <defs>
            <linearGradient id="rev-fill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={HEX.gold} stopOpacity="0.28" />
              <stop offset="100%" stopColor={HEX.gold} stopOpacity="0" />
            </linearGradient>
          </defs>
          {[0.25, 0.5, 0.75, 1].map((f) => (
            <line key={f} x1="0" x2={W} y1={y(max * f)} y2={y(max * f)} stroke="#ECE7E0" strokeDasharray="4 4" vectorEffect="non-scaling-stroke" />
          ))}
          <path d={`${line} L${W},${H} L0,${H} Z`} fill="url(#rev-fill)" />
          <path d={line} fill="none" stroke={HEX.gold} strokeWidth="2.5" strokeLinejoin="round" strokeLinecap="round" vectorEffect="non-scaling-stroke" />
        </svg>
        {/* dots as HTML so they stay round while the SVG stretches */}
        {totals.map((v, i) =>
          v > 0 ? (
            <span
              key={i}
              title={`${fmt(days[i])}: AED ${v.toLocaleString()}`}
              className="absolute w-2.5 h-2.5 -ml-[5px] -mt-[5px] rounded-full bg-white border-2 border-admin-gold"
              style={{ left: `${(x(i) / W) * 100}%`, top: `${(y(v) / H) * 100}%` }}
            />
          ) : null,
        )}
      </div>
      <div className="flex justify-between text-[12px] text-admin-muted mt-2 tabular-nums">
        {[0, 7, 14, 21, 29].map((i) => (
          <span key={i}>{fmt(days[i])}</span>
        ))}
      </div>
    </div>
  )
}

function StatusDonut({ orders }: { orders: Order[] }) {
  const R = 52
  const C = 2 * Math.PI * R
  const counts = (Object.keys(STATUS_COLORS) as OrderStatus[]).map((s) => ({
    status: s,
    count: orders.filter((o) => o.status === s).length,
  }))
  const total = orders.length
  let offset = 0

  return (
    <div className="flex-1 flex flex-col items-center justify-center gap-5 pt-4">
      <div className="relative">
        <svg viewBox="0 0 140 140" className="w-36 h-36 -rotate-90" role="img" aria-label={counts.map((c) => `${c.status} ${c.count}`).join(', ')}>
          <circle cx="70" cy="70" r={R} fill="none" stroke="#F1EDE7" strokeWidth="14" />
          {total > 0 &&
            counts.map(({ status, count }) => {
              if (!count) return null
              const len = (count / total) * C
              const seg = (
                <circle
                  key={status}
                  cx="70"
                  cy="70"
                  r={R}
                  fill="none"
                  stroke={STATUS_COLORS[status]}
                  strokeWidth="14"
                  strokeDasharray={`${len} ${C - len}`}
                  strokeDashoffset={-offset}
                />
              )
              offset += len
              return seg
            })}
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-[28px] font-bold leading-none tabular-nums">{total}</span>
          <span className="text-[12px] text-admin-muted mt-1">orders</span>
        </div>
      </div>
      <ul className="grid grid-cols-2 gap-x-6 gap-y-2 w-full max-w-[260px]">
        {counts.map(({ status, count }) => (
          <li key={status} className="flex items-center gap-2 text-[13px]">
            <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ background: STATUS_COLORS[status] }} />
            <span className="capitalize text-admin-muted flex-1">{status}</span>
            <span className="font-semibold tabular-nums">{count}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}

export function StatusBadge({ status }: { status: string }) {
  const colors: Record<string, string> = {
    pending: 'bg-admin-gold-tint text-admin-gold-ink',
    processing: 'bg-admin-sage-tint text-admin-sage-ink',
    shipped: 'bg-admin-plum-tint text-admin-plum-ink',
    delivered: 'bg-admin-rose-tint text-admin-rose-ink',
    cancelled: 'bg-admin-red-tint text-admin-red-ink',
  }
  return <span className={`admin-badge ${colors[status] ?? 'bg-admin-canvas text-admin-muted'}`}>{status}</span>
}

export function PaymentBadge({ status }: { status: string }) {
  const colors: Record<string, string> = {
    paid: 'bg-admin-sage-tint text-admin-sage-ink',
    unpaid: 'bg-admin-gold-tint text-admin-gold-ink',
    failed: 'bg-admin-red-tint text-admin-red-ink',
  }
  return <span className={`admin-badge ${colors[status] ?? 'bg-admin-canvas text-admin-muted'}`}>{status}</span>
}
