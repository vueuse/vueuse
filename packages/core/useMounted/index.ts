// eslint-disable-next-line no-restricted-imports
import { getCurrentInstance, isVue2, onMounted, ref } from 'vue-demi'

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
    }, isVue2 ? undefined : instance)
  }

  return isMounted
}
