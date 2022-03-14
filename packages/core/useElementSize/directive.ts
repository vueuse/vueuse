import type { FunctionDirective } from 'vue-demi'
import { watch } from 'vue-demi'
import { useElementSize } from '.'
import type { ElementSize } from '.'

type RemoveFirstFromTuple<T extends any[]> =
  T['length'] extends 0 ? undefined :
    (((...b: T) => void) extends (a: any, ...b: infer I) => void ? I : [])

type BindingValueFunction = (size: ElementSize) => void
type VElementSizeOptions = RemoveFirstFromTuple<Parameters<typeof useElementSize>>
type BindingValueArray = [BindingValueFunction, ...VElementSizeOptions]

export const vElementSizeHandler = (): FunctionDirective<
HTMLElement,
BindingValueFunction | BindingValueArray
> => {
  let isMounted = false
  return (el, binding) => {
    if (isMounted) return
    isMounted = true
    const handler = typeof binding.value === 'function' ? binding.value : binding.value?.[0]
    const options = (typeof binding.value === 'function' ? [] : binding.value.slice(1)) as RemoveFirstFromTuple<BindingValueArray>

    const { width, height } = useElementSize(el, ...options)
    watch([width, height], ([width, height]) => handler({ width, height }))
  }
}

export const vElementSize = vElementSizeHandler()
