import { computed, ref } from 'vue-demi'

import { useEventListener } from '../useEventListener'

const possibleState = ['visible', 'hidden', 'prerender', 'unloaded'] as const

export type VisibilityState = typeof possibleState[number]

/**
 * reactive usePageVisibility
 *
 * @see https://vueuse.org/usePageVisibility
 * @see https://developer.mozilla.org/en-US/docs/Web/API/Page_Visibility_API
 * @see https://w3c.github.io/page-visibility/
 *
 */
export const usePageVisibility = () => {
  // A DOMString indicating the document's current visibility state.
  const visibilityState = ref<VisibilityState>(document.visibilityState)

  // An EventListener providing the code to be called when
  // the visibilitychange event is fired:
  useEventListener(document, 'visibilitychange', (e: Event) => {
    e.preventDefault()
    visibilityState.value = document.visibilityState
  })

  const isVisible = computed(() => {
    return visibilityState.value === 'visible'
  })

  const isHidden = computed(() => {
    return visibilityState.value === 'hidden'
  })

  return {
    isHidden,
    isVisible,
    visibilityState,
  }
}
