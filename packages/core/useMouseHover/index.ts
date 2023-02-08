import { computed, ref } from 'vue-demi'
import type { MaybeElementRef } from '../unrefElement'
import { unrefElement } from '../unrefElement'
import { useEventListener } from '../useEventListener'
import type { ConfigurableWindow } from '../_configurable'
import { defaultWindow } from '../_configurable'

export interface MouseHoverOptions extends ConfigurableWindow {
  enterDelay?: number
  leaveDelay?: number
  /**
   * Initial values
   *
   * @default false
   */
  initialValue?: boolean
  /**
   * Element target to be capture the click
   */
  target?: MaybeElementRef
}

/**
 * Reactive mouse position.
 *
 * @see https://vueuse.org/useMouseHover
 * @param options
 */
export function useMouseHover(options: MouseHoverOptions = {}) {
  const {
    enterDelay = 0,
    leaveDelay = 0,
    initialValue = false,
    window = defaultWindow,
  } = options

  const isHovering = ref(initialValue)
  const timer = ref<any>(undefined)

  const toggle = (which: boolean) => {
    // if (!canHover()) return
    const delay = which ? enterDelay : leaveDelay
    window?.clearTimeout(timer.value)

    if (delay)
      timer.value = window?.setTimeout(() => isHovering.value = which, delay)
    else
      isHovering.value = which
  }

  if (!window) {
    return {
      isHovering,
    }
  }

  const target = computed(() => unrefElement(options.target) || window)

  useEventListener(target, 'mouseenter', () => toggle(true), { passive: true })
  useEventListener(target, 'mouseleave', () => toggle(false), { passive: true })

  return {
    isHovering,
  }
}

export type UseMouseHoverReturn = ReturnType<typeof useMouseHover>
