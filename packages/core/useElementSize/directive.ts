import type { ObjectDirective } from 'vue-demi'
import { watch } from 'vue-demi'
import { directiveHooks } from '@vueuse/shared'
import { useElementSize } from '.'
import type { ElementSize } from '.'

type RemoveFirstFromTuple<T extends any[]> =
  T['length'] extends 0 ? undefined :
      (((...b: T) => void) extends (a: any, ...b: infer I) => void ? I : [])

type BindingValueFunction = (size: ElementSize) => void
type VElementSizeOptions = RemoveFirstFromTuple<Parameters<typeof useElementSize>>
type BindingValueArray = [BindingValueFunction, ...VElementSizeOptions]

export const vElementSize: ObjectDirective<
HTMLElement,
BindingValueFunction | BindingValueArray
> = {
  [directiveHooks.mounted](el, binding) {
    const handler = typeof binding.value === 'function' ? binding.value : binding.value?.[0]
    const options = (typeof binding.value === 'function' ? [] : binding.value.slice(1)) as RemoveFirstFromTuple<BindingValueArray>

    const { width, height } = useElementSize(el, ...options)
    watch([width, height], ([width, height]) => handler({ width, height }))
  },
}
