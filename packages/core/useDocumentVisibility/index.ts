import type { Ref } from 'vue-demi'
import { ref } from 'vue-demi'
import { useEventListener } from '../useEventListener'
import type { ConfigurableDocument } from '../_configurable'
import { defaultDocument } from '../_configurable'

/**
 * Reactively track `document.visibilityState`.
 *
 * @see https://vueuse.org/useDocumentVisibility
 */
export function useDocumentVisibility(options: ConfigurableDocument = {}): Ref<DocumentVisibilityState> {
  const { document = defaultDocument } = options
  if (!document)
    return ref('visible')

  const visibility = ref(document.visibilityState)

  useEventListener(document, 'visibilitychange', () => {
    visibility.value = document.visibilityState
  })

  return visibility
}
