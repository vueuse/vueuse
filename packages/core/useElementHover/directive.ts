import { watch } from 'vue-demi'
import type { FunctionDirective } from 'vue-demi'
import { useElementHover } from '.'

type BindingValueFunction = (state: boolean) => void

export const vElementHoverHandler = (): FunctionDirective<
HTMLElement,
BindingValueFunction
> => {
  let mountedEle: HTMLElement | null = null
  return (el, binding) => {
    if (el === mountedEle) return
    mountedEle = el

    if (typeof binding.value === 'function') {
      const isHovered = useElementHover(el)
      watch(isHovered, v => binding.value(v))
    }
  }
}

export const vElementHover = vElementHoverHandler()
