import type { FunctionDirective } from 'vue-demi'
import { onClickOutside } from '.'

const handler = (): FunctionDirective<any, (evt: PointerEvent) => void> => {
  let stop = null as unknown as ReturnType<typeof onClickOutside>
  return (el, binding) => {
    if (stop) {
      stop()
      stop = onClickOutside(el, binding.value)
      return
    }
    stop = onClickOutside(el, binding.value)
  }
}

export const vOnClickOutside = handler()

// alias
export { vOnClickOutside as VOnClickOutside }
