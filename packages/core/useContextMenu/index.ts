import type { MaybeComputedRef } from '@vueuse/shared'
import { noop, resolveUnref } from '@vueuse/shared'
import type { Ref } from 'vue-demi'
import { computed, ref, watch, watchEffect } from 'vue-demi'
import type { Position } from '../types'
import type { MaybeComputedElementRef } from '../unrefElement'
import { unrefElement } from '../unrefElement'
import { useEventListener } from '../useEventListener'
import { useElementSize } from '../useElementSize'
import { useWindowSize } from '../useWindowSize'

export interface UseContextMenuOptions {
  /**
   * Whether to prevent the context menu from hiding when clicking on it.
   *
   * @default true
   */
  hideOnClick?: MaybeComputedRef<boolean>

  /**
   * Enable the context menu only when the mouse is clicking this element,
   * enabled to the entire page if not specified.
   *
   * @default document
   */
  target?: MaybeComputedElementRef

  /**
   * Fires when the visibility of the context menu changes.
   * @param visible
   */
  onVisibleChange?: (visible: boolean) => void
}

export interface UseContextMenuReturn {
  /**
   * Whether the context menu is visible.
   */
  visible: Ref<boolean>

  /**
   * The absolute position of the context menu to the viewport.
   */
  position: Ref<Position>

  /**
   * Hide the context menu.
   */
  hide: () => void

  /**
   * Show the context menu.
   *
   * @param [position] absolute position to the viewport, default to the previous position.
   */
  show: (position?: Position) => void
}

/**
 *
 * Customize `contextMenu`.
 *
 * @see https://vueuse.org/useContextMenu
 * @param menuElement
 * @param options
 * @returns
 */
export function useContextMenu(
  menuElement: MaybeComputedElementRef,
  options: UseContextMenuOptions = {},
): UseContextMenuReturn {
  const {
    hideOnClick = true,
    onVisibleChange = noop,
    target,
  } = options

  const menuElementSize = useElementSize(menuElement, { width: 0, height: 0 }, { box: 'border-box' })
  const windowSize = useWindowSize({
    includeScrollbar: false,
  })

  const visible = ref(false)
  const position = ref<Position>({ x: 0, y: 0 })
  // see: https://github.com/vueuse/vueuse/pull/2136#issuecomment-1230525648
  const menuPositionOffset = computed(() => {
    let left = position.value.x
    let top = position.value.y

    const overflowX = position.value.x + menuElementSize.width.value > windowSize.width.value
    const overflowY = position.value.y + menuElementSize.height.value > windowSize.height.value

    if (overflowX)
      left = position.value.x - menuElementSize.width.value
    if (overflowY)
      top = position.value.y - menuElementSize.height.value

    return {
      left,
      top,
    }
  })

  const accessMenuElementIfExists = (fn: (el: HTMLElement | SVGElement) => void) => {
    const el = unrefElement(menuElement)
    if (el)
      fn(el)
  }

  const show = () => visible.value = true
  const hide = () => visible.value = false

  useEventListener('scroll', hide)
  useEventListener('click', hide)
  useEventListener('contextmenu', hide, { capture: true })

  const contextMenuHandler = (e: MouseEvent) => {
    e.preventDefault()
    position.value = {
      x: e.clientX,
      y: e.clientY,
    }
    show()
    // prevent other(parent) context menu from showing
    e.stopPropagation()
  }

  if (target) {
    // register on the target element
    watch(
      () => unrefElement(target),
      el => useEventListener(el, 'contextmenu', contextMenuHandler))
  }
  else {
    // or register on the entire page
    useEventListener('contextmenu', contextMenuHandler)
  }

  watch(visible, onVisibleChange)
  watch(
    () => unrefElement(menuElement),
    (element) => {
      // initialize
      accessMenuElementIfExists((el) => {
        el.style.position = 'fixed'
        el.style.visibility = 'hidden'
      })

      useEventListener(element, 'click', (e) => {
        if (!resolveUnref(hideOnClick)) {
          // hide it only when clicking outside of the menu,
          // so stopPropagation when clicking on itself.
          e.stopPropagation()
        }
      })
    })

  // automatically show/hide the `MenuElement`
  watchEffect(() => {
    accessMenuElementIfExists((el) => {
      el.style.visibility = visible.value ? 'initial' : 'hidden'
    })
  })

  // automatically update the position of the `MenuElement`
  watchEffect(() => {
    accessMenuElementIfExists((el) => {
      el.style.left = `${menuPositionOffset.value.left}px`
      el.style.top = `${menuPositionOffset.value.top}px`
    })
  })

  return {
    visible,
    position,

    hide,
    show,
  }
}
