import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { adminApi } from '../lib/api'
import type { Category } from '../types/api'

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([])
  const [counts, setCounts] = useState<Record<string, number>>({})
  const [loading, setLoading] = useState(true)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')

  const load = () => {
    setLoading(true)
    Promise.all([adminApi.getCategories(), adminApi.getProducts()])
      .then(([cats, products]) => {
        setCategories(cats)
        setCounts(products.reduce<Record<string, number>>((acc, p) => ({ ...acc, [p.category]: (acc[p.category] ?? 0) + 1 }), {}))
        setError('')
      })
      .catch((err) => setError(err instanceof Error ? err.message : 'Failed to load categories'))
      .finally(() => setLoading(false))
  }

  useEffect(load, [])

  const run = async (action: () => Promise<unknown>) => {
    setBusy(true)
    setError('')
    try {
      await action()
      load()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong')
    } finally {
      setBusy(false)
    }
  }

  // Swap sort_order with the neighbour; renumber in steps of 10 so gaps never collide.
  const move = (index: number, dir: -1 | 1) =>
    run(async () => {
      const order = [...categories]
      const [item] = order.splice(index, 1)
      order.splice(index + dir, 0, item)
      await Promise.all(order.map((c, i) => (c.sortOrder === (i + 1) * 10 ? null : adminApi.updateCategory(c.slug, { sortOrder: (i + 1) * 10 }))))
    })

  const toggleVisible = (c: Category) => run(() => adminApi.updateCategory(c.slug, { visible: !c.visible }))

  const remove = (c: Category) => {
    if (!confirm(`Delete the "${c.name}" category?`)) return
    run(() => adminApi.deleteCategory(c.slug))
  }

  return (
    <div className="space-y-5">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
        <p className="text-admin-muted max-w-xl">
          Each category gets its own page at /collections/&lt;slug&gt;. Empty or hidden categories are not shown in the store.
        </p>
        <Link to="/admin/categories/new" className="admin-btn admin-btn-primary w-full sm:w-auto">
          <span className="material-symbols-outlined text-[18px]">add</span>
          Add category
        </Link>
      </div>

      {error && <p className="text-[13px] bg-admin-red-tint text-admin-red-ink px-4 py-3 rounded-[10px]">{error}</p>}

      {loading ? (
        <div className="admin-card divide-y divide-admin-border">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="p-4 flex gap-4 items-center">
              <div className="admin-skeleton w-12 h-12 shrink-0" />
              <div className="flex-1 space-y-2">
                <div className="admin-skeleton h-4 w-48" />
                <div className="admin-skeleton h-3 w-32" />
              </div>
            </div>
          ))}
        </div>
      ) : (
        <ul className="admin-card divide-y divide-admin-border overflow-hidden">
          {categories.map((c, i) => {
            const count = counts[c.slug] ?? 0
            return (
              <li key={c.slug} className={`flex flex-wrap items-center gap-3 sm:gap-4 px-3 sm:px-4 py-3 hover:bg-admin-canvas/50 transition-colors ${busy ? 'opacity-60' : ''}`}>
                <div className="flex flex-col">
                  <button type="button" aria-label={`Move ${c.name} up`} disabled={busy || i === 0} onClick={() => move(i, -1)} className="admin-icon-btn !h-7">
                    <span className="material-symbols-outlined text-[18px]">keyboard_arrow_up</span>
                  </button>
                  <button type="button" aria-label={`Move ${c.name} down`} disabled={busy || i === categories.length - 1} onClick={() => move(i, 1)} className="admin-icon-btn !h-7">
                    <span className="material-symbols-outlined text-[18px]">keyboard_arrow_down</span>
                  </button>
                </div>
                <div className="w-12 h-12 shrink-0 bg-admin-canvas rounded-[10px] overflow-hidden">
                  {c.heroImage && <img src={c.heroImage} alt="" className="w-full h-full object-cover" />}
                </div>
                <div className="flex-1 min-w-[10rem]">
                  <p className="font-semibold">{c.name}</p>
                  <p className="text-[13px] text-admin-muted">
                    /collections/{c.slug} · {count} {count === 1 ? 'product' : 'products'}
                  </p>
                </div>
                <label className="flex items-center gap-2 cursor-pointer text-[13px] text-admin-muted">
                  <input type="checkbox" checked={c.visible} disabled={busy} onChange={() => toggleVisible(c)} className="admin-checkbox" />
                  Visible
                </label>
                <div className="flex items-center gap-1">
                  <Link to={`/collections/${c.slug}`} target="_blank" className="admin-icon-btn" aria-label={`View ${c.name}`} title="View in store">
                    <span className="material-symbols-outlined text-[20px]">open_in_new</span>
                  </Link>
                  <Link to={`/admin/categories/${c.slug}/edit`} className="admin-icon-btn" aria-label={`Edit ${c.name}`} title="Edit">
                    <span className="material-symbols-outlined text-[20px]">edit</span>
                  </Link>
                  <button
                    type="button"
                    onClick={() => remove(c)}
                    disabled={busy || count > 0}
                    title={count > 0 ? 'Move or delete its products first' : 'Delete'}
                    className="admin-icon-btn admin-icon-btn-danger"
                    aria-label={`Delete ${c.name}`}
                  >
                    <span className="material-symbols-outlined text-[20px]">delete</span>
                  </button>
                </div>
              </li>
            )
          })}
          {categories.length === 0 && <li className="p-8 text-center text-admin-muted">No categories yet.</li>}
        </ul>
      )}
    </div>
  )
}
