import type { Ref } from 'vue'
import type { ConfigurableDocument } from '../_configurable'
import { ref } from 'vue'
import { defaultDocument } from '../_configurable'
import { useEventListener } from '../useEventListener'

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
  }, { passive: true })

  return visibility
}
