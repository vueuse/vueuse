import { Ref, ref } from 'vue-demi'
import { useEventListener } from '../useEventListener'
import { ConfigurableDocument, defaultDocument } from '../_configurable'

/**
 * Reactively track `document.visibilityState`.
 *
 * @see   {@link https://vueuse.js.org/useDocumentVisibility}
 * @param options
 */
export function useDocumentVisibility({ document = defaultDocument }: ConfigurableDocument = {}): Ref<VisibilityState> {
  if (!document)
    return ref('visible')

  const visibility = ref(document.visibilityState)

  useEventListener(document, 'visibilitychange', () => {
    visibility.value = document.visibilityState
  })

  return visibility
}
