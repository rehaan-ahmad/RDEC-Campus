import { getStorageDownloadUrl } from '@/lib/firebase'

const EXTENSIONS = ['jpg', 'png', 'webp'] as const

const PLACEHOLDERS = {
  avatar: '/images/placeholders/placeholder-avatar.jpg',
  cover: '/images/placeholders/placeholder-cover.jpg',
  poster: '/images/placeholders/placeholder-poster.jpg',
  logo: '/images/placeholders/placeholder-logo.png',
  gallery: '/images/placeholders/placeholder-gallery.jpg',
} as const

async function resolveFirstAvailable(basePath: string, fallback: string): Promise<string> {
  for (const extension of EXTENSIONS) {
    try {
      return await getStorageDownloadUrl(`${basePath}.${extension}`)
    } catch {
      // Try the next supported extension before falling back to a local placeholder.
    }
  }

  return fallback
}

export async function resolveTeamImage(
  year: number,
  roleSlug: string,
  nameSlug: string
): Promise<string> {
  return resolveFirstAvailable(`team/${year}_${roleSlug}_${nameSlug}`, PLACEHOLDERS.avatar)
}

export async function resolveClubAsset(
  clubSlug: string,
  type: 'logo' | 'banner'
): Promise<string> {
  return resolveFirstAvailable(
    `clubs/${clubSlug}_${type}`,
    type === 'logo' ? PLACEHOLDERS.logo : PLACEHOLDERS.cover
  )
}

export async function resolveEventAsset(
  eventSlug: string,
  type: 'poster' | 'cover' | 'thumb'
): Promise<string> {
  const fallback = type === 'poster' ? PLACEHOLDERS.poster : type === 'thumb' ? PLACEHOLDERS.logo : PLACEHOLDERS.cover
  return resolveFirstAvailable(`events/${eventSlug}_${type}`, fallback)
}

export async function resolveGallery(eventSlug: string, year: number): Promise<string[]> {
  const images: string[] = []

  for (let index = 1; index <= 99; index += 1) {
    const sequence = String(index).padStart(2, '0')
    const image = await resolveFirstAvailable(
      `gallery/${eventSlug}_${year}_${sequence}`,
      PLACEHOLDERS.gallery
    )

    if (image === PLACEHOLDERS.gallery) {
      break
    }

    images.push(image)
  }

  return images.length ? images : [PLACEHOLDERS.gallery]
}

export async function resolveNewsImage(articleSlug: string): Promise<string> {
  return resolveFirstAvailable(`news/${articleSlug}_cover`, PLACEHOLDERS.cover)
}

export async function resolveBulletinImage(postId: string): Promise<string> {
  return resolveFirstAvailable(`bulletin/${postId}_image`, PLACEHOLDERS.cover)
}
