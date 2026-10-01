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
    <div className="space-y-4 sm:space-y-6">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
        <div>
          <h2 className="font-headline-md text-headline-md text-primary">Categories</h2>
          <p className="text-secondary text-sm mt-1">Each category gets its own page at /collections/&lt;slug&gt;. Empty or hidden categories are not shown in the store.</p>
        </div>
        <Link
          to="/admin/categories/new"
          className="inline-flex items-center justify-center gap-2 bg-primary text-on-primary font-label-caps text-label-caps px-5 py-3 rounded hover:opacity-90 w-full sm:w-auto"
        >
          <span className="material-symbols-outlined text-[18px]">add</span>
          Add Category
        </Link>
      </div>

      {error && <p className="text-error text-sm bg-error-container/40 px-4 py-3 rounded">{error}</p>}

      {loading ? (
        <div className="space-y-3">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-surface rounded-lg border border-outline/15 p-4 flex gap-4 items-center">
              <div className="animate-pulse bg-outline/10 rounded w-14 h-14 shrink-0" />
              <div className="flex-1 space-y-2">
                <div className="animate-pulse bg-outline/10 rounded h-4 w-48" />
                <div className="animate-pulse bg-outline/10 rounded h-3 w-32" />
              </div>
            </div>
          ))}
        </div>
      ) : (
        <ul className="bg-surface rounded-lg border border-outline/15 divide-y divide-outline/10">
          {categories.map((c, i) => {
            const count = counts[c.slug] ?? 0
            return (
              <li key={c.slug} className={`flex flex-wrap items-center gap-4 p-4 ${busy ? 'opacity-60' : ''}`}>
                <div className="flex flex-col">
                  <button type="button" aria-label={`Move ${c.name} up`} disabled={busy || i === 0} onClick={() => move(i, -1)} className="text-secondary hover:text-primary disabled:opacity-20">
                    <span className="material-symbols-outlined text-[18px]">keyboard_arrow_up</span>
                  </button>
                  <button type="button" aria-label={`Move ${c.name} down`} disabled={busy || i === categories.length - 1} onClick={() => move(i, 1)} className="text-secondary hover:text-primary disabled:opacity-20">
                    <span className="material-symbols-outlined text-[18px]">keyboard_arrow_down</span>
                  </button>
                </div>
                <div className="w-14 h-14 shrink-0 bg-surface-container rounded overflow-hidden">
                  {c.heroImage && <img src={c.heroImage} alt="" className="w-full h-full object-cover" />}
                </div>
                <div className="flex-1 min-w-[10rem]">
                  <p className="font-body-md text-primary font-medium">{c.name}</p>
                  <p className="text-sm text-secondary">/collections/{c.slug} · {count} {count === 1 ? 'product' : 'products'}</p>
                </div>
                <label className="flex items-center gap-2 cursor-pointer text-sm text-secondary">
                  <input type="checkbox" checked={c.visible} disabled={busy} onChange={() => toggleVisible(c)} className="form-checkbox text-deep-cocoa rounded-sm" />
                  Visible
                </label>
                <div className="flex items-center gap-1">
                  <Link to={`/collections/${c.slug}`} target="_blank" className="p-2 text-secondary hover:text-primary" aria-label={`View ${c.name}`}>
                    <span className="material-symbols-outlined text-[20px]">open_in_new</span>
                  </Link>
                  <Link to={`/admin/categories/${c.slug}/edit`} className="p-2 text-secondary hover:text-primary" aria-label={`Edit ${c.name}`}>
                    <span className="material-symbols-outlined text-[20px]">edit</span>
                  </Link>
                  <button
                    type="button"
                    onClick={() => remove(c)}
                    disabled={busy || count > 0}
                    title={count > 0 ? 'Move or delete its products first' : undefined}
                    className="p-2 text-secondary hover:text-error disabled:opacity-25 disabled:hover:text-secondary"
                    aria-label={`Delete ${c.name}`}
                  >
                    <span className="material-symbols-outlined text-[20px]">delete</span>
                  </button>
                </div>
              </li>
            )
          })}
          {categories.length === 0 && <li className="p-8 text-center text-secondary">No categories yet.</li>}
        </ul>
      )}
    </div>
  )
}
