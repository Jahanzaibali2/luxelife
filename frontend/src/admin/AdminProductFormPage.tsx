import { useEffect, useRef, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { adminApi } from '../lib/api'
import type { Product, ProductCategory } from '../types/api'

const CATEGORIES: ProductCategory[] = ['fashion', 'home-lifestyle', 'accessories', 'jewelry', 'gadgets', 'gifts']

const emptyForm = {
  name: '',
  subtitle: '',
  description: '',
  price: '',
  image: '',
  category: 'fashion' as ProductCategory,
  badge: '' as '' | 'New Arrival' | 'Limited',
  inStock: true,
}

function slugFromName(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
}

export default function AdminProductFormPage() {
  const { id } = useParams<{ id: string }>()
  const isEdit = Boolean(id)
  const navigate = useNavigate()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [form, setForm] = useState(emptyForm)
  const [loading, setLoading] = useState(isEdit)
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!id) return
    adminApi.getProduct(id).then((p) => {
      setForm({
        name: p.name,
        subtitle: p.subtitle,
        description: p.description ?? '',
        price: String(p.price),
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

  const productSlug = id ?? (form.name ? slugFromName(form.name) : '')

  const handleImageUpload = async (file: File) => {
    setError('')
    setUploading(true)
    try {
      const { url } = await adminApi.uploadImage(
        file,
        productSlug || undefined,
        form.name || undefined,
      )
      update('image', url)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Image upload failed')
    } finally {
      setUploading(false)
      if (fileInputRef.current) fileInputRef.current.value = ''
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (!form.image) {
      setError('Please upload a product image')
      return
    }

    setSaving(true)
    try {
      const payload: Partial<Product> = {
        name: form.name,
        subtitle: form.subtitle,
        description: form.description,
        price: Number(form.price),
        currency: 'AED',
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
    <div className="max-w-2xl w-full">
      <div className="mb-4 sm:mb-6">
        <Link to="/admin/products" className="text-secondary hover:text-primary font-label-sm text-label-sm flex items-center gap-1 mb-4">
          <span className="material-symbols-outlined text-[16px]">arrow_back</span>
          Back to Products
        </Link>
        <h2 className="font-headline-md text-headline-md text-primary">
          {isEdit ? 'Edit Product' : 'Add Product'}
        </h2>
      </div>

      <form onSubmit={handleSubmit} className="bg-surface p-4 sm:p-8 rounded border border-outline/15 space-y-5 sm:space-y-6">
        <Field label="Product Name" required>
          <input className="admin-input" value={form.name} onChange={(e) => update('name', e.target.value)} required />
        </Field>
        <Field label="Subtitle">
          <input className="admin-input" value={form.subtitle} onChange={(e) => update('subtitle', e.target.value)} placeholder="e.g. Italian Leather" />
        </Field>
        <Field label="Description">
          <textarea className="admin-input resize-none" rows={3} value={form.description} onChange={(e) => update('description', e.target.value)} />
        </Field>
        <Field label="Price (AED)" required>
          <input className="admin-input" type="number" min="0" step="0.01" value={form.price} onChange={(e) => update('price', e.target.value)} required />
        </Field>

        <Field label="Product Image" required>
          <div className="space-y-3">
            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp,image/gif"
              className="admin-input file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:bg-primary file:text-on-primary file:font-label-caps file:text-label-caps file:cursor-pointer"
              onChange={(e) => {
                const file = e.target.files?.[0]
                if (file) void handleImageUpload(file)
              }}
              disabled={uploading}
            />
            <p className="text-secondary text-xs">
              Stored in Supabase Storage ({productSlug || 'slug from name'}/main). Max 5 MB.
            </p>
            {uploading && <p className="text-secondary text-sm">Uploading image...</p>}
          </div>
        </Field>
        {form.image && (
          <img src={form.image} alt="Preview" className="w-40 h-40 object-cover rounded border border-outline/15" loading="lazy" decoding="async" />
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
        <button type="submit" disabled={saving || uploading} className="w-full sm:w-auto bg-primary text-on-primary font-label-caps text-label-caps px-8 py-3 rounded hover:opacity-90 disabled:opacity-50">
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
