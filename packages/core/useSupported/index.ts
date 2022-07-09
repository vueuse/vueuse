import type { Ref } from 'vue-demi'
// eslint-disable-next-line no-restricted-imports
import { onMounted, ref } from 'vue-demi'

export function useSupported(callback: () => unknown) {
  const isSupported = ref() as Ref<boolean>

  const update = () => isSupported.value = Boolean(callback())

  update()

  onMounted(update)
  return isSupported
}
