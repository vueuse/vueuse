import { FunctionDirective } from 'vue-demi'
import { onClickOutside, OnClickOutsideEvents } from '.'

/**
 * TODO: Test that this actually works
 */
export const VOnClickOutside: FunctionDirective<any, (evt: OnClickOutsideEvents['pointerdown']) => void> = (el, binding) => {
  onClickOutside(el, binding.value)
}
