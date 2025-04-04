import type { ObjectDirective, Reactive } from 'vue'
import type { UsePointerSwipeOptions, UsePointerSwipeReturn } from './index'
import { reactiveOmit } from '@vueuse/shared'
import { reactive, watch } from 'vue'
import { usePointerSwipe } from './index'

type PointerSwipe = Omit<UsePointerSwipeReturn, 'stop'>
type BindingValueFunction = (state: Reactive<PointerSwipe>) => void

type BindingValueArray = [BindingValueFunction, UsePointerSwipeOptions]

export const vPointerSwipe: ObjectDirective<
  HTMLElement,
BindingValueFunction | BindingValueArray
> = {
  mounted(el, binding) {
    const value = binding.value
    if (typeof value === 'function') {
      const state = reactiveOmit(reactive(usePointerSwipe(el)), 'stop')
      watch(state, v => value(v))
    }
    else {
      const [handler, options] = value
      const state = reactive(usePointerSwipe(el, options))
      watch(state, v => handler(v))
    }
  },
}
