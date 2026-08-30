import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { adminApi } from '../lib/api'
import type { Product, ProductCategory } from '../types/api'

const CATEGORIES: ProductCategory[] = ['fashion', 'home-lifestyle', 'accessories', 'jewelry', 'gadgets', 'gifts']

const emptyForm = {
  name: '',
  subtitle: '',
  description: '',
  price: '',
  currency: '$' as '$' | 'AED',
  image: '',
  category: 'fashion' as ProductCategory,
  badge: '' as '' | 'New Arrival' | 'Limited',
  inStock: true,
}

export default function AdminProductFormPage() {
  const { id } = useParams<{ id: string }>()
  const isEdit = Boolean(id)
  const navigate = useNavigate()
  const [form, setForm] = useState(emptyForm)
  const [loading, setLoading] = useState(isEdit)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!id) return
    adminApi.getProduct(id).then((p) => {
      setForm({
        name: p.name,
        subtitle: p.subtitle,
        description: p.description ?? '',
        price: String(p.price),
        currency: p.currency,
        image: p.image,
        category: p.category,
        badge: p.badge ?? '',
        inStock: p.inStock,
      })
    }).finally(() => setLoading(false))
  }, [id])

  const update = (field: string, value: string | boolean) => {
    setForm((f) => ({ ...f, [field]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSaving(true)
    try {
      const payload: Partial<Product> = {
        name: form.name,
        subtitle: form.subtitle,
        description: form.description,
        price: Number(form.price),
        currency: form.currency,
        image: form.image,
        category: form.category,
        badge: form.badge || undefined,
        inStock: form.inStock,
      }
      if (isEdit && id) {
        await adminApi.updateProduct(id, payload)
      } else {
        await adminApi.createProduct(payload)
      }
      navigate('/admin/products')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save')
    } finally {
      setSaving(false)
    }
  }

  if (loading) return <p className="text-secondary">Loading...</p>

  return (
    <div className="max-w-2xl">
      <div className="mb-6">
        <Link to="/admin/products" className="text-secondary hover:text-primary font-label-sm text-label-sm flex items-center gap-1 mb-4">
          <span className="material-symbols-outlined text-[16px]">arrow_back</span>
          Back to Products
        </Link>
        <h2 className="font-headline-md text-headline-md text-primary">
          {isEdit ? 'Edit Product' : 'Add Product'}
        </h2>
      </div>

      <form onSubmit={handleSubmit} className="bg-surface p-8 rounded border border-outline/15 space-y-6">
        <Field label="Product Name" required>
          <input className="admin-input" value={form.name} onChange={(e) => update('name', e.target.value)} required />
        </Field>
        <Field label="Subtitle">
          <input className="admin-input" value={form.subtitle} onChange={(e) => update('subtitle', e.target.value)} placeholder="e.g. Italian Leather" />
        </Field>
        <Field label="Description">
          <textarea className="admin-input resize-none" rows={3} value={form.description} onChange={(e) => update('description', e.target.value)} />
        </Field>
        <div className="grid grid-cols-2 gap-4">
          <Field label="Price" required>
            <input className="admin-input" type="number" min="0" step="0.01" value={form.price} onChange={(e) => update('price', e.target.value)} required />
          </Field>
          <Field label="Currency">
            <select className="admin-input" value={form.currency} onChange={(e) => update('currency', e.target.value)}>
              <option value="$">USD ($)</option>
              <option value="AED">AED</option>
            </select>
          </Field>
        </div>
        <Field label="Image URL" required>
          <input className="admin-input" value={form.image} onChange={(e) => update('image', e.target.value)} placeholder="https://..." required />
        </Field>
        {form.image && (
          <img src={form.image} alt="Preview" className="w-32 h-32 object-cover rounded border border-outline/15" />
        )}
        <div className="grid grid-cols-2 gap-4">
          <Field label="Category">
            <select className="admin-input" value={form.category} onChange={(e) => update('category', e.target.value)}>
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>{c.replace('-', ' ')}</option>
              ))}
            </select>
          </Field>
          <Field label="Badge">
            <select className="admin-input" value={form.badge} onChange={(e) => update('badge', e.target.value)}>
              <option value="">None</option>
              <option value="New Arrival">New Arrival</option>
              <option value="Limited">Limited</option>
            </select>
          </Field>
        </div>
        <label className="flex items-center gap-3 cursor-pointer">
          <input type="checkbox" checked={form.inStock} onChange={(e) => update('inStock', e.target.checked)} className="form-checkbox text-deep-cocoa rounded-sm" />
          <span className="text-primary">In Stock</span>
        </label>
        {error && <p className="text-error text-sm">{error}</p>}
        <button type="submit" disabled={saving} className="bg-primary text-on-primary font-label-caps text-label-caps px-8 py-3 rounded hover:opacity-90 disabled:opacity-50">
          {saving ? 'Saving...' : isEdit ? 'Update Product' : 'Create Product'}
        </button>
      </form>
    </div>
  )
}

function Field({ label, required, children }: { label: string; required?: boolean; children: React.ReactNode }) {
  return (
    <div>
      <label className="block font-label-caps text-label-caps text-secondary mb-2 text-[10px] tracking-wider">
        {label}{required && ' *'}
      </label>
      {children}
    </div>
  )
}
