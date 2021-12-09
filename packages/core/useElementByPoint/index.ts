import { ref, unref } from 'vue-demi'
import { MaybeRef } from '@vueuse/shared'
import { useRafFn } from '@vueuse/core'

export function useElementByPoint(x: MaybeRef<number>, y: MaybeRef<number>) {
  const element = ref<HTMLElement | null>(null)

  const controls = useRafFn(() => {
    element.value = document.elementFromPoint(unref(x), unref(y)) as HTMLElement | null
  })

  return {
    element,
    ...controls,
  }
}
