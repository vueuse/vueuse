import type { UseScrollOptions, UseScrollReturn } from '@vueuse/core'
import type { EffectScope, ObjectDirective } from 'vue'
import { useScroll } from '@vueuse/core'
import { effectScope } from 'vue'

type BindingValueFunction = (state: UseScrollReturn) => void

type BindingValueArray = [BindingValueFunction, UseScrollOptions]

const vScrollScopes = new WeakMap<HTMLElement, EffectScope>()
export const vScroll: ObjectDirective<
  HTMLElement,
BindingValueFunction | BindingValueArray
> = {
  mounted(el, binding) {
    const scope = vScrollScopes.get(el) ?? effectScope()
    vScrollScopes.set(el, scope)
    scope.run(() => {
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
    })
  },
  unmounted(el) {
    vScrollScopes.get(el)?.stop()
    vScrollScopes.delete(el)
  },
}
