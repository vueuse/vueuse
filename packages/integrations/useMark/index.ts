import { computed } from 'vue-demi'
import {
  resolveUnref,
  tryOnMounted,
  unrefElement,
  watchThrottled,
} from '@vueuse/core'
import type { MaybeComputedRef, MaybeElementRef } from '@vueuse/core'

import Mark from 'mark.js'
import type { MarkOptions } from 'mark.js'

// I couldn't find the actual type so I mocked my own.
// Still wondering if there was a better way to do this
interface MarkType {
  unmark: (options: { done: () => void }) => void
  mark: (text: string | string[], options?: MarkOptions) => void
}

// https://markjs.io/#parameters
export interface UseMarkOptions extends MarkOptions {
  throttle?: number
}

export function useMark(
  target: MaybeElementRef,
  search: MaybeComputedRef<string | string[]>,
  options: UseMarkOptions = {
    acrossElements: true,
    separateWordSearch: false,
  },
) {
  const targetElement = computed(() => unrefElement(target))
  const searchValue = computed(() => resolveUnref(search))

  let markInstance: MarkType

  const update = () => {
    if (targetElement.value && markInstance) {
      markInstance.unmark({
        done: () => markInstance.mark(searchValue.value, options),
      })
    }
  }

  tryOnMounted(() => {
    markInstance = new Mark(targetElement.value as HTMLElement)
    update()
  })

  watchThrottled(searchValue, update, {
    throttle: options.throttle,
  })
}
