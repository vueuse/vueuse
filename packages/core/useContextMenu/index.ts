import type { MaybeComputedRef } from '@vueuse/shared'
import { noop, resolveUnref } from '@vueuse/shared'
import type { Ref } from 'vue-demi'
import { ref, watch, watchEffect } from 'vue-demi'
import type { Position } from '../types'
import type { MaybeComputedElementRef, MaybeElementRef } from '../unrefElement'
import { unrefElement } from '../unrefElement'
import { useEventListener } from '../useEventListener'
import { useMouseInElement } from '../useMouseInElement'

interface UseContextMenuOptions {
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
  target?: MaybeElementRef

  /**
   * Fires when the visibility of the context menu changes.
   * @param visible
   */
  onVisibleChange?: (visible: boolean) => void
}

interface UseContextMenuReturn {
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
  const { hideOnClick = false, onVisibleChange = noop, target } = options

  const visible = ref(false)
  const position = ref<Position>({ x: 0, y: 0 })
  const { isOutside } = useMouseInElement(target)
  const accessMenuElementIfExists = (fn: (el: HTMLElement | SVGElement) => void) => {
    const el = unrefElement(MenuElement)
    if (el)
      fn(el)
  }

  const show = () => {
    accessMenuElementIfExists((el) => {
      el.style.display = 'block'
      el.style.position = 'fixed'
      visible.value = true
    })
  }

  const hide = () => {
    accessMenuElementIfExists((el) => {
      el.style.display = 'none'
      visible.value = false
    })
  }

  useEventListener('scroll', hide)
  useEventListener('click', hide)

  useEventListener('contextmenu', (e) => {
    if (!isOutside.value) {
      e.preventDefault()

      position.value = {
        x: e.clientX,
        y: e.clientY,
      }
      show()
    }
  })

  watch(visible, onVisibleChange)
  watch(
    () => unrefElement(MenuElement),
    (element) => {
      // initialize
      hide()

      useEventListener(element, 'click', (e) => {
        if (!resolveUnref(hideOnClick)) {
          // hide it only when clicking outside of the menu,
          // so stopPropagation when clicking on itself.
          e.stopPropagation()
        }
      })
    })

  // automatically update the position of `MenuElement`
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
