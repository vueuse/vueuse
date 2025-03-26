import type { ConfigurableDocument } from '@vueuse/core'
import type { Options } from 'sortablejs'
import type { MaybeRef, MaybeRefOrGetter } from 'vue'
import { defaultDocument, tryOnMounted, tryOnScopeDispose, unrefElement } from '@vueuse/core'
import Sortable from 'sortablejs'
import { isRef, nextTick, toValue } from 'vue'

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
  option: (<K extends keyof Sortable.Options>(name: K, value: Sortable.Options[K]) => void) & (<K extends keyof Sortable.Options>(name: K) => Sortable.Options[K])
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
  let sortable: Sortable | undefined

  const { document = defaultDocument, ...resetOptions } = options

  const defaultOptions: Options = {
    onUpdate: (e) => {
      moveArrayElement(list, e.oldIndex!, e.newIndex!, e)
    },
  }

  const start = () => {
    const target = (typeof el === 'string' ? document?.querySelector(el) : unrefElement(el))
    if (!target || sortable !== undefined)
      return
    sortable = new Sortable(target as HTMLElement, { ...defaultOptions, ...resetOptions })
  }

  const stop = () => {
    sortable?.destroy()
    sortable = undefined
  }

  const option = <K extends keyof Options>(name: K, value?: Options[K]) => {
    if (value !== undefined)
      sortable?.option(name, value)
    else
      return sortable?.option(name)
  }

  tryOnMounted(start)

  tryOnScopeDispose(stop)

  return {
    stop,
    start,
    option: option as UseSortableReturn['option'],
  }
}

/**
 * Inserts a element into the DOM at a given index.
 * @param parentElement
 * @param element
 * @param {number} index
 * @see https://github.com/Alfred-Skyblue/vue-draggable-plus/blob/a3829222095e1949bf2c9a20979d7b5930e66f14/src/utils/index.ts#L81C1-L94C2
 */
export function insertNodeAt(
  parentElement: Element,
  element: Element,
  index: number,
) {
  const refElement = parentElement.children[index]
  parentElement.insertBefore(element, refElement)
}

/**
 * Removes a node from the DOM.
 * @param {Node} node
 * @see https://github.com/Alfred-Skyblue/vue-draggable-plus/blob/a3829222095e1949bf2c9a20979d7b5930e66f14/src/utils/index.ts#L96C1-L102C2
 */
export function removeNode(node: Node) {
  if (node.parentNode)
    node.parentNode.removeChild(node)
}

export function moveArrayElement<T>(
  list: MaybeRefOrGetter<T[]>,
  from: number,
  to: number,
  e: Sortable.SortableEvent | null = null,
): void {
  if (e != null) {
    removeNode(e.item)
    insertNodeAt(e.from, e.item, from)
  }

  const _valueIsRef = isRef(list)
  // When the list is a ref, make a shallow copy of it to avoid repeatedly triggering side effects when moving elements
  const array = _valueIsRef ? [...toValue(list)] : toValue(list)

  if (to >= 0 && to < array.length) {
    const element = array.splice(from, 1)[0]
    nextTick(() => {
      array.splice(to, 0, element)
      // When list is ref, assign array to list.value
      if (_valueIsRef)
        (list as MaybeRef).value = array
    })
  }
}
