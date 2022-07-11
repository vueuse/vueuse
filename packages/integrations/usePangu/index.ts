import type { MaybeRef } from '@vueuse/shared'
import type { WritableComputedRef } from 'vue-demi'
import { computed, ref } from 'vue-demi'
import * as pangu from 'pangu'

export function usePangu(input: MaybeRef<string>): WritableComputedRef<string> {
  const text = ref(input)
  return computed<string>({
    get() {
      return pangu.spacing(text.value)
    },
    set(value) {
      text.value = value
    },
  })
}
