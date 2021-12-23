import type { MaybeRef } from '@vueuse/shared'
import { isString } from '@vueuse/shared'
import { ref, watch } from 'vue-demi'
import type { ConfigurableDocument } from '../_configurable'
import { defaultDocument } from '../_configurable'
import { useMutationObserver } from '../useMutationObserver'

export interface UseTitleOptions extends ConfigurableDocument {
  /**
   * Observe `document.title` changes using MutationObserve
   *
   * @default false
   */
  observe?: boolean
  /**
   * The template string to parse the title (e.g., '%s | My Website')
   *
   * @default '%s'
   */
  titleTemplate?: string
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
    titleTemplate = '%s',
  } = options
  const title = ref(newTitle ?? document?.title ?? null)

  watch(
    title,
    (t, o) => {
      if (isString(t) && t !== o && document)
        document.title = titleTemplate.replace('%s', t)
    },
    { immediate: true },
  )

  if (observe && document) {
    useMutationObserver(
      document.head?.querySelector('title'),
      () => {
        if (document && document.title !== title.value)
          title.value = titleTemplate.replace('%s', document.title)
      },
      { childList: true },
    )
  }

  return title
}

export type UseTitleReturn = ReturnType<typeof useTitle>
