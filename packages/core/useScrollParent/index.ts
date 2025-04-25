import type { ComputedRef, MaybeRefOrGetter } from 'vue'
import type { ConfigurableDocument } from '../_configurable'
import { computed, toValue } from 'vue'
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

export type ScrollParent = Element | null | undefined
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
): ComputedRef<Record<'x' | 'y', ScrollParent>> {
  const {
    document: root = defaultDocument,
    lookupLevel = 10,
    onError = (e) => { console.error(e) },
  } = options
  const overflowScrollReg = /scroll|auto|overlay/i

  function isElement(node: unknown): node is Element {
    return node instanceof Element
      && node.nodeType === 1 /* ELEMENT_NODE_TYPE */
      && node.tagName !== 'HTML'
      && node.tagName !== 'BODY'
  }

  function getScrollParent(
    element: ScrollParent,
  ) {
    if (!isElement(element))
      throw new Error(`[useScrollParent] Invalid element: expected a DOM Element but got ${typeof element}`)

    const rootScrollingElement = root?.scrollingElement || root?.documentElement
    const fallback = rootScrollingElement ?? null

    let node: ScrollParent = element
    let level = 0
    while (node && node !== rootScrollingElement && isElement(node as Element) && level < lookupLevel) {
      const { overflowY, overflowX } = window.getComputedStyle(node as Element)
      const hasOverflowY = overflowScrollReg.test(overflowY)
      const hasOverflowX = overflowScrollReg.test(overflowX)

      if (hasOverflowY || hasOverflowX) {
        return {
          y: hasOverflowY ? node : null,
          x: hasOverflowX ? node : null,
        }
      }

      node = node.parentNode as ScrollParent
      level++
    }

    return { x: fallback, y: fallback }
  }

  return computed(() => {
    try {
      const _element = toValue(element)
      if (_element) {
        return getScrollParent(_element)
      }
    }
    catch (e) {
      onError(e)
    }
    return { x: null, y: null }
  })
}

export type UseScrollParentReturn = ReturnType<typeof useScrollParent>
