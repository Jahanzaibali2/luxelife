import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { adminApi } from '../lib/api'
import type { Product } from '../types/api'
import { StatusBadge } from './AdminDashboardPage'

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)

  const load = () => {
    setLoading(true)
    adminApi.getProducts().then(setProducts).finally(() => setLoading(false))
  }

  useEffect(() => { load() }, [])

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Delete "${name}"?`)) return
    await adminApi.deleteProduct(id)
    load()
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="font-headline-md text-headline-md text-primary">Products</h2>
        <Link to="/admin/products/new" className="inline-flex items-center gap-2 bg-primary text-on-primary font-label-caps text-label-caps px-5 py-3 rounded hover:opacity-90">
          <span className="material-symbols-outlined text-[18px]">add</span>
          Add Product
        </Link>
      </div>

      {loading ? (
        <p className="text-secondary">Loading products...</p>
      ) : (
        <div className="bg-surface rounded border border-outline/15 overflow-x-auto">
          <table className="w-full text-left min-w-[700px]">
            <thead>
              <tr className="border-b border-outline/15 font-label-caps text-label-caps text-[10px] text-secondary tracking-wider">
                <th className="px-6 py-3">Product</th>
                <th className="px-6 py-3">Category</th>
                <th className="px-6 py-3">Price</th>
                <th className="px-6 py-3">Stock</th>
                <th className="px-6 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map((p) => (
                <tr key={p.id} className="border-b border-outline/10 hover:bg-surface-container-low">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-4">
                      <img src={p.image} alt="" className="w-12 h-12 object-cover rounded" loading="lazy" decoding="async" />
                      <div>
                        <p className="font-medium text-primary">{p.name}</p>
                        <p className="text-sm text-secondary">{p.subtitle}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-secondary capitalize">{p.category.replace('-', ' ')}</td>
                  <td className="px-6 py-4 text-primary">{p.currency} {p.price}</td>
                  <td className="px-6 py-4">
                    <StatusBadge status={p.inStock ? 'delivered' : 'cancelled'} />
                    <span className="ml-2 text-sm text-secondary">{p.inStock ? 'In Stock' : 'Out of Stock'}</span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex gap-2">
                      <Link to={`/admin/products/${p.id}/edit`} className="text-secondary hover:text-primary">
                        <span className="material-symbols-outlined text-[20px]">edit</span>
                      </Link>
                      <button type="button" onClick={() => handleDelete(p.id, p.name)} className="text-secondary hover:text-error">
                        <span className="material-symbols-outlined text-[20px]">delete</span>
                      </button>
                    </div>
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
