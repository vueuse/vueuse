import { watch } from 'vue-demi'
import type { FunctionDirective } from 'vue-demi'
import type { VisibilityScrollTargetOptions } from '.'
import { useElementVisibility } from '.'

type BindingValueFunction = (state: boolean) => void

type BindingValueArray = [BindingValueFunction, VisibilityScrollTargetOptions]

const vElementVisibilityHandler = (): FunctionDirective<
HTMLElement,
BindingValueFunction | BindingValueArray
> => {
  let mountedEle: HTMLElement | null = null
  return (el, binding) => {
    if (el === mountedEle) return
    mountedEle = el

    if (typeof binding.value === 'function') {
      const handler = binding.value
      const isVisible = useElementVisibility(el)
      watch(isVisible, v => handler(v), { immediate: true })
    }
    else {
      const [handler, options] = binding.value
      const isVisible = useElementVisibility(el, options)
      watch(isVisible, v => handler(v), { immediate: true })
    }
  }
}

export const vElementVisibility = vElementVisibilityHandler()
