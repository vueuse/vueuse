import { watch } from 'vue-demi'
import type { FunctionDirective } from 'vue-demi'
import { useElementHover } from '.'

type BindingValueFunction = (state: boolean) => void

export const vElementHoverHandler = (): FunctionDirective<
HTMLElement,
BindingValueFunction
> => {
  let isMounted = false
  return (el, binding) => {
    if (isMounted) return
    isMounted = true
    if (typeof binding.value === 'function') {
      const isHovered = useElementHover(el)
      watch(isHovered, v => binding.value(v))
    }
  }
}

export const vElementHover = vElementHoverHandler()
