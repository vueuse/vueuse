import type { FunctionDirective } from 'vue-demi'
import type { KeyStrokeOptions } from '.'
import { onKeyStroke } from '.'

type BindingValueFunction = (event: KeyboardEvent) => void

type BindingValueArray = [BindingValueFunction, KeyStrokeOptions]

export const vOnKeyStroke: FunctionDirective<
HTMLElement,
BindingValueFunction | BindingValueArray
> = (el, binding) => {
  const keys = binding.arg?.split(',') ?? []
  if (typeof binding.value === 'function') {
    onKeyStroke(keys, binding.value, {
      target: el,
    })
  }
  else {
    const [handler, options] = binding.value
    onKeyStroke(keys, handler, {
      target: el,
      ...options,
    })
  }
}
