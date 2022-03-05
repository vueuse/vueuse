import { watch } from 'vue-demi'
import type { FunctionDirective } from 'vue-demi'
import { useElementHover } from '.'

type BindingValueFunction = (state: boolean) => void

export const vElementHover: FunctionDirective<
HTMLElement,
BindingValueFunction
> = (el, binding) => {
  if (typeof binding.value === 'function') {
    const isHovered = useElementHover(el)
    watch(isHovered, v => binding.value(v))
  }
}
