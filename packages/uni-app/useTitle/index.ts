import type { MaybeRef } from '@vueuse/shared'
import { isUniH5 } from '@vueuse/shared'
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
      if (isString(t) && t !== o) {
        uni.setNavigationBarTitle({
          title: t ?? '',
        })
      }
    },
    { immediate: true },
  )

  if (isUniH5 && observe && document) {
    useMutationObserver(
      document.head?.querySelector('title'),
      () => {
        if (document && document.title !== title.value)
          title.value = document.title
      },
      { childList: true },
    )
  }

  return title
}
