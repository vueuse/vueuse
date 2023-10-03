// eslint-disable-next-line no-restricted-imports
import { getCurrentInstance, onMounted, ref } from 'vue-demi'

/**
 * Mounted state in ref.
 *
 * @see https://vueuse.org/useMounted
 */
export function useMounted() {
  const isMounted = ref(false)

  if (getCurrentInstance()) {
    onMounted(() => {
      isMounted.value = true
    })
  }

  return isMounted
}
