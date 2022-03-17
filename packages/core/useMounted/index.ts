// eslint-disable-next-line no-restricted-imports
import { onMounted, ref } from 'vue-demi'

/**
 * Mounted state in ref.
 *
 * @see https://vueuse.org/useMounted
 * @param options
 */
export function useMounted() {
  const isMounted = ref(false)

  onMounted(() => {
    isMounted.value = true
  })

  return isMounted
}
