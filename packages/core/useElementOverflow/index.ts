import type { ConfigurableWindow } from '@vueuse/core/_configurable'
import type { MaybeComputedElementRef } from '../unrefElement'
import type { ResizeObserverCallback } from '../useResizeObserver'
import {
  tryOnMounted,
  tryOnUnmounted,
} from '@vueuse/shared'
import { effectScope, shallowRef } from 'vue'
import { defaultWindow } from '../_configurable'
import { unrefElement } from '../unrefElement'
import { useMutationObserver } from '../useMutationObserver'
import { useResizeObserver } from '../useResizeObserver'

export interface UseElementOverflowOptions extends ConfigurableWindow {
  /**
   * Use MutationObserver to observe the target and its children.
   *
   * @default false
   */
  observeMutation?: boolean | MutationObserverInit
  /**
   * Callback when observer triggered.
   */
  onUpdated?: ResizeObserverCallback | MutationCallback
}

/**
 * react a dom's overflow state
 * @see https://vueuse.org/useElementOverflow
 * @param target
 * @param option
 */
export function useElementOverflow(target: MaybeComputedElementRef, option: UseElementOverflowOptions = {}) {
  const { observeMutation = false, onUpdated, window = defaultWindow } = option
  const isXOverflowed = shallowRef(false)
  const isYOverflowed = shallowRef(false)

  const scope = effectScope()

  function update(htmlEl: HTMLElement) {
    isXOverflowed.value = htmlEl.scrollWidth > htmlEl.offsetWidth
    isYOverflowed.value = htmlEl.scrollHeight > htmlEl.offsetHeight
  }

  function stop() {
    scope.stop()
  }

  tryOnMounted(() => {
    const el = unrefElement(target)
    if (!el || el instanceof SVGElement || !window) {
      return
    }
    scope.run(() => {
      if (!el || el instanceof SVGElement) {
        return
      }
      const childEls = Array.from(el.children).filter(i => i instanceof HTMLElement)
      useResizeObserver([el, ...childEls] as HTMLElement[], (entries, observer) => {
        update(el);
        (onUpdated as ResizeObserverCallback)?.(entries, observer)
      })
      if (observeMutation) {
        useMutationObserver(
          [el, ...childEls] as HTMLElement[],
          (entries, observer) => {
            update(el);
            (onUpdated as MutationCallback)?.(entries, observer)
          },
          observeMutation === true
            ? {
                childList: true,
                subtree: true,
                characterData: true,
              }
            : observeMutation,
        )
      }
    })
  })
  tryOnUnmounted(stop)
  return {
    isXOverflowed,
    isYOverflowed,
    // stop effectScope
    stop,
    // update overflow state immediately
    update: () => {
      const el = unrefElement(target)
      if (el instanceof HTMLElement && window) {
        update(el)
      }
    },
  }
}

export type UseElementOverflowReturn = ReturnType<typeof useElementOverflow>
