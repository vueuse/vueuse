import { effect, ref, unref } from 'vue-demi'
import { isClient, MaybeRef } from '@vueuse/shared'

export function useElementByPoint(x: MaybeRef<number>, y: MaybeRef<number>) {
  const element = ref<HTMLElement | null>(null)
  if (isClient)
    effect(() => element.value = document.elementFromPoint(unref(x), unref(y)) as HTMLElement | null)

  return {
    element,
  }
}
