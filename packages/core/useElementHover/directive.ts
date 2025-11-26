import type { UseElementHoverOptions } from '@vueuse/core'
import type { EffectScope, ObjectDirective } from 'vue'
import { useElementHover } from '@vueuse/core'
import { effectScope, watch } from 'vue'

type BindingValueFunction = (state: boolean) => void

const vElementHoverScopes = new WeakMap<HTMLElement, EffectScope>()

export const vElementHover: ObjectDirective<
  HTMLElement,
  BindingValueFunction | [handler: BindingValueFunction, options: UseElementHoverOptions]
> = {
  mounted(el, binding) {
    const scope = vElementHoverScopes.get(el) ?? effectScope()
    vElementHoverScopes.set(el, scope)
    scope.run(() => {
      const value = binding.value
      if (typeof value === 'function') {
        const isHovered = useElementHover(el)
        watch(isHovered, v => value(v))
      }
      else {
        const [handler, options] = value
        const isHovered = useElementHover(el, options)
        watch(isHovered, v => handler(v))
      }
    })
  },
  unmounted(el) {
    vElementHoverScopes.get(el)?.stop()
    vElementHoverScopes.delete(el)
  },
}
