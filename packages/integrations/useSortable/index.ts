import { defaultDocument, toValue, tryOnMounted, tryOnScopeDispose, unrefElement } from '@vueuse/core'
import type { ConfigurableDocument, MaybeRefOrGetter } from '@vueuse/core'
import Sortable, { type Options } from 'sortablejs'
import { isRef, nextTick } from 'vue-demi'

export interface UseSortableReturn {
  /**
   * start sortable instance
   */
  start: () => void
  /**
   * destroy sortable instance
   */
  stop: () => void

  /**
   * Options getter/setter
   * @param name a Sortable.Options property.
   * @param value a value.
   */
  option<K extends keyof Sortable.Options>(name: K, value: Sortable.Options[K]): void
  option<K extends keyof Sortable.Options>(name: K): Sortable.Options[K]
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

  const option = <K extends keyof Options>(name: K, value?: Options[K]) => {
    if (value !== undefined)
      sortable?.option(name, value)
    else
      return sortable?.option(name)
  }

  tryOnMounted(start)

  tryOnScopeDispose(stop)

  return { stop, start, option }
}

export function moveArrayElement<T>(
  list: MaybeRefOrGetter<T[]>,
  from: number,
  to: number,
): void {
  const _valueIsRef = isRef(list)
  // When the list is a ref, make a shallow copy of it to avoid repeatedly triggering side effects when moving elements
  const array = _valueIsRef ? [...toValue(list)] : toValue(list)

  if (to >= 0 && to < array.length) {
    const element = array.splice(from, 1)[0]
    nextTick(() => {
      array.splice(to, 0, element)
      // When list is ref, assign array to list.value
      if (_valueIsRef)
        list.value = array
    })
  }
}
