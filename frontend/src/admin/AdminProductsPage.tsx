import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Price } from '../components/Price'
import { adminApi } from '../lib/api'
import type { Product } from '../types/api'

function StockBadge({ inStock }: { inStock: boolean }) {
  return (
    <span className={`admin-badge ${inStock ? 'bg-admin-sage-tint text-admin-sage-ink' : 'bg-admin-red-tint text-admin-red-ink'}`}>
      {inStock ? 'In stock' : 'Out of stock'}
    </span>
  )
}

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)

  const load = () => {
    setLoading(true)
    adminApi.getProducts().then(setProducts).finally(() => setLoading(false))
  }

  useEffect(() => {
    load()
  }, [])

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Delete "${name}"?`)) return
    await adminApi.deleteProduct(id)
    load()
  }

  return (
    <div className="space-y-5">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
        <p className="text-admin-muted">
          {loading ? 'Loading products…' : `${products.length} ${products.length === 1 ? 'product' : 'products'}`}
        </p>
        <Link to="/admin/products/new" className="admin-btn admin-btn-primary w-full sm:w-auto">
          <span className="material-symbols-outlined text-[18px]">add</span>
          Add product
        </Link>
      </div>

      {loading ? (
        <div className="admin-card divide-y divide-admin-border">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="p-4 flex gap-4 items-center">
              <div className="admin-skeleton w-12 h-12 shrink-0" />
              <div className="flex-1 space-y-2">
                <div className="admin-skeleton h-4 w-48" />
                <div className="admin-skeleton h-3 w-32" />
              </div>
              <div className="admin-skeleton h-3 w-16 hidden sm:block" />
            </div>
          ))}
        </div>
      ) : products.length === 0 ? (
        <div className="admin-card py-16 px-6 text-center">
          <span className="material-symbols-outlined text-[40px] text-admin-muted/40 block mb-2">inventory_2</span>
          <p className="text-admin-muted mb-4">No products yet.</p>
          <Link to="/admin/products/new" className="admin-btn admin-btn-primary">
            <span className="material-symbols-outlined text-[18px]">add</span>
            Add your first product
          </Link>
        </div>
      ) : (
        <>
          <div className="md:hidden space-y-3">
            {products.map((p) => (
              <div key={p.id} className="admin-card p-4">
                <div className="flex gap-3">
                  <img src={p.image} alt="" className="w-16 h-16 object-cover rounded-[10px] shrink-0" loading="lazy" decoding="async" />
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold truncate">{p.name}</p>
                    <p className="text-[13px] text-admin-muted truncate">{p.subtitle}</p>
                    <div className="mt-1">
                      <Price amount={p.price} variant="inline" />
                    </div>
                  </div>
                  <div className="flex flex-col gap-1 shrink-0 -mr-1">
                    <Link to={`/admin/products/${p.id}/edit`} className="admin-icon-btn" aria-label={`Edit ${p.name}`}>
                      <span className="material-symbols-outlined text-[20px]">edit</span>
                    </Link>
                    <button type="button" onClick={() => handleDelete(p.id, p.name)} className="admin-icon-btn admin-icon-btn-danger" aria-label={`Delete ${p.name}`}>
                      <span className="material-symbols-outlined text-[20px]">delete</span>
                    </button>
                  </div>
                </div>
                <div className="flex items-center justify-between mt-3 pt-3 border-t border-admin-border text-[13px]">
                  <span className="text-admin-muted capitalize">{p.category.replace('-', ' ')}</span>
                  <StockBadge inStock={p.inStock} />
                </div>
              </div>
            ))}
          </div>

          <div className="hidden md:block admin-card overflow-x-auto">
            <table className="w-full min-w-[700px]">
              <thead>
                <tr className="border-b border-admin-border">
                  <th className="admin-th">Product</th>
                  <th className="admin-th">Category</th>
                  <th className="admin-th">Price</th>
                  <th className="admin-th">Stock</th>
                  <th className="admin-th text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-admin-border">
                {products.map((p) => (
                  <tr key={p.id} className="hover:bg-admin-canvas/70 transition-colors">
                    <td className="admin-td">
                      <div className="flex items-center gap-3.5">
                        <img src={p.image} alt="" className="w-11 h-11 object-cover rounded-[10px] shrink-0" loading="lazy" decoding="async" />
                        <div className="min-w-0 max-w-[16rem] lg:max-w-sm xl:max-w-md">
                          <p className="font-semibold truncate">{p.name}</p>
                          <p className="text-[13px] text-admin-muted truncate" title={p.subtitle}>
                            {p.subtitle}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="admin-td text-admin-muted capitalize">{p.category.replace('-', ' ')}</td>
                    <td className="admin-td whitespace-nowrap">
                      <Price amount={p.price} variant="inline" />
                    </td>
                    <td className="admin-td">
                      <StockBadge inStock={p.inStock} />
                    </td>
                    <td className="admin-td">
                      <div className="flex gap-1 justify-end">
                        <Link to={`/admin/products/${p.id}/edit`} className="admin-icon-btn" aria-label={`Edit ${p.name}`} title="Edit">
                          <span className="material-symbols-outlined text-[20px]">edit</span>
                        </Link>
                        <button
                          type="button"
                          onClick={() => handleDelete(p.id, p.name)}
                          className="admin-icon-btn admin-icon-btn-danger"
                          aria-label={`Delete ${p.name}`}
                          title="Delete"
                        >
                          <span className="material-symbols-outlined text-[20px]">delete</span>
                        </button>
                      </div>
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
