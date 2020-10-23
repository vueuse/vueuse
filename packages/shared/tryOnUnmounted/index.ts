import { getCurrentInstance, onUnmounted } from 'vue-demi'

/**
 * Call onUnmounted() if it's inside a component lifecycle, if not, do nothing
 *
 * @param fn
 */
export function tryOnUnmounted(fn: () => void) {
  if (getCurrentInstance())
    onUnmounted(fn)
}
