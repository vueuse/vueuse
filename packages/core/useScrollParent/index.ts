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
   * If true, treat 'overflow: hidden' as scrollable; otherwise, only 'auto' and 'scroll' are allowed.
   *
   * @default false
   */
  includeHidden?: boolean
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
    includeHidden = false,
    lookupLevel = 10,
    onError = (e) => { console.error(e) },
  } = options

  const baseRegex = 'scroll|overlay|auto'
  const overflowScrollReg = includeHidden
    ? new RegExp(`${baseRegex}|hidden`, 'i')
    : new RegExp(baseRegex, 'i')

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

    const { position } = window.getComputedStyle(element)
    // The element itself is fixed positioned
    // Ignoring the transform-like styles of its parent, and falls back directly.
    if (position === 'fixed') {
      return { x: fallback, y: fallback }
    }

    // When the element itself is absolutely positioned
    // Only a non-static positioned and scrollable parent can be considered its correct scroll container.
    const excludeStaticParent = position === 'absolute'

    let node: ScrollParent = element
    let level = 0
    while (node && node !== rootScrollingElement && isElement(node as Element) && level < lookupLevel) {
      const { overflowY, overflowX, position } = window.getComputedStyle(node as Element)
      const _node = node

      node = node.parentNode as ScrollParent
      level++
      if (excludeStaticParent && position === 'static') {
        continue
      }

      const hasOverflowY = overflowScrollReg.test(overflowY)
      const hasOverflowX = overflowScrollReg.test(overflowX)

      if (hasOverflowY || hasOverflowX) {
        return {
          y: hasOverflowY ? _node : null,
          x: hasOverflowX ? _node : null,
        }
      }
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
