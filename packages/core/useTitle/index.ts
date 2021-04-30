import { isString, MaybeRef } from '@vueuse/shared'
import { ref, watch } from 'vue-demi'
import { ConfigurableDocument, defaultDocument } from '../_configurable'
import { useMutationObserver } from '../useMutationObserver'
/**
 * Reactive document title.
 *
 * @see https://vueuse.org/useTitle
 * @param newTitle
 * @param options
 */
export function useTitle(
  newTitle: MaybeRef<string | null | undefined> = null,
  { document = defaultDocument }: ConfigurableDocument = {},
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
  
  
  useMutationObserver(
    document?.head?.querySelector('title'), 
    () => title.value = document.title, 
    {childList: true},
  )

  return title
}
