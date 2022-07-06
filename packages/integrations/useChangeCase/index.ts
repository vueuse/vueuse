import type { Options } from 'change-case'
import type { MaybeRef } from '@vueuse/shared'
import type { WritableComputedRef } from 'vue-demi'
import { computed, ref } from 'vue-demi'
import * as changeCase from './changeCase'

export type ChangeCaseType = keyof typeof changeCase
export function useChangeCase(input: MaybeRef<string>, type: ChangeCaseType, options?: Options | undefined): WritableComputedRef<string> {
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
