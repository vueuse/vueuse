import { MaybeRef, tryOnUnmounted } from '@vueuse/shared'
import { ref, watch } from 'vue-demi'
import { ConfigurableWindow, defaultWindow } from '../_configurable'

export interface ResizeObserverSize {
  readonly inlineSize: number
  readonly blockSize: number
}

export interface ResizeObserverEntry {
  readonly target: Element
  readonly contentRect: DOMRectReadOnly
  readonly borderBoxSize?: ReadonlyArray<ResizeObserverSize>
  readonly contentBoxSize?: ReadonlyArray<ResizeObserverSize>
  readonly devicePixelContentBoxSize?: ReadonlyArray<ResizeObserverSize>
}

// eslint-disable-next-line no-use-before-define
export type ResizeObserverCallback = (entries: ReadonlyArray<ResizeObserverEntry>, observer: ResizeObserver) => void

export interface ResizeObserverOptions extends ConfigurableWindow {
  /**
   * Sets which box model the observer will observe changes to. Possible values
   * are `content-box` (the default), and `border-box`.
   *
   * @default 'content-box'
   */
  box?: 'content-box' | 'border-box'
}

declare class ResizeObserver {
  constructor(callback: ResizeObserverCallback);
  disconnect(): void;
  observe(target: Element, options?: ResizeObserverOptions): void;
  unobserve(target: Element): void;
}

/**
 * Reports changes to the dimensions of an Element's content or the border-box
 *
 * @see   {@link https://vueuse.js.org/useResizeObserver}
 * @param target
 * @param callback
 * @param options
 */
export function useResizeObserver(
  target: MaybeRef<Element | null | undefined>,
  callback: ResizeObserverCallback,
  options: ResizeObserverOptions = {},
) {
  const { window = defaultWindow, ...observerOptions } = options
  let observer: ResizeObserver | undefined
  const targetRef = ref(target)
  const isSupported = window && 'ResizeObserver' in window

  const cleanup = () => {
    if (observer) {
      observer.disconnect()
      observer = undefined
    }
  }

  const stopWatch = watch(targetRef, (newValue) => {
    cleanup()

    if (isSupported && window && newValue) {
      // @ts-expect-error missing type
      observer = new window.ResizeObserver(callback)
      observer!.observe(newValue, observerOptions)
    }
  })

  const stop = () => {
    cleanup()
    stopWatch()
  }

  tryOnUnmounted(stop)

  return {
    isSupported,
    stop,
  }
}
