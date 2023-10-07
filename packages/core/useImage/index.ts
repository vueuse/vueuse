import { watch } from 'vue-demi'
import type { MaybeRefOrGetter } from '@vueuse/shared'
import { toValue } from '@vueuse/shared'
import type { UseAsyncStateOptions } from '../useAsyncState'
import { useAsyncState } from '../useAsyncState'

export interface UseImageOptions {
  /** Address of the resource */
  src: string
  /** Images to use in different situations, e.g., high-resolution displays, small monitors, etc. */
  srcset?: string
  /** Image sizes for different page layouts */
  sizes?: string
  /** Image alternative information */
  alt?: string
  /** Image classes */
  class?: string
  /** Image loading */
  loading?: HTMLImageElement['loading']
  /** Image CORS settings */
  crossorigin?: string
  /** Referrer policy for fetch https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Referrer-Policy */
  referrerPolicy?: HTMLImageElement['referrerPolicy']
}

async function loadImage(options: UseImageOptions): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image()
    const { src, srcset, sizes, class: clazz, loading, crossorigin, referrerPolicy } = options

    img.src = src

    if (srcset)
      img.srcset = srcset

    if (sizes)
      img.sizes = sizes

    if (clazz)
      img.className = clazz

    if (loading)
      img.loading = loading

    if (crossorigin)
      img.crossOrigin = crossorigin

    if (referrerPolicy)
      img.referrerPolicy = referrerPolicy

    img.onload = () => resolve(img)
    img.onerror = reject
  })
}

/**
 * Reactive load an image in the browser, you can wait the result to display it or show a fallback.
 *
 * @see https://vueuse.org/useImage
 * @param options Image attributes, as used in the <img> tag
 * @param asyncStateOptions
 */
export function useImage<Shallow extends true>(options: MaybeRefOrGetter<UseImageOptions>, asyncStateOptions: UseAsyncStateOptions<Shallow> = {}) {
  const state = useAsyncState<HTMLImageElement | undefined>(
    () => loadImage(toValue(options)),
    undefined,
    {
      resetOnExecute: true,
      ...asyncStateOptions,
    },
  )

  watch(
    () => toValue(options),
    () => state.execute(asyncStateOptions.delay),
    { deep: true },
  )

  return state
}

export type UseImageReturn = ReturnType<typeof useImage>
