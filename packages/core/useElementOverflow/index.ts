import { effectScope, ref } from 'vue-demi'
import {
  tryOnMounted,
  tryOnUnmounted,
} from '@vueuse/shared'
import type { ConfigurableWindow } from '@vueuse/core/_configurable'
import { type MaybeComputedElementRef, unrefElement } from '../unrefElement'
import type { ResizeObserverCallback } from '../useResizeObserver'
import { useMutationObserver } from '../useMutationObserver'
import { useResizeObserver } from '../useResizeObserver'
import { defaultWindow } from '../_configurable'

export interface UseElementOverflowOptions extends ConfigurableWindow {
  observeMutation?: boolean | MutationObserverInit
  onUpdated?: ResizeObserverCallback | MutationCallback
}

export function useElementOverflow(target: MaybeComputedElementRef, option: UseElementOverflowOptions = {}) {
  const { observeMutation, onUpdated, window = defaultWindow } = option
  const isXOverflowed = ref(false)
  const isYOverflowed = ref(false)

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
    stop,
    update: () => {
      const el = unrefElement(target)
      if (el instanceof HTMLElement && window) {
        update(el)
      }
    },
  }
}

export type UseElementOverflowReturn = ReturnType<typeof useElementOverflow>
