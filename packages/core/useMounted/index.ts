// eslint-disable-next-line no-restricted-imports
import { getCurrentInstance, onMounted, ref } from 'vue'

/**
 * Mounted state in ref.
 *
 * @see https://vueuse.org/useMounted
 */
export function useMounted() {
  const isMounted = ref(false)

  const instance = getCurrentInstance()
  if (instance) {
    onMounted(() => {
      isMounted.value = true
    }, instance)
  }

  return isMounted
}
