import { watch } from 'vue-demi'
import type { FunctionDirective } from 'vue-demi'
import type { VisibilityScrollTargetOptions } from '.'
import { useElementVisibility } from '.'

type BindingValueFunction = (state: boolean) => void

type BindingValueArray = [BindingValueFunction, VisibilityScrollTargetOptions]

export const vElementVisibility: FunctionDirective<
HTMLElement,
BindingValueFunction | BindingValueArray
> = (el, binding) => {
  if (typeof binding.value === 'function') {
    const handler = binding.value
    const isVisibility = useElementVisibility(el)
    watch(isVisibility, v => handler(v))
  }
  else {
    const [handler, options] = binding.value
    const isVisibility = useElementVisibility(el, options)
    watch(isVisibility, v => handler(v))
  }
}
