import type { ShallowRef } from 'vue'
import { onBeforeUpdate, shallowRef } from 'vue'

export type TemplateRefsList<T> = T[] & {
  set: (el: object | null) => void
}

export function useTemplateRefsList<T = Element>(): Readonly<ShallowRef<Readonly<TemplateRefsList<T>>>> {
  const refs = shallowRef<unknown>([]) as ShallowRef<TemplateRefsList<T>>
  refs.value.set = (el: object | null) => {
    if (el)
      refs.value.push(el as T)
  }
  onBeforeUpdate(() => {
    refs.value.length = 0
  })
  return refs
}
