import { onBeforeUpdate, Ref, ref } from 'vue-demi'

export function useTemplateRefsList<T = Element>(): [
  Readonly<Ref<Readonly<T[]>>>,
  (el: Object | null) => void
] {
  const list = ref<T[]>([]) as Ref<T[]>
  const setItem = (el: Object | null) => {
    if (el) list.value.push(el as T)
  }
  onBeforeUpdate(() => {
    list.value = []
  })
  return [list, setItem]
}
