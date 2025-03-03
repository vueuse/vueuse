import type { MaybeRefOrGetter } from 'vue'
import type { ConfigurableWindow } from '../_configurable'
import type { MaybeComputedElementRef, MaybeElement } from '../unrefElement'
import { tryOnScopeDispose } from '@vueuse/shared'
import { computed, toValue, watch } from 'vue'
import { defaultWindow } from '../_configurable'
import { unrefElement } from '../unrefElement'
import { useSupported } from '../useSupported'

export interface ResizeObserverSize {
  readonly inlineSize: number
  readonly blockSize: number
}

export interface ResizeObserverEntry {
  readonly target: Element
  readonly contentRect: DOMRectReadOnly
  readonly borderBoxSize: ReadonlyArray<ResizeObserverSize>
  readonly contentBoxSize: ReadonlyArray<ResizeObserverSize>
  readonly devicePixelContentBoxSize: ReadonlyArray<ResizeObserverSize>
}

export type ResizeObserverCallback = (entries: ReadonlyArray<ResizeObserverEntry>, observer: ResizeObserver) => void

export interface UseResizeObserverOptions extends ConfigurableWindow {
  /**
   * Sets which box model the observer will observe changes to. Possible values
   * are `content-box` (the default), `border-box` and `device-pixel-content-box`.
   *
   * @default 'content-box'
   */
  box?: ResizeObserverBoxOptions
}

declare class ResizeObserver {
  constructor(callback: ResizeObserverCallback)
  disconnect(): void
  observe(target: Element, options?: UseResizeObserverOptions): void
  unobserve(target: Element): void
}

/**
 * Reports changes to the dimensions of an Element's content or the border-box
 *
 * @see https://vueuse.org/useResizeObserver
 * @param target
 * @param callback
 * @param options
 */
export function useResizeObserver(
  target: MaybeComputedElementRef | MaybeComputedElementRef[] | MaybeRefOrGetter<MaybeElement[]>,
  callback: ResizeObserverCallback,
  options: UseResizeObserverOptions = {},
) {
  const { window = defaultWindow, ...observerOptions } = options
  let observer: ResizeObserver | undefined
  const isSupported = useSupported(() => window && 'ResizeObserver' in window)

  const cleanup = () => {
    if (observer) {
      observer.disconnect()
      observer = undefined
    }
  }

  const targets = computed(() => {
    const _targets = toValue(target)
    return Array.isArray(_targets)
      ? _targets.map(el => unrefElement(el))
      : [unrefElement(_targets)]
  })

  const stopWatch = watch(
    targets,
    (els) => {
      cleanup()
      if (isSupported.value && window) {
        observer = new ResizeObserver(callback)
        for (const _el of els) {
          if (_el)
            observer!.observe(_el, observerOptions)
        }
      }
    },
    { immediate: true, flush: 'post' },
  )

  const stop = () => {
    cleanup()
    stopWatch()
  }

  tryOnScopeDispose(stop)

  return {
    isSupported,
    stop,
  }
}

export type UseResizeObserverReturn = ReturnType<typeof useResizeObserver>
