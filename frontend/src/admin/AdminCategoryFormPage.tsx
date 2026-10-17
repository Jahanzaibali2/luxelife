import { useEffect, useRef, useState, type FormEvent, type ReactNode } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { adminApi } from '../lib/api'

const emptyForm = {
  name: '',
  slug: '',
  tagline: '',
  intro: '',
  heroImage: '',
  cardImage: '',
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
      <label className="admin-label">
        {label}
        {required && <span className="text-admin-gold"> *</span>}
      </label>
      {children}
      {hint && <p className="admin-hint mt-1.5">{hint}</p>}
    </div>
  )
}

function ImageField({
  value,
  ratio,
  uploading,
  onFile,
  onRemove,
}: {
  value: string
  ratio: string
  uploading: boolean
  onFile: (file: File) => void
  onRemove: () => void
}) {
  const fileRef = useRef<HTMLInputElement>(null)
  return (
    <div className="space-y-3">
      {value && (
        <div className={`relative overflow-hidden rounded-[12px] bg-admin-canvas ${ratio}`}>
          <img src={value} alt="" className="w-full h-full object-cover" />
          <button
            type="button"
            onClick={onRemove}
            className="admin-icon-btn absolute top-2 right-2 bg-white/90 text-admin-ink shadow-sm"
            aria-label="Remove image"
          >
            <span className="material-symbols-outlined text-[18px]">close</span>
          </button>
        </div>
      )}
      <input
        ref={fileRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          if (e.target.files?.[0]) onFile(e.target.files[0])
          e.target.value = ''
        }}
      />
      <button type="button" onClick={() => fileRef.current?.click()} disabled={uploading} className="admin-btn admin-btn-ghost">
        <span className="material-symbols-outlined text-[18px]">upload</span>
        {uploading ? 'Uploading…' : value ? 'Replace image' : 'Upload image'}
      </button>
    </div>
  )
}

export default function AdminCategoryFormPage() {
  const { slug: editSlug } = useParams<{ slug: string }>()
  const isEdit = Boolean(editSlug)
  const navigate = useNavigate()
  const [form, setForm] = useState(emptyForm)
  const [slugTouched, setSlugTouched] = useState(false)
  const [loading, setLoading] = useState(isEdit)
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState<'heroImage' | 'cardImage' | null>(null)
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
          cardImage: c.cardImage ?? '',
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

  const upload = async (file: File, field: 'heroImage' | 'cardImage') => {
    setError('')
    setUploading(field)
    try {
      const folder = `categories/${form.slug || slugify(form.name) || 'new'}`
      const { url } = await adminApi.uploadImage(file, folder, `${field === 'heroImage' ? 'hero' : 'card'}-${Date.now()}`)
      update(field, url)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Image upload failed')
    } finally {
      setUploading(null)
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
        cardImage: form.cardImage,
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
      <div className="max-w-2xl w-full space-y-5">
        <div className="admin-skeleton h-4 w-32" />
        <div className="admin-card p-6 space-y-5">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="admin-skeleton h-10 w-full" />
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-2xl w-full">
      <Link to="/admin/categories" className="inline-flex items-center gap-1 text-[13px] font-medium text-admin-muted hover:text-admin-ink mb-4">
        <span className="material-symbols-outlined text-[18px]">arrow_back</span>
        Back to categories
      </Link>

      <form onSubmit={submit} className="admin-card p-4 sm:p-6 space-y-5">
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
        <Field label="Hero image" hint="Wide landscape image (at least 2000px wide, max 30 MB) for the full-screen banner on the collection page. Leave empty to use the first product photo.">
          <ImageField
            value={form.heroImage}
            ratio="aspect-[16/7]"
            uploading={uploading === 'heroImage'}
            onFile={(f) => upload(f, 'heroImage')}
            onRemove={() => update('heroImage', '')}
          />
        </Field>
        <Field label="Card image" hint="Portrait image (about 1200×1500px, max 30 MB) for the home page tiles, shop menu and collections grid. Leave empty to use the hero image.">
          <div className="max-w-[240px]">
            <ImageField
              value={form.cardImage}
              ratio="aspect-[4/5]"
              uploading={uploading === 'cardImage'}
              onFile={(f) => upload(f, 'cardImage')}
              onRemove={() => update('cardImage', '')}
            />
          </div>
        </Field>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field label="Sort order" hint="Lower numbers come first.">
            <input className="admin-input" type="number" value={form.sortOrder} onChange={(e) => update('sortOrder', e.target.value)} />
          </Field>
          <label className="flex items-center gap-3 cursor-pointer sm:pt-7">
            <input type="checkbox" checked={form.visible} onChange={(e) => update('visible', e.target.checked)} className="admin-checkbox" />
            <span>Visible in the store</span>
          </label>
        </div>
        {error && <p className="text-[13px] bg-admin-red-tint text-admin-red-ink px-4 py-3 rounded-[10px]">{error}</p>}
        <button
          type="submit"
          disabled={saving || uploading !== null}
          className="admin-btn admin-btn-primary w-full sm:w-auto px-6"
        >
          {saving ? 'Saving…' : isEdit ? 'Update category' : 'Create category'}
        </button>
      </form>
    </div>
  )
}
