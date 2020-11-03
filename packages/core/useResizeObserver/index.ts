/* eslint-disable no-use-before-define */
import { Ref, unref, onBeforeUnmount, watchEffect } from 'vue-demi'

export interface ResizeObserverEntry {
  readonly target: Element
  readonly contentRect: DOMRectReadOnly
  readonly borderBoxSize?: ReadonlyArray<ResizeObserverSize>
  readonly contentBoxSize?: ReadonlyArray<ResizeObserverSize>
  readonly devicePixelContentBoxSize?: ReadonlyArray<ResizeObserverSize>
}

export interface ResizeObserverSize {
  readonly inlineSize: number
  readonly blockSize: number
}

export type ResizeObserverCallback = (entries: ReadonlyArray<ResizeObserverEntry>, observer: ResizeObserver) => void

interface ResizeObserverOptions {
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

export function useResizeObserver(
  el: Ref<HTMLElement | null | undefined>,
  callback: ResizeObserverCallback,
) {
  const stop = watchEffect((onInvalidate) => {
    const observer = new ResizeObserver(callback)
    const _el = unref(el)
    _el && observer.observe(_el)

    onInvalidate(() => {
      const _el = unref(el)
      _el && observer.unobserve(_el)
      observer.disconnect()
    })
  })

  onBeforeUnmount(() => {
    stop()
  })

  return {
    stop,
  }
}
