import type { ShallowRef } from 'vue'
import type { ConfigurableDocument } from '../_configurable'
import { shallowRef } from 'vue'
import { defaultDocument } from '../_configurable'
import { useEventListener } from '../useEventListener'

export interface UseDocumentVisibilityOptions extends ConfigurableDocument {
}

export type UseDocumentVisibilityReturn = ShallowRef<DocumentVisibilityState>

/**
 * Reactively track `document.visibilityState`.
 *
 * @see https://vueuse.org/useDocumentVisibility
 *
 * @__NO_SIDE_EFFECTS__
 */
export function useDocumentVisibility(options: ConfigurableDocument = {}): UseDocumentVisibilityReturn {
  const { document = defaultDocument } = options
  if (!document)
    return shallowRef<DocumentVisibilityState>('visible')

  const visibility = shallowRef(document.visibilityState)

  useEventListener(document, 'visibilitychange', () => {
    visibility.value = document.visibilityState
  }, { passive: true })

  return visibility
}
