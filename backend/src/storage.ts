import { getSupabase } from './supabase.js'

export const PRODUCT_IMAGES_BUCKET = 'product-images'

const EXT_BY_MIME: Record<string, string> = {
  'image/jpeg': 'jpg',
  'image/jpg': 'jpg',
  'image/png': 'png',
  'image/webp': 'webp',
  'image/gif': 'gif',
}

export function getPublicImageUrl(path: string): string {
  const { data } = getSupabase().storage.from(PRODUCT_IMAGES_BUCKET).getPublicUrl(path)
  return data.publicUrl
}

export function extensionForMime(mime: string): string {
  return EXT_BY_MIME[mime.toLowerCase()] ?? 'jpg'
}

export async function uploadProductImage(
  productSlug: string,
  file: Buffer,
  mimeType: string,
  filename = 'main',
): Promise<string> {
  const ext = extensionForMime(mimeType)
  const path = `${productSlug}/${filename}.${ext}`

  const { error } = await getSupabase()
    .storage.from(PRODUCT_IMAGES_BUCKET)
    .upload(path, file, {
      contentType: mimeType,
      upsert: true,
      cacheControl: '3600',
    })

  if (error) throw error
  return getPublicImageUrl(path)
}

export async function uploadProductImageFromUrl(
  productSlug: string,
  sourceUrl: string,
  filename = 'main',
): Promise<string> {
  const res = await fetch(sourceUrl)
  if (!res.ok) {
    throw new Error(`Failed to fetch image (${res.status}): ${sourceUrl}`)
  }

  const mimeType = res.headers.get('content-type')?.split(';')[0] ?? 'image/jpeg'
  const buffer = Buffer.from(await res.arrayBuffer())
  return uploadProductImage(productSlug, buffer, mimeType, filename)
}
