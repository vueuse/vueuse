import type { MaybeRefOrGetter, ShallowRef } from 'vue'
import type { ConfigurableDocument } from '../_configurable'
import { tryOnMounted } from '@vueuse/shared'
import { shallowRef, toValue, watch } from 'vue'
import { defaultDocument } from '../_configurable'

export interface UseScrollParentOptions extends ConfigurableDocument {
  /**
   * The number of parent levels to lookup
   *
   * @default 10
   */
  lookupLevel?: number
  /**
   * On error callback
   *
   * Default log error to `console.error`
   */
  onError?: (error: unknown) => void
}

export type ScrollParent = HTMLElement | SVGElement | Document | null | undefined

/**
 * Reactive nearest scrollable parent of the element
 *
 * @see https://vueuse.org/useScrollParent
 * @param element
 * @param options
 */
export function useScrollParent(
  element: MaybeRefOrGetter<ScrollParent>,
  options: UseScrollParentOptions = {},
): Readonly<ShallowRef<ScrollParent>> {
  const {
    document: root = defaultDocument,
    lookupLevel = 10,
    onError = (e) => { console.error(e) },
  } = options
  const scrollParent = shallowRef<ScrollParent>()
  const overflowScrollReg = /scroll|auto|overlay/i

  function isElement(node: Element) {
    const ELEMENT_NODE_TYPE = 1
    return (
      node.tagName !== 'HTML'
      && node.tagName !== 'BODY'
      && node.nodeType === ELEMENT_NODE_TYPE
    )
  }

  function getScrollParent(
    element: ScrollParent,
  ) {
    let node: ScrollParent = element
    let level = 0
    while (node && node !== root && isElement(node as Element) && level < lookupLevel) {
      const { overflowY } = window.getComputedStyle(node as Element)
      if (overflowScrollReg.test(overflowY)) {
        return node
      }
      node = node.parentNode as ScrollParent
      level++
    }

    return root
  }

  const update = () => {
    try {
      const _element = toValue(element)
      if (!_element)
        return
      scrollParent.value = getScrollParent(_element)
    }
    catch (e) {
      onError(e)
    }
  }

  tryOnMounted(update)
  watch(() => toValue(element), update)

  return scrollParent
}

export type UseScrollParentReturn = ReturnType<typeof useScrollParent>
