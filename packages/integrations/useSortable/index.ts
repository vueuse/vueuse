import { defaultDocument, toValue, tryOnMounted, tryOnScopeDispose, unrefElement } from '@vueuse/core'
import type { ConfigurableDocument, MaybeRefOrGetter } from '@vueuse/core'
import Sortable, { type Options } from 'sortablejs'
import { nextTick } from 'vue-demi'

export interface UseSortableReturn {
  /**
   * start sortable instance
   */
  start: () => void
  /**
   * destroy sortable instance
   */
  stop: () => void
}

export type UseSortableOptions = Options & ConfigurableDocument

export function useSortable<T>(selector: string, list: MaybeRefOrGetter<T[]>,
  options?: UseSortableOptions): UseSortableReturn
export function useSortable<T>(el: MaybeRefOrGetter<HTMLElement | null | undefined>, list: MaybeRefOrGetter<T[]>,
  options?: UseSortableOptions): UseSortableReturn
/**
 * Wrapper for sortablejs.
 * @param el
 * @param list
 * @param options
 */
export function useSortable<T>(
  el: MaybeRefOrGetter<HTMLElement | null | undefined> | string,
  list: MaybeRefOrGetter<T[]>,
  options: UseSortableOptions = {},
): UseSortableReturn {
  let sortable: Sortable

  const { document = defaultDocument, ...resetOptions } = options

  const defaultOptions: Options = {
    onUpdate: (e) => {
      moveArrayElement(list, e.oldIndex!, e.newIndex!)
    },
  }

  const start = () => {
    const target = (typeof el === 'string' ? document?.querySelector(el) : unrefElement(el))
    if (!target)
      return
    sortable = new Sortable(target as HTMLElement, { ...defaultOptions, ...resetOptions })
  }

  const stop = () => sortable?.destroy()

  tryOnMounted(start)

  tryOnScopeDispose(stop)

  return { stop, start }
}

export function moveArrayElement<T>(
  list: MaybeRefOrGetter<T[]>,
  from: number,
  to: number,
): void {
  const array = toValue(list)
  if (to >= 0 && to < array.length) {
    const element = array.splice(from, 1)[0]
    nextTick(() => array.splice(to, 0, element))
  }
}
