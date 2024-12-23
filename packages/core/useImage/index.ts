import type { MaybeRefOrGetter } from '@vueuse/shared'
import type { UseAsyncStateOptions } from '../useAsyncState'
import { toValue } from '@vueuse/shared'
import { watch } from 'vue'
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
  /** Image width */
  width?: HTMLImageElement['width']
  /** Image height */
  height?: HTMLImageElement['height']
  /** https://developer.mozilla.org/en-US/docs/Web/HTML/Element/img#decoding */
  decoding?: HTMLImageElement['decoding']
  /** Provides a hint of the relative priority to use when fetching the image */
  fetchPriority?: HTMLImageElement['fetchPriority']
  /** Provides a hint of the importance of the image */
  ismap?: HTMLImageElement['isMap']
  /** The partial URL (starting with #) of an image map associated with the element */
  usemap?: HTMLImageElement['useMap']

}

async function loadImage(options: UseImageOptions): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image()
    const { src, srcset, sizes, class: clazz, loading, crossorigin, referrerPolicy, width, height, decoding, fetchPriority, ismap, usemap } = options

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

    if (typeof width !== 'undefined') {
      img.width = width
    }

    if (typeof height !== 'undefined') {
      img.height = height
    }

    if (decoding)
      img.decoding = decoding

    if (fetchPriority)
      img.fetchPriority = fetchPriority

    if (typeof ismap !== 'undefined') {
      img.isMap = ismap
    }

    if (usemap)
      img.useMap = usemap

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
