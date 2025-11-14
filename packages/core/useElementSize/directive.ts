import type { ElementSize } from '@vueuse/core'
import type { EffectScope, ObjectDirective } from 'vue'
import { useElementSize } from '@vueuse/core'
import { effectScope, watch } from 'vue'

type RemoveFirstFromTuple<T extends any[]>
  = T['length'] extends 0 ? undefined
    : (((...b: T) => void) extends (a: any, ...b: infer I) => void ? I : [])

type BindingValueFunction = (size: ElementSize) => void
type VElementSizeOptions = RemoveFirstFromTuple<Parameters<typeof useElementSize>>
type BindingValueArray = [BindingValueFunction, ...VElementSizeOptions]

const vElementSizeScopes = new WeakMap<HTMLElement, EffectScope>()

export const vElementSize: ObjectDirective<
  HTMLElement,
  BindingValueFunction | BindingValueArray
> = {
  mounted(el, binding) {
    const scope = vElementSizeScopes.get(el) ?? effectScope()
    vElementSizeScopes.set(el, scope)
    scope.run(() => {
      const handler = typeof binding.value === 'function' ? binding.value : binding.value?.[0]
      const options = (typeof binding.value === 'function' ? [] : binding.value.slice(1)) as RemoveFirstFromTuple<BindingValueArray>

      const { width, height } = useElementSize(el, ...options)
      watch([width, height], ([width, height]) => handler({ width, height }))
    })
  },
  unmounted(el) {
    vElementSizeScopes.get(el)?.stop()
    vElementSizeScopes.delete(el)
  },
}
