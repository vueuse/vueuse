import { onBeforeUpdate, reactive } from 'vue-demi'

export function useVForRefs() {
  const refs = reactive<Element[]>([])

  const setRef = (el: Element) => {
    if (el)
      refs.push(el)
  }

  onBeforeUpdate(() => {
    refs.length = 0
  })

  return {
    refs,
    setRef,
  }
}
