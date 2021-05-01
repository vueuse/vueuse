import { isString, MaybeRef } from '@vueuse/shared'
import { ref, watch } from 'vue-demi'
import { ConfigurableDocument, defaultDocument } from '../_configurable'
import { useMutationObserver } from '../useMutationObserver'

export interface TitleOptions extends ConfigurableDocument {
  /**
   * Allow disable MutationObserver for react on `document.title` changes
   *
   * @default true
   */
  enableObserver?: boolean
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
  {
    document = defaultDocument,
    enableObserver = true,
  }: TitleOptions = {},
) {
  const title = ref(newTitle ?? document?.title ?? null)

  watch(
    title,
    (t, o) => {
      if (isString(t) && t !== o && document)
        document.title = t
    },
    { immediate: true },
  )

  if (enableObserver) {
    useMutationObserver(
      document?.head?.querySelector('title'),
      () => {
        if (document && document.title !== title.value)
          title.value = document.title
      },
      { childList: true },
    )
  }

  return title
}
