import type { OnClickOutsideHandler, OnClickOutsideOptions } from '@vueuse/core'
import type { Fn } from '@vueuse/shared'
import type { ObjectDirective, VaporDirective } from 'vue'
import { onClickOutside } from '@vueuse/core'

type StopHandle = Fn | { stop: Fn, cancel: Fn, trigger: (event: Event) => void }
type BindingValue = OnClickOutsideHandler | [(evt: any) => void, Omit<OnClickOutsideOptions, 'controls'>]

function setupOnClickOutside(el: HTMLElement, bindingValue: BindingValue, bubble = false): StopHandle {
  const capture = !bubble
  if (typeof bindingValue === 'function')
    return onClickOutside(el, bindingValue, { capture })

  const [handler, options] = bindingValue
  return onClickOutside(el, handler, Object.assign({ capture }, options))
}

const stopClickOutsideMap = new WeakMap<HTMLElement, StopHandle>()

export const vOnClickOutside: ObjectDirective<
  HTMLElement,
  BindingValue
> = {
  mounted(el, binding) {
    stopClickOutsideMap.set(el, setupOnClickOutside(el, binding.value, binding.modifiers.bubble))
  },
  unmounted(el) {
    const stop = stopClickOutsideMap.get(el)
    if (stop && typeof stop === 'function') {
      stop()
    }
    else {
      stop?.stop()
    }
    stopClickOutsideMap.delete(el)
  },
}

export const vOnClickOutsideVapor: VaporDirective = (el, value, _, modifiers) => {
  if (!(el instanceof HTMLElement))
    return

  setupOnClickOutside(el, value?.() as BindingValue, modifiers?.bubble)
}

/** @deprecated use `vOnClickOutside` instead */
export const VOnClickOutside = vOnClickOutside
