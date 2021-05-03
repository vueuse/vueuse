import { FunctionDirective } from 'vue-demi'
import { onClickOutside, EventType } from '.'

/**
 * TODO: Test that this actually works
 */
export const VOnClickOutside: FunctionDirective<any, (evt: EventType) => void> = (el, binding) => {
  onClickOutside(el, binding.value)
}
