import type { FunctionDirective } from 'vue-demi'
import { onClickOutside } from '.'

/**
 * TODO: Test that this actually works
 */
export const VOnClickOutside: FunctionDirective<any, (evt: PointerEvent) => void> = (el, binding) => {
  onClickOutside(el, binding.value)
}
