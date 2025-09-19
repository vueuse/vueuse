import type { MaybeElementRef } from '../unrefElement'
import {
  computed,
  getCurrentInstance,
  // eslint-disable-next-line no-restricted-imports
  onMounted,
  readonly,
  shallowRef,
  toValue,
} from 'vue'

/**
 * Mounted state in ref.
 *
 * @see https://vueuse.org/useMounted
 *
 * @__NO_SIDE_EFFECTS__
 */
export function useMounted(target?: MaybeElementRef) {
  // If target is provided, simply return a computed that checks if target exists
  if (target !== undefined) {
    return readonly(computed(() => !!toValue(target)))
  }

  // Default behavior: track current component's mount state
  const isMounted = shallowRef(false)
  const instance = getCurrentInstance()

  if (instance) {
    onMounted(() => {
      isMounted.value = true
    })
  }

  return readonly(isMounted)
}
