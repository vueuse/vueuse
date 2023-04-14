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
}

async function loadImage(options: UseImageOptions): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image()
    const { src, srcset, sizes } = options

    img.src = src
    if (srcset)
      img.srcset = srcset
    if (sizes)
      img.sizes = sizes

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
export function useImage<Shallow extends true>(options: MaybeRefOrGetter<UseImageOptions>,
  asyncStateOptions: UseAsyncStateOptions<Shallow> = {}) {
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
