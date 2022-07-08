import type { Options } from 'change-case'
import type { MaybeComputedRef, MaybeRef } from '@vueuse/shared'
import { isFunction, resolveUnref } from '@vueuse/shared'
import type { ComputedRef, WritableComputedRef } from 'vue-demi'
import { computed, ref } from 'vue-demi'
import * as changeCase from './changeCase'

export type ChangeCaseType = keyof typeof changeCase

export function useChangeCase(input: MaybeRef<string>, type: ChangeCaseType, options?: Options | undefined): WritableComputedRef<string>
export function useChangeCase(input: MaybeComputedRef<string>, type: ChangeCaseType, options?: Options | undefined): ComputedRef<string>

/**
 * Reactive wrapper for `change-case`
 *
 * @see https://vueuse.org/useChangeCase
 */
export function useChangeCase(input: MaybeComputedRef<string>, type: ChangeCaseType, options?: Options | undefined) {
  if (isFunction(input))
    return computed(() => changeCase[type](resolveUnref(input), options))

  const text = ref(input)
  return computed<string>({
    get() {
      return changeCase[type](text.value, options)
    },
    set(value) {
      text.value = value
    },
  })
}
