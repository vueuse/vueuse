import { getCurrentInstance } from 'vue-demi'

/**
 * $forceUpdate in setup
 *
 * @see https://vueuse.org/core/useForceUpdate
 */
export function useForceUpdate() {
  const instance = getCurrentInstance()
  return () => instance?.proxy?.$forceUpdate()
}
