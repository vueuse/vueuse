import type { ElementSize, UseElementSizeOptions } from '@vueuse/core'
import { useElementSize } from '@vueuse/core'
import { createDisposableDirective } from '@vueuse/shared'
import { watch } from 'vue'

type BindingValueFunction = (size: ElementSize) => void
type BindingValueArray
  = | [BindingValueFunction, UseElementSizeOptions?]
  /** @deprecated Use `[handler, { initials: { width, height } }]` instead. Will be removed in v17. */
    | [BindingValueFunction, ElementSize | undefined, UseElementSizeOptions?]

export const vElementSize = createDisposableDirective<
  HTMLElement,
  BindingValueFunction | BindingValueArray
> (
  {
    mounted(el, binding) {
      const handler = typeof binding.value === 'function' ? binding.value : binding.value?.[0]
      const args = (typeof binding.value === 'function' ? [] : binding.value.slice(1)) as Parameters<typeof useElementSize> extends [any, ...infer A] ? A : never

      const { width, height } = useElementSize(el, ...args)
      watch([width, height], ([width, height]) => handler({ width, height }), { immediate: true })
    },
  },
)
