import { computed, ref } from 'vue-demi'
import {
  defaultWindow,
  resolveUnref,
  tryOnMounted,
  unrefElement,
  watchThrottled,
} from '@vueuse/core'
import type { MaybeComputedRef, MaybeElementRef } from '@vueuse/core'

import Mark from 'mark.js'
import type { MarkOptions } from 'mark.js'

// initializing an instance of mark to extract the type
// because it isn't exported in the typescript definition
const blankMark = new Mark('')
type MarkType = typeof blankMark

export interface UseMarkOptions {
  markOptions?: MarkOptions
  throttle?: number
}

export function useMark(
  target: MaybeElementRef,
  search: MaybeComputedRef<string>,
  options: MaybeComputedRef<UseMarkOptions> = {},
) {
  const targetElement = computed(() => unrefElement(target))
  const searchValue = computed(() => resolveUnref(search))

  const window = defaultWindow

  const markInstance = ref<MarkType>()

  const update = () => {
    if (window && targetElement.value && markInstance.value) {
      markInstance.value.unmark()
      markInstance.value.mark(searchValue.value, resolveUnref(options).markOptions)
    }
  }

  tryOnMounted(() => {
    markInstance.value = new Mark(targetElement.value as HTMLElement)

    update()
  })

  watchThrottled([targetElement, searchValue, () => resolveUnref(options)], update, {
    immediate: true,
    deep: true,
    throttle: resolveUnref(options).throttle,
  })
}
