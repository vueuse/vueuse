import type { Ref } from 'vue-demi'
import { onBeforeUpdate, ref } from 'vue-demi'

export type TemplateRefsList<T> = T[] & {
  set(el: Object | null): void
}

export function useTemplateRefsList<T = Element>(): Readonly<Ref<Readonly<TemplateRefsList<T>>>> {
  const refs = ref<unknown>([]) as Ref<TemplateRefsList<T>>
  refs.value.set = (el: Object | null) => {
    if (el)
      refs.value.push(el as T)
  }
  onBeforeUpdate(() => {
    refs.value.length = 0
  })
  return refs
}
