import { computed } from 'vue-demi'
import {
  resolveUnref,
  tryOnMounted,
  unrefElement,
  watchDebounced,
} from '@vueuse/core'
import type {
  MaybeComputedRef,
  MaybeElementRef,
  WatchDebouncedOptions,
} from '@vueuse/core'

import Mark from 'mark.js'
import type { MarkOptions } from 'mark.js'

interface MarkType {
  unmark: (options: { done: () => void }) => void
  mark: (text: string | string[], options?: MarkOptions) => void
}

// https://markjs.io/#parameters
export interface UseMarkOptions<Immediate> extends MarkOptions, WatchDebouncedOptions<Immediate> { }

export function useMark<Immediate extends Readonly<boolean> = false>(
  target: MaybeElementRef,
  search: MaybeComputedRef<string | string[]>,
  options: MaybeComputedRef<UseMarkOptions<Immediate>> = {},
) {
  const targetElement = computed(() => unrefElement(target))
  const searchValue = computed(() => resolveUnref(search))
  const computedOptions = computed(() => resolveUnref(options))

  let markInstance: MarkType

  const update = () => {
    if (targetElement.value && markInstance) {
      markInstance.unmark({
        done: () => markInstance.mark(searchValue.value, computedOptions.value),
      })
    }
  }

  tryOnMounted(() => {
    markInstance = new Mark(targetElement.value as HTMLElement)
    update()
  })

  watchDebounced([searchValue, computedOptions], update, computedOptions.value)
}
