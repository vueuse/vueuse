import type { Ref } from 'vue'
import { ref as deepRef, onBeforeUpdate } from 'vue'

export type TemplateRefsList<T> = T[] & {
  set: (el: object | null) => void
}

/* @__NO_SIDE_EFFECTS__ */
export function useTemplateRefsList<T = Element>(): Readonly<Ref<Readonly<TemplateRefsList<T>>>> {
  const refs = deepRef<unknown>([]) as Ref<TemplateRefsList<T>>
  refs.value.set = (el: object | null) => {
    if (el)
      refs.value.push(el as T)
  }
  onBeforeUpdate(() => {
    refs.value.length = 0
  })
  return refs
}
