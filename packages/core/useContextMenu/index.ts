import type { MaybeComputedRef } from '@vueuse/shared'
import { noop, resolveUnref } from '@vueuse/shared'
import type { Ref } from 'vue-demi'
import { ref, watch, watchEffect } from 'vue-demi'
import type { Position } from '../types'
import type { MaybeComputedElementRef } from '../unrefElement'
import { unrefElement } from '../unrefElement'
import { useEventListener } from '../useEventListener'

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

export function useContextMenu(MenuElement: MaybeComputedElementRef, options: UseContextMenuOptions = {}): UseContextMenuReturn {
  const { hideOnClick = true, onVisibleChange = noop, target } = options

  const visible = ref(false)
  const position = ref<Position>({ x: 0, y: 0 })

  const accessMenuElementIfExists = (fn: (el: HTMLElement | SVGElement) => void) => {
    const el = unrefElement(MenuElement)
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
    () => unrefElement(MenuElement),
    (element) => {
      // initialize
      accessMenuElementIfExists((el) => {
        el.style.position = 'fixed'
        el.style.display = 'none'
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
  watch(visible, (visible) => {
    accessMenuElementIfExists((el) => {
      el.style.display = visible ? 'block' : 'none'
    })
  }, { immediate: true })

  // automatically update the position of the `MenuElement`
  watchEffect(() => {
    accessMenuElementIfExists((el) => {
      el.style.left = `${position.value.x}px`
      el.style.top = `${position.value.y}px`
    })
  })

  return {
    visible,
    position,

    hide,
    show,
  }
}
