import type { ShallowRef } from 'vue'
import type { ConfigurableDocument } from '../_configurable'
import { shallowRef } from 'vue'
import { defaultDocument } from '../_configurable'
import { useEventListener } from '../useEventListener'

/**
 * Reactively track `document.visibilityState`.
 *
 * @see https://vueuse.org/useDocumentVisibility
 */
export function useDocumentVisibility(options: ConfigurableDocument = {}): ShallowRef<DocumentVisibilityState> {
  const { document = defaultDocument } = options
  if (!document)
    return shallowRef('visible')

  const visibility = shallowRef(document.visibilityState)

  useEventListener(document, 'visibilitychange', () => {
    visibility.value = document.visibilityState
  }, { passive: true })

  return visibility
}
