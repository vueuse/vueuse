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

export function useMark(
  target: MaybeElementRef,
  search: MaybeComputedRef<string>,
) {
  const targetElement = computed(() => unrefElement(target))
  const searchValue = computed(() => resolveUnref(search))

  const window = defaultWindow

  const markInstance = ref()

  const update = () => {
    if (window && targetElement.value) {
      markInstance.value.unmark()

      markInstance.value.mark(searchValue.value)
    }
  }

  tryOnMounted(() => {
    markInstance.value = new Mark(targetElement.value as HTMLElement)

    update()
  })

  watchThrottled([targetElement, searchValue], update, {
    immediate: true,
    deep: true,
    throttle: 500,
  })
}
