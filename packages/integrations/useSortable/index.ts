import type { ConfigurableDocument, MaybeElement } from '@vueuse/core'
import type { Options } from 'sortablejs'
import type { MaybeRef, MaybeRefOrGetter } from 'vue'
import { defaultDocument, tryOnMounted, tryOnScopeDispose, unrefElement } from '@vueuse/core'
import Sortable from 'sortablejs'
import { computed, isRef, nextTick, toValue, watch } from 'vue'

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

export interface UseSortableOptions extends Options, ConfigurableDocument {
  /**
   * Watch the element reference for changes and automatically reinitialize Sortable
   * when the element changes.
   *
   * When `false` (default), Sortable is only initialized once on mount.
   * You must manually call `start()` if the element reference changes.
   *
   * When `true`, automatically watches the element reference and reinitializes
   * Sortable whenever it changes (e.g., conditional rendering with v-if).
   *
   * @default false
   */
  watchElement?: boolean
}

export function useSortable<T>(selector: string, list: MaybeRef<T[]>,
  options?: UseSortableOptions): UseSortableReturn
export function useSortable<T>(el: MaybeRefOrGetter<MaybeElement>, list: MaybeRef<T[]>,
  options?: UseSortableOptions): UseSortableReturn

/**
 * Wrapper for sortablejs.
 * @param el
 * @param list
 * @param options
 */
export function useSortable<T>(
  el: MaybeRefOrGetter<MaybeElement> | string,
  list: MaybeRef<T[]>,
  options: UseSortableOptions = {},
): UseSortableReturn {
  let sortable: Sortable | undefined

  const { document = defaultDocument, watchElement = false, ...resetOptions } = options

  const defaultOptions: Options = {
    onUpdate: (e) => {
      moveArrayElement(list, e.oldIndex!, e.newIndex!, e)
    },
  }

  const element = computed(() => (typeof el === 'string' ? document?.querySelector(el) : unrefElement(el)))

  const cleanup = () => {
    sortable?.destroy()
    sortable = undefined
  }

  const initSortable = (target: Element) => {
    if (!target || sortable !== undefined)
      return
    sortable = new Sortable(target as HTMLElement, { ...defaultOptions, ...resetOptions })
  }

  const start = () => {
    const target = element.value
    if (target)
      initSortable(target)
  }

  const option = <K extends keyof Options>(name: K, value?: Options[K]) => {
    if (value !== undefined)
      sortable?.option(name, value)
    else
      return sortable?.option(name)
  }

  // Conditionally set up element watching
  let stopWatch: (() => void) | undefined

  if (watchElement && typeof el !== 'string') {
    // New behavior: watch element changes and auto-reinitialize
    stopWatch = watch(
      element,
      (newElement) => {
        cleanup()
        if (newElement)
          initSortable(newElement)
      },
      { immediate: true, flush: 'post' },
    )
  }
  else {
    // Default behavior: initialize once on mount
    tryOnMounted(start)
  }

  const stop = () => {
    cleanup()
  }

  tryOnScopeDispose(() => {
    stopWatch?.()
    cleanup()
  })

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
  list: MaybeRef<T[]>,
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
