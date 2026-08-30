import type { ImgHTMLAttributes } from 'react'

type Props = ImgHTMLAttributes<HTMLImageElement> & {
  eager?: boolean
}

export function LazyImage({ eager = false, alt = '', ...props }: Props) {
  return (
    <img
      {...props}
      alt={alt}
      loading={eager ? 'eager' : 'lazy'}
      decoding="async"
      fetchPriority={eager ? 'high' : 'low'}
    />
  )
}
