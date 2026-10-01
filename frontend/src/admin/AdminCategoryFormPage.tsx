import { useEffect, useRef, useState, type FormEvent, type ReactNode } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { adminApi } from '../lib/api'

const emptyForm = {
  name: '',
  slug: '',
  tagline: '',
  intro: '',
  heroImage: '',
  sortOrder: '100',
  visible: true,
}

const slugify = (name: string) =>
  name
    .toLowerCase()
    .replace(/&/g, 'and')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')

function Field({ label, hint, required, children }: { label: string; hint?: string; required?: boolean; children: ReactNode }) {
  return (
    <div>
      <label className="block font-label-caps text-label-caps text-secondary mb-2 text-[10px] tracking-wider">
        {label}{required && ' *'}
      </label>
      {children}
      {hint && <p className="text-xs text-secondary mt-1.5">{hint}</p>}
    </div>
  )
}

export default function AdminCategoryFormPage() {
  const { slug: editSlug } = useParams<{ slug: string }>()
  const isEdit = Boolean(editSlug)
  const navigate = useNavigate()
  const fileRef = useRef<HTMLInputElement>(null)
  const [form, setForm] = useState(emptyForm)
  const [slugTouched, setSlugTouched] = useState(false)
  const [loading, setLoading] = useState(isEdit)
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!editSlug) return
    adminApi
      .getCategory(editSlug)
      .then((c) =>
        setForm({
          name: c.name,
          slug: c.slug,
          tagline: c.tagline,
          intro: c.intro,
          heroImage: c.heroImage ?? '',
          sortOrder: String(c.sortOrder),
          visible: c.visible,
        }),
      )
      .catch((err) => setError(err instanceof Error ? err.message : 'Failed to load category'))
      .finally(() => setLoading(false))
  }, [editSlug])

  const update = <K extends keyof typeof form>(field: K, value: (typeof form)[K]) => setForm((f) => ({ ...f, [field]: value }))

  const onName = (name: string) => {
    setForm((f) => ({ ...f, name, slug: !isEdit && !slugTouched ? slugify(name) : f.slug }))
  }

  const upload = async (file: File) => {
    setError('')
    setUploading(true)
    try {
      const folder = `categories/${form.slug || slugify(form.name) || 'new'}`
      const { url } = await adminApi.uploadImage(file, folder, `hero-${Date.now()}`)
      update('heroImage', url)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Image upload failed')
    } finally {
      setUploading(false)
      if (fileRef.current) fileRef.current.value = ''
    }
  }

  const submit = async (e: FormEvent) => {
    e.preventDefault()
    setError('')
    const slug = slugify(form.slug)
    if (!slug) return setError('Please enter a slug (letters, numbers and dashes).')
    setSaving(true)
    try {
      const payload = {
        name: form.name,
        slug,
        tagline: form.tagline,
        intro: form.intro,
        heroImage: form.heroImage,
        sortOrder: Number(form.sortOrder) || 0,
        visible: form.visible,
      }
      if (isEdit && editSlug) await adminApi.updateCategory(editSlug, payload)
      else await adminApi.createCategory(payload)
      navigate('/admin/categories')
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Failed to save'
      setError(/duplicate key/i.test(msg) ? `A category with the slug "${slug}" already exists.` : msg)
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="max-w-2xl w-full space-y-6">
        <div className="animate-pulse bg-outline/10 rounded h-8 w-40" />
        <div className="bg-surface rounded-lg border border-outline/15 p-8 space-y-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="animate-pulse bg-outline/10 rounded h-8 w-full" />
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-2xl w-full">
      <div className="mb-4 sm:mb-6">
        <Link to="/admin/categories" className="text-secondary hover:text-primary font-label-sm text-label-sm flex items-center gap-1 mb-4">
          <span className="material-symbols-outlined text-[16px]">arrow_back</span>
          Back to Categories
        </Link>
        <h2 className="font-headline-md text-headline-md text-primary">{isEdit ? 'Edit Category' : 'Add Category'}</h2>
      </div>

      <form onSubmit={submit} className="bg-surface p-4 sm:p-8 rounded-lg border border-outline/15 space-y-5 sm:space-y-6">
        <Field label="Name" required>
          <input className="admin-input" value={form.name} onChange={(e) => onName(e.target.value)} required placeholder="e.g. Beauty" />
        </Field>
        <Field
          label="Slug"
          required
          hint={isEdit ? 'Changing the slug moves its products with it and changes the page URL.' : `Page will be /collections/${form.slug || '…'}`}
        >
          <input
            className="admin-input"
            value={form.slug}
            onChange={(e) => {
              setSlugTouched(true)
              update('slug', e.target.value)
            }}
            onBlur={() => update('slug', slugify(form.slug))}
            required
          />
        </Field>
        <Field label="Tagline" hint="One short line shown on the hero and category cards.">
          <input className="admin-input" value={form.tagline} onChange={(e) => update('tagline', e.target.value)} placeholder="e.g. Tools for the daily ritual." />
        </Field>
        <Field label="Intro" hint="A sentence or two introducing the collection.">
          <textarea className="admin-input resize-none" rows={3} value={form.intro} onChange={(e) => update('intro', e.target.value)} />
        </Field>
        <Field label="Hero image" hint="Wide, calm image (at least 2000px wide). Leave empty to use the first product photo.">
          <div className="space-y-3">
            {form.heroImage && (
              <div className="relative aspect-[16/7] overflow-hidden rounded bg-surface-container">
                <img src={form.heroImage} alt="" className="w-full h-full object-cover" />
                <button
                  type="button"
                  onClick={() => update('heroImage', '')}
                  className="absolute top-2 right-2 bg-surface/90 text-primary rounded p-1.5"
                  aria-label="Remove image"
                >
                  <span className="material-symbols-outlined text-[18px]">close</span>
                </button>
              </div>
            )}
            <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={(e) => e.target.files?.[0] && upload(e.target.files[0])} />
            <button
              type="button"
              onClick={() => fileRef.current?.click()}
              disabled={uploading}
              className="inline-flex items-center gap-2 border border-outline/30 rounded px-4 py-2.5 text-sm text-primary hover:border-primary disabled:opacity-50"
            >
              <span className="material-symbols-outlined text-[18px]">upload</span>
              {uploading ? 'Uploading…' : form.heroImage ? 'Replace image' : 'Upload image'}
            </button>
          </div>
        </Field>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field label="Sort order" hint="Lower numbers come first.">
            <input className="admin-input" type="number" value={form.sortOrder} onChange={(e) => update('sortOrder', e.target.value)} />
          </Field>
          <label className="flex items-center gap-3 cursor-pointer sm:pt-6">
            <input type="checkbox" checked={form.visible} onChange={(e) => update('visible', e.target.checked)} className="form-checkbox text-deep-cocoa rounded-sm" />
            <span className="text-primary">Visible in the store</span>
          </label>
        </div>
        {error && <p className="text-error text-sm">{error}</p>}
        <button
          type="submit"
          disabled={saving || uploading}
          className="w-full sm:w-auto bg-primary text-on-primary font-label-caps text-label-caps px-8 py-3 rounded hover:opacity-90 disabled:opacity-50 cursor-pointer"
        >
          {saving ? 'Saving...' : isEdit ? 'Update Category' : 'Create Category'}
        </button>
      </form>
    </div>
  )
}
