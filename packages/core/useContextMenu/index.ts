import type { MaybeComputedRef } from '@vueuse/shared'
import { noop, resolveUnref } from '@vueuse/shared'
import type { Ref } from 'vue-demi'
import { computed, nextTick, reactive, ref, watch, watchEffect } from 'vue-demi'
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
   * Indicates whether the context menu is enabled,
   * mutate to disable/enable it.
   */
  enabled: Ref<boolean>

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

  /**
   * Stop the context menu permanently.
   */
  stop: () => void
}

/**
 *
 * Add custom `contextMenu` to an Element.
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

  const menuElementRef = computed(() => unrefElement(menuElement))
  const targetRef = computed(() => unrefElement(target))

  const menuElementSize = reactive(
    useElementSize(
      menuElementRef,
      { width: 0, height: 0 },
      { box: 'border-box' },
    ),
  )
  const windowSize = reactive(
    useWindowSize({
      includeScrollbar: false,
    }),
  )

  const enabled = ref(true)
  const visible = ref(false)
  const position = ref<Position>({ x: 0, y: 0 })

  // see: https://github.com/vueuse/vueuse/pull/2136#issuecomment-1230525648
  const menuPositionOffset = computed(() => {
    const { x, y } = position.value
    let [left, top, right, bottom]: Array<`${number}px` | null> = [
        `${x}px`,
        `${y}px`,
        null,
        null,
    ]

    const overflowX = x + menuElementSize.width > windowSize.width
    const overflowY = y + menuElementSize.height > windowSize.height

    if (overflowX)
      [left, right] = [null, `${windowSize.width - x}px`]

    if (overflowY)
      [top, bottom] = [null, `${windowSize.height - y}px`]

    return {
      left,
      top,
      right,
      bottom,
    }
  })

  const show = () => visible.value = true
  const hide = () => visible.value = false

  // hide first when it changes
  watch(enabled, hide)
  watch(visible, onVisibleChange)

  // automatically show/hide and update the position of the `MenuElement`
  const stopUpdate = watchEffect(
    () => {
      const element = menuElementRef.value

      if (!element)
        return

      element.style.position = 'fixed'
      element.style.visibility = visible.value ? 'visible' : 'hidden'

      // performance
      if (visible.value) {
        for (const [property, offset] of Object.entries(menuPositionOffset.value))
          element.style.setProperty(property, offset)
      }
    })

  const cleanups = [stopUpdate]
  const stop = () => {
    enabled.value = false
    // wait till the `hide` effect is done.
    nextTick(() => {
      cleanups.forEach(fn => fn())
    })
  }
  const contextMenuHandler = (e: MouseEvent) => {
    if (!enabled.value)
      return

    e.preventDefault()
    position.value = {
      x: e.clientX,
      y: e.clientY,
    }
    show()
    // prevent other(parent) context menu from showing
    e.stopPropagation()
  }

  // with `target` specified, apply on it.
  // otherwise, apply on the entire page.
  if (target)
    cleanups.push(useEventListener(targetRef, 'contextmenu', contextMenuHandler))
  else
    cleanups.push(useEventListener('contextmenu', contextMenuHandler))

  cleanups.push(
    useEventListener('scroll', hide),
    useEventListener('click', hide),
    useEventListener('resize', hide),
    useEventListener('blur', hide),
    useEventListener('contextmenu', hide, { capture: true }),
    useEventListener(menuElementRef, 'click', (e) => {
      if (!resolveUnref(hideOnClick)) {
        // hide it only when clicking outside of the menu,
        // so stopPropagation when clicking on itself.
        e.stopPropagation()
      }
    }),
  )

  return {
    visible,
    position,
    enabled,

    hide,
    show,
    stop,
  }
}
