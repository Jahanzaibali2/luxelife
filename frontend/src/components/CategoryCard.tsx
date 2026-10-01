import { Link } from 'react-router-dom'
import { ArrowUpRight } from 'lucide-react'
import { LazyImage } from './LazyImage'
import type { Category } from '../types/api'

interface CategoryCardProps {
  category: Pick<Category, 'slug' | 'name' | 'tagline'>
  image: string
  count?: number
  /** 'lg' for pages, 'sm' for menus. */
  size?: 'lg' | 'sm'
  to?: string
  ratio?: string
  onNavigate?: () => void
}

export function CategoryCard({ category, image, count, size = 'lg', to, ratio = 'aspect-[4/5]', onNavigate }: CategoryCardProps) {
  const href = to ?? `/collections/${category.slug}`
  const lg = size === 'lg'

  return (
    <Link to={href} onClick={onNavigate} data-cursor="view" className="group block">
      <div className={`relative overflow-hidden bg-backdrop ${ratio}`}>
        {image && <LazyImage src={image} alt="" className="img-hover absolute inset-0 h-full w-full object-cover" />}
        <span className="absolute right-3 top-3 flex h-9 w-9 translate-y-1 items-center justify-center bg-white/90 opacity-0 transition-[opacity,transform] duration-500 ease-editorial group-hover:translate-y-0 group-hover:opacity-100">
          <ArrowUpRight strokeWidth={1.25} className="h-4 w-4 text-ink" />
        </span>
      </div>
      <div className={`flex items-baseline justify-between gap-4 ${lg ? 'mt-5' : 'mt-3'}`}>
        <p className={`font-serif text-ink ${lg ? 'text-headline-md' : 'text-xl leading-tight'}`}>{category.name}</p>
        {count !== undefined && (
          <span className="shrink-0 font-label-caps text-label-caps tabular-nums text-secondary">
            {count} {count === 1 ? 'piece' : 'pieces'}
          </span>
        )}
      </div>
      {lg && category.tagline && <p className="mt-1.5 text-label-sm text-secondary">{category.tagline}</p>}
    </Link>
  )
}
