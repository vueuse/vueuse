import { watch } from 'vue-demi'
import type { FunctionDirective } from 'vue-demi'
import { useElementHover } from '.'

type BindingValueFunction = (state: boolean) => void

export const vElementHoverHandler = (): FunctionDirective<
HTMLElement,
BindingValueFunction
> => {
  let isMounted = false
  let ele = null as unknown as HTMLElement
  return (el, binding) => {
    if (el !== ele) isMounted = false
    if (isMounted) return
    isMounted = true
    ele = el

    if (typeof binding.value === 'function') {
      const isHovered = useElementHover(el)
      watch(isHovered, v => binding.value(v))
    }
  }
}

export const vElementHover = vElementHoverHandler()
