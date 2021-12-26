import { getCurrentInstance } from 'vue-demi'

export function useForceUpdate() {
  const instance = getCurrentInstance()
  return () => instance?.proxy?.$forceUpdate()
}
