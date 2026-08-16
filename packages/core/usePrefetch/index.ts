export interface PrefetchOptions {
  type?: 'image' | 'style' | 'script' | 'font'
  as?: string
  crossOrigin?: 'anonymous' | 'use-credentials'
  media?: string
}

/**
 * Prefetch resources that might be needed for the next page.
 *
 * @see https://vueuse.org/usePrefetch
 * @param url
 * @param options
 */
export function usePrefetch(
  url: string,
  options: PrefetchOptions = {},
) {
  const head = document.head
  if (head.querySelector(`link[rel="prefetch"][href="${url}"]`)) {
    return
  }

  const link = document.createElement('link')
  link.rel = 'prefetch'
  link.href = url

  if (options.as) {
    link.setAttribute('as', options.as)
  }

  if (options.crossOrigin) {
    link.crossOrigin = options.crossOrigin
  }

  if (options.media) {
    link.media = options.media
  }

  head.appendChild(link)
}

export type usePrefetchReturn = ReturnType<typeof usePrefetch>
