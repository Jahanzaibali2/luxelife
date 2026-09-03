import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Price } from '../components/Price'
import { adminApi } from '../lib/api'
import type { Product } from '../types/api'

function StockBadge({ inStock }: { inStock: boolean }) {
  return (
    <span
      className={`inline-block px-2.5 py-1 rounded-full text-[10px] font-label-caps tracking-wider uppercase whitespace-nowrap ${
        inStock ? 'bg-secondary-container text-primary' : 'bg-error-container text-error'
      }`}
    >
      {inStock ? 'In Stock' : 'Out of Stock'}
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
    <div className="space-y-4 sm:space-y-6">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
        <h2 className="font-headline-md text-headline-md text-primary">Products</h2>
        <Link
          to="/admin/products/new"
          className="inline-flex items-center justify-center gap-2 bg-primary text-on-primary font-label-caps text-label-caps px-5 py-3 rounded hover:opacity-90 btn-lift w-full sm:w-auto"
        >
          <span className="material-symbols-outlined text-[18px]">add</span>
          Add Product
        </Link>
      </div>

      {loading ? (
        <div className="space-y-3">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="bg-surface rounded-lg border border-outline/15 p-4 flex gap-4 items-center">
              <div className="animate-pulse bg-outline/10 rounded w-14 h-14 shrink-0" />
              <div className="flex-1 space-y-2">
                <div className="animate-pulse bg-outline/10 rounded h-4 w-48" />
                <div className="animate-pulse bg-outline/10 rounded h-3 w-32" />
              </div>
              <div className="animate-pulse bg-outline/10 rounded h-3 w-16 hidden sm:block" />
            </div>
          ))}
        </div>
      ) : products.length === 0 ? (
        <div className="bg-surface rounded-lg border border-outline/15 py-16 px-6 text-center">
          <span className="material-symbols-outlined text-[48px] text-secondary/30 block mb-3">inventory_2</span>
          <p className="text-secondary text-sm mb-4">No products yet.</p>
          <Link
            to="/admin/products/new"
            className="inline-flex items-center gap-2 bg-primary text-on-primary font-label-caps text-label-caps px-5 py-2.5 rounded hover:opacity-90 btn-lift"
          >
            <span className="material-symbols-outlined text-[16px]">add</span>
            Add your first product
          </Link>
        </div>
      ) : (
        <>
          <div className="md:hidden space-y-3">
            {products.map((p) => (
              <div key={p.id} className="bg-surface rounded-lg border border-outline/15 p-4">
                <div className="flex gap-3">
                  <img
                    src={p.image}
                    alt=""
                    className="w-16 h-16 object-cover rounded-lg shrink-0"
                    loading="lazy"
                    decoding="async"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-primary truncate">{p.name}</p>
                    <p className="text-sm text-secondary truncate">{p.subtitle}</p>
                    <div className="mt-1">
                      <Price amount={p.price} variant="inline" />
                    </div>
                  </div>
                  <div className="flex flex-col gap-2 shrink-0">
                    <Link to={`/admin/products/${p.id}/edit`} className="text-secondary hover:text-primary p-1 transition-colors">
                      <span className="material-symbols-outlined text-[20px]">edit</span>
                    </Link>
                    <button
                      type="button"
                      onClick={() => handleDelete(p.id, p.name)}
                      className="text-secondary hover:text-error p-1 transition-colors cursor-pointer"
                    >
                      <span className="material-symbols-outlined text-[20px]">delete</span>
                    </button>
                  </div>
                </div>
                <div className="flex items-center justify-between mt-3 pt-3 border-t border-outline/10 text-sm">
                  <span className="text-secondary capitalize">{p.category.replace('-', ' ')}</span>
                  <StockBadge inStock={p.inStock} />
                </div>
              </div>
            ))}
          </div>

          <div className="hidden md:block bg-surface rounded-lg border border-outline/15 overflow-x-auto">
            <table className="w-full text-left min-w-[700px]">
              <thead>
                <tr className="border-b border-outline/15 bg-surface-container-low/50 font-label-caps text-label-caps text-[10px] text-secondary tracking-wider">
                  <th className="px-6 py-3.5">Product</th>
                  <th className="px-6 py-3.5">Category</th>
                  <th className="px-6 py-3.5">Price</th>
                  <th className="px-6 py-3.5">Stock</th>
                  <th className="px-6 py-3.5">Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.map((p) => (
                  <tr key={p.id} className="border-b border-outline/10 hover:bg-surface-container-low transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-4">
                        <img
                          src={p.image}
                          alt=""
                          className="w-12 h-12 object-cover rounded-lg shrink-0"
                          loading="lazy"
                          decoding="async"
                        />
                        <div className="min-w-0">
                          <p className="font-medium text-primary truncate">{p.name}</p>
                          <p className="text-sm text-secondary truncate">{p.subtitle}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-secondary capitalize">{p.category.replace('-', ' ')}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Price amount={p.price} variant="inline" />
                    </td>
                    <td className="px-6 py-4">
                      <StockBadge inStock={p.inStock} />
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex gap-3">
                        <Link to={`/admin/products/${p.id}/edit`} className="text-secondary hover:text-primary transition-colors" aria-label="Edit product">
                          <span className="material-symbols-outlined text-[20px]">edit</span>
                        </Link>
                        <button
                          type="button"
                          onClick={() => handleDelete(p.id, p.name)}
                          className="text-secondary hover:text-error transition-colors cursor-pointer"
                          aria-label="Delete product"
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
