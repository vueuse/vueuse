import type { FunctionDirective } from 'vue-demi'
import { onClickOutside } from '.'

export const vOnClickOutside: FunctionDirective<any, (evt: PointerEvent) => void> = (el, binding) => {
  const stop = onClickOutside(el, (...args) => {
    binding.value(...args)
    stop && stop()
  }, { capture: !binding.modifiers.bubble })
}

// alias
export { vOnClickOutside as VOnClickOutside }
