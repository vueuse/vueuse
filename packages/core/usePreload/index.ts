export interface PreloadOptions {
  type?: 'image' | 'style' | 'script' | 'font'
  as?: string
  crossOrigin?: 'anonymous' | 'use-credentials'
  media?: string
}

/**
 * Preload resources required for the current page
 *
 * @see https://vueuse.org/usePreload
 * @param url
 * @param options
 */
export function usePreload(
  url: string,
  options: PreloadOptions = {},
) {
  const head = document.head
  if (head.querySelector(`link[rel="preload"][href="${url}"]`)) {
    return
  }

  const link = document.createElement('link')
  link.rel = 'preload'
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

export type usePreloadReturn = ReturnType<typeof usePreload>
