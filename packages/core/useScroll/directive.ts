import type { FunctionDirective } from 'vue-demi'
import type { UseScrollOptions, UseScrollReturn } from '.'
import { useScroll } from '.'

type BindingValueFunction = (state: UseScrollReturn) => void

type BindingValueArray = [BindingValueFunction, UseScrollOptions]

const vScrollHandler = (): FunctionDirective<
HTMLElement,
BindingValueFunction | BindingValueArray
> => {
  let mountedEle: HTMLElement | null = null
  return (el, binding) => {
    if (el === mountedEle) return
    mountedEle = el
    if (typeof binding.value === 'function') {
      const handler = binding.value
      const state = useScroll(el, {
        onScroll() {
          handler(state)
        },
        onStop() {
          handler(state)
        },
      })
    }
    else {
      const [handler, options] = binding.value
      const state = useScroll(el, {
        ...options,
        onScroll(e) {
          options.onScroll?.(e)
          handler(state)
        },
        onStop(e) {
          options.onStop?.(e)
          handler(state)
        },
      })
    }
  }
}
export const vScroll = vScrollHandler()
