import type { ConfigurableDocument } from '../_configurable'
import { shallowRef } from 'vue'
import { defaultDocument } from '../_configurable'
import { useEventListener } from '../useEventListener'

/**
 * Reactively track `document.visibilityState`.
 *
 * @see https://vueuse.org/useDocumentVisibility
 *
 * @__NO_SIDE_EFFECTS__
 */
export function useDocumentVisibility(options: ConfigurableDocument = {}) {
  const { document = defaultDocument } = options
  if (!document)
    return shallowRef('visible')

  const visibility = shallowRef(document.visibilityState)

  useEventListener(document, 'visibilitychange', () => {
    visibility.value = document.visibilityState
  }, { passive: true })

  return visibility
}

export type UseDocumentVisibilityReturn = ReturnType<typeof useDocumentVisibility>
