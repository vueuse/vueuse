import type { OnClickOutsideHandler, OnClickOutsideOptions } from '@vueuse/core'
import type { Fn } from '@vueuse/shared'
import type { ObjectDirective } from 'vue'
import { isFunction, onClickOutside } from '@vueuse/core'

type StopHandle = Fn | { stop: Fn, cancel: Fn, trigger: (event: Event) => void }

const stopClickOutsideMap = new WeakMap<HTMLElement, StopHandle>()

export const vOnClickOutside: ObjectDirective<
  HTMLElement,
  OnClickOutsideHandler | [(evt: any) => void, Omit<OnClickOutsideOptions, 'controls'>]
> = {
  mounted(el, binding) {
    const capture = !binding.modifiers.bubble
    let stop: StopHandle
    if (isFunction(binding.value)) {
      stop = onClickOutside(el, binding.value, { capture })
    }
    else {
      const [handler, options] = binding.value
      stop = onClickOutside(el, handler, Object.assign({ capture }, options))
    }
    stopClickOutsideMap.set(el, stop)
  },
  unmounted(el) {
    const stop = stopClickOutsideMap.get(el)
    if (stop && isFunction(stop)) {
      stop()
    }
    else {
      stop?.stop()
    }
    stopClickOutsideMap.delete(el)
  },
}

/** @deprecated use `vOnClickOutside` instead */
export const VOnClickOutside = vOnClickOutside
