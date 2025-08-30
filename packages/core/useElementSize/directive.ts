import type { ElementSize } from '@vueuse/core'
import type { ObjectDirective } from 'vue'
import { useElementSize } from '@vueuse/core'
import { watch } from 'vue'

type RemoveFirstFromTuple<T extends any[]>
  = T['length'] extends 0 ? undefined
    : (((...b: T) => void) extends (a: any, ...b: infer I) => void ? I : [])

type BindingValueFunction = (size: ElementSize) => void
type VElementSizeOptions = RemoveFirstFromTuple<Parameters<typeof useElementSize>>
type BindingValueArray = [BindingValueFunction, ...VElementSizeOptions]

export const vElementSize: ObjectDirective<
  HTMLElement,
  BindingValueFunction | BindingValueArray
> = {
  mounted(el, binding) {
    const handler = typeof binding.value === 'function' ? binding.value : binding.value?.[0]
    const options = (typeof binding.value === 'function' ? [] : binding.value.slice(1)) as RemoveFirstFromTuple<BindingValueArray>

    const { width, height } = useElementSize(el, ...options)
    watch([width, height], ([width, height]) => handler({ width, height }))
  },
}
