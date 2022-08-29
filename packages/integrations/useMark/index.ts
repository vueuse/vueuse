import { computed, ref } from 'vue-demi'
import {
  resolveUnref,
  tryOnMounted,
  unrefElement,
  watchDebounced,
} from '@vueuse/core'
import Mark from 'mark.js'

import type {
  MaybeComputedRef,
  MaybeElementRef,
  WatchDebouncedOptions,
} from '@vueuse/core'
import type { Ref } from 'vue-demi'
import type { MarkOptions } from 'mark.js'

interface MarkType {
  unmark: (options?: { done?: () => void }) => void
  mark: (text: string | string[], options?: MarkOptions) => void
}

// https://markjs.io/#parameters
export interface UseMarkOptions<Immediate> extends MarkOptions, WatchDebouncedOptions<Immediate> {
  manual?: boolean | undefined
}

export interface UseMarkReturn {
  mark: () => void
  unmark: () => void
  totalMarks: Ref<number>
}

export function useMark<Immediate extends Readonly<boolean> = false>(
  target: MaybeElementRef,
  search: MaybeComputedRef<string | string[]>,
  options: MaybeComputedRef<UseMarkOptions<Immediate>> = {},
): UseMarkReturn {
  const targetElement = computed(() => unrefElement(target))
  const searchValue = computed(() => resolveUnref(search))
  const computedOptions = computed(() => resolveUnref(options))

  const totalMarks = ref(0)

  let markInstance: MarkType

  const mark = () => {
    if (targetElement.value && markInstance) {
      markInstance.unmark({
        done: () => markInstance.mark(searchValue.value, {
          ...computedOptions.value,
          done: (marks) => {
            totalMarks.value = marks
          },
        }),
      })
    }
  }

  const unmark = () => {
    if (targetElement.value && markInstance)
      markInstance.unmark()
  }

  tryOnMounted(() => {
    markInstance = new Mark(targetElement.value as HTMLElement)
    !computedOptions.value.manual && mark()
  })

  watchDebounced(
    [searchValue, computedOptions],
    () => !computedOptions.value.manual && mark(),
    computedOptions.value,
  )

  return {
    mark,
    unmark,
    totalMarks,
  }
}
