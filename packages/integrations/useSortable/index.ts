// eslint-disable-next-line no-restricted-imports
import { onMounted, onUnmounted } from 'vue-demi'
import { resolveUnref, unrefElement } from '@vueuse/core'
import type { MaybeComputedRef } from '@vueuse/core'
import Sortable, { type Options } from 'sortablejs'

/**
 * Wrapper for sortablejs.
 * @param el
 * @param list
 * @param options
 */
export function useSortable<T>(
  el: MaybeComputedRef<HTMLElement | null | undefined>,
  list: MaybeComputedRef<T[]>,
  options?: Options,
) {
  let sortable: Sortable

  const defaultOptions: Options = {
    onEnd: (e) => {
      moveArrayElement(e.oldIndex!, e.newIndex!)
      options?.onEnd?.(e)
    },
  }

  function moveArrayElement(
    from: number,
    to: number,
  ): void {
    const array = resolveUnref(list)
    if (to >= 0 && to < array.length)
      array.splice(to, 0, array.splice(from, 1)[0])
  }

  onMounted(() => {
    sortable
      = new Sortable(unrefElement(el)!, { ...options, ...defaultOptions })
  })

  onUnmounted(() => {
    sortable?.destroy()
  })

  const destroy = () => sortable?.destroy()

  return { destroy }
}

export type UseSortableReturn = ReturnType<typeof useSortable>
