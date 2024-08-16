import { readonly, ref, watch } from 'vue-demi'
import { useMounted } from '../useMounted'

export function useSupported(callback: () => unknown) {
  const isMounted = useMounted()
  const isSupported = ref(false)

  watch(isMounted, () => {
    isSupported.value = Boolean(callback())
  }, { immediate: true })
  return readonly(isSupported)
}
