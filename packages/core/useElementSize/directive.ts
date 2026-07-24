import type { ElementSize } from '@vueuse/core'
import type { VaporDirective } from 'vue'
import { useElementSize } from '@vueuse/core'
import { createDisposableDirective } from '@vueuse/shared'
import { watch } from 'vue'

type RemoveFirstFromTuple<T extends any[]>
  = T['length'] extends 0 ? undefined
    : (((...b: T) => void) extends (a: any, ...b: infer I) => void ? I : [])

type BindingValueFunction = (size: ElementSize) => void
type VElementSizeOptions = RemoveFirstFromTuple<Parameters<typeof useElementSize>>
type BindingValueArray = [BindingValueFunction, ...VElementSizeOptions]
type BindingValue = BindingValueFunction | BindingValueArray

function setupElementSize(el: HTMLElement, bindingValue: BindingValue) {
  const handler = typeof bindingValue === 'function' ? bindingValue : bindingValue[0]
  const options = (typeof bindingValue === 'function' ? [] : bindingValue.slice(1)) as RemoveFirstFromTuple<BindingValueArray>
  const { width, height } = useElementSize(el, ...options)
  watch([width, height], ([width, height]) => handler({ width, height }))
}

export const vElementSize = createDisposableDirective<
  HTMLElement,
  BindingValue
> (
  {
    mounted(el, binding) {
      setupElementSize(el, binding.value)
    },
  },
)

export const vElementSizeVapor: VaporDirective = (el, value) => {
  if (!(el instanceof HTMLElement))
    return

  setupElementSize(el, value?.() as BindingValue)
}
