import type {
  ComponentInstance,
  MaybeRef,
} from 'vue'
import {
  getCurrentInstance,
  // eslint-disable-next-line no-restricted-imports
  onMounted,
  shallowRef,
  watch,
} from 'vue'

/**
 * Mounted state in ref.
 *
 * @see https://vueuse.org/useMounted
 */
export function useMounted(target?: MaybeRef<ComponentInstance<any> | Element>) {
  const isMounted = shallowRef(false)

  if (target) {
    watch(
      target,
      (value) => {
        isMounted.value = !!value
      },
      { immediate: true },
    )
  }
  else {
    const instance = getCurrentInstance()
    if (instance) {
      onMounted(() => {
        isMounted.value = true
      }, instance)
    }
  }

  return isMounted
}
