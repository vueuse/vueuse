import type { ConfigurableWindow } from '../_configurable'
import type { MaybeComputedElementRef } from '../unrefElement'

import { computed, shallowReadonly, shallowRef } from 'vue'
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

  function update(htmlEl: HTMLElement) {
    isXOverflowed.value = htmlEl.scrollWidth > htmlEl.offsetWidth
    isYOverflowed.value = htmlEl.scrollHeight > htmlEl.offsetHeight
  }

  const onResizeUpdated = onUpdated as ResizeObserverCallback | undefined

  const targetEl = computed(() => {
    const el = unrefElement(target)
    if (!el || el instanceof SVGElement)
      return undefined

    return el
  })

  const targets = () => {
    const el = targetEl.value
    if (!el || el instanceof SVGElement)
      return []
    return [el, ...Array.from(el.children).filter(i => i instanceof HTMLElement)]
  }

  useResizeObserver(targets, (entries, observer) => {
    const el = targetEl.value
    if (el) {
      update(el)
    }
    onResizeUpdated?.(entries, observer)
  }, { window })

  if (observeMutation) {
    const onMutationUpdated = onUpdated as MutationCallback | undefined
    useMutationObserver(
      targets,
      (entries, observer) => {
        const el = targetEl.value
        if (el) {
          update(el)
        }
        onMutationUpdated?.(entries, observer)
      },
      {
        window,
        ...(typeof observeMutation === 'object'
          ? observeMutation
          : { childList: true, subtree: true, characterData: true }),
      },
    )
  }
  return {
    isXOverflowed: shallowReadonly(isXOverflowed),
    isYOverflowed: shallowReadonly(isYOverflowed),
    // stop effectScope
    stop,
    // update overflow state immediately
    update: () => {
      const el = targetEl.value
      if (el && window) {
        update(el)
      }
    },
  }
}

export type UseElementOverflowReturn = ReturnType<typeof useElementOverflow>
