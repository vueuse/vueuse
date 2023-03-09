import type { MaybeComputedRef } from '@vueuse/shared'
import { resolveUnref, tryOnMounted } from '@vueuse/shared'
import { getCurrentInstance, ref } from 'vue-demi'
import { unrefElement } from '../unrefElement'

export const useParentElement = (element?: MaybeComputedRef<HTMLElement | SVGElement | null | undefined>) => {
  const parentElement = ref()

  tryOnMounted(() => {
    const el = unrefElement(resolveUnref(element) || getCurrentInstance()?.proxy)
    if (el)
      parentElement.value = el.parentElement
  })

  return {
    parentElement,
  }
}
