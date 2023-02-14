// eslint-disable-next-line no-restricted-imports
import { onMounted, onUnmounted } from 'vue-demi'
import { defaultDocument, resolveUnref, unrefElement } from '@vueuse/core'
import type { ConfigurableDocument, MaybeComputedRef } from '@vueuse/core'
import Sortable, { type Options } from 'sortablejs'

export interface UseSortableReturn {
  /**
   * start sortable instance
   */
  start: () => void
  /**
   * destroy sortable instance
   */
  destroy: () => void
}

type UseSortableOptions = Options & ConfigurableDocument

export function useSortable<T>(selector: string, list: MaybeComputedRef<T[]>,
  options?: UseSortableOptions): UseSortableReturn
export function useSortable<T>(el: MaybeComputedRef<HTMLElement | null | undefined>, list: MaybeComputedRef<T[]>,
  options?: UseSortableOptions): UseSortableReturn
/**
 * Wrapper for sortablejs.
 * @param el
 * @param list
 * @param options
 */
export function useSortable<T>(
  el: MaybeComputedRef<HTMLElement | null | undefined> | string,
  list: MaybeComputedRef<T[]>,
  options: UseSortableOptions = {},
): UseSortableReturn {
  let sortable: Sortable

  const { document = defaultDocument, ...resetOptions } = options

  const defaultOptions: Options = {
    onUpdate: (e) => {
      moveArrayElement(e.oldIndex!, e.newIndex!)
      resetOptions?.onUpdate?.(e)
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

  const start = () => {
    const target = (typeof el === 'string' ? document?.querySelector(el) : unrefElement(el))
    sortable = new Sortable(target as HTMLElement, { ...resetOptions, ...defaultOptions })
  }

  onMounted(() => {
    start()
  })

  onUnmounted(() => {
    sortable?.destroy()
  })

  const destroy = () => sortable?.destroy()

  return { destroy, start }
}
