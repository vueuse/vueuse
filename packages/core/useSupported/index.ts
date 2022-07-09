import { tryOnMounted } from '@vueuse/shared'
import type { Ref } from 'vue-demi'
import { ref } from 'vue-demi'

export function useSupported(callback: () => unknown, sync = false) {
  const isSupported = ref() as Ref<boolean>

  const update = () => isSupported.value = Boolean(callback())

  update()

  tryOnMounted(update, sync)
  return isSupported
}
