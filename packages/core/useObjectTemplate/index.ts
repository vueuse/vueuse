import type { MaybeRef } from '@vueuse/shared'
import { ref, unref } from 'vue-demi'

export function useObjectTemplate<T = Record<any, any>>(originTemplate: MaybeRef<T>) {
  const template = ref<T>({} as T)

  function reset() {
    template.value = JSON.parse(JSON.stringify(unref(originTemplate)))
  }

  reset()

  return { template, reset }
}
