import type { MaybeRef } from '@vueuse/shared'
import { defaultDocument, useMutationObserver, isString } from '@vueuse/core'
import { ref, watch } from 'vue-demi'

export interface UseTitleOptions {
  /**
   * 监听title变化更新ref
   *
   * @platforms h5
   * @default false
   */
  observe?: boolean
  document?: Document
}

/**
 * Reactive document title.
 *
 * @see https://vueuse.org/useTitle
 * @param newTitle
 * @param options
 */
export function useTitle(
  newTitle: MaybeRef<string | null | undefined> = null,
  options: UseTitleOptions = {},
) {
  const {
    document = defaultDocument,
    observe = false,
  } = options

  const title = ref(newTitle ?? document?.title ?? null)

  watch(
    title,
    (t, o) => {
      /* #ifdef H5 */
      if (isString(t) && t !== o && document)
        document.title = t
      /* #endif */
      /* #ifdef MP */
      uni.setNavigationBarTitle({
        title: t ?? '',
      })
      /* #endif */
    },
    { immediate: true },
  )

  /* #ifdef H5 */
  if (observe && document) {
    useMutationObserver(
      document.head?.querySelector('title'),
      () => {
        if (document && document.title !== title.value)
          title.value = document.title
      },
      { childList: true },
    )
  }
  /* #endif */

  return title
}
