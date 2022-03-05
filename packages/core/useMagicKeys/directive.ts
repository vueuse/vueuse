import { watch } from 'vue-demi'
import type { FunctionDirective } from 'vue-demi'
import type { UseMagicKeysOptions } from '.'
import { useMagicKeys } from '.'

type BindingValueFunction = (key: string, state: boolean) => void

type BindingValueArray = [BindingValueFunction, UseMagicKeysOptions<false>]

export const vMagicKeys: FunctionDirective<
HTMLElement,
BindingValueFunction | BindingValueArray
> = (el, binding) => {
  const keys = binding.arg?.split(',') ?? []
  const handler = typeof binding.value === 'function' ? binding.value : binding.value?.[0]
  const options = {
    target: el,
    ...(typeof binding.value === 'function' ? {} : binding.value?.[1]),
  }

  const controls = useMagicKeys(options)
  keys.forEach((key) => {
    watch(controls[key], (v) => {
      handler(key, v)
    })
  })
}
