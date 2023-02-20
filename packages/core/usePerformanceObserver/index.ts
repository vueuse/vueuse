import { tryOnScopeDispose } from '@vueuse/shared'
import { useSupported } from '../useSupported'
import type { ConfigurableWindow } from '../_configurable'
import { defaultWindow } from '../_configurable'

export type UsePerformanceObserverOptions = PerformanceObserverInit & ConfigurableWindow & {
  /**
   * Start the observer immediate.
   *
   * @default true
   */
  immediate?: boolean
}

/**
 * Observe performance metrics.
 *
 * @see https://vueuse.org/usePerformanceObserver
 * @param options
 */
export function usePerformanceObserver(options: UsePerformanceObserverOptions, callback: PerformanceObserverCallback) {
  const {
    window = defaultWindow,
    immediate = true,
    ...performanceOptions
  } = options

  const isSupported = useSupported(() => window && 'PerformanceObserver' in window)

  let observer: PerformanceObserver | undefined

  const stop = () => {
    observer?.disconnect()
  }

  const start = () => {
    if (isSupported.value) {
      stop()
      observer = new PerformanceObserver(callback)
      observer.observe(performanceOptions)
    }
  }

  tryOnScopeDispose(stop)

  if (immediate)
    start()

  return {
    isSupported,
    start,
    stop,
  }
}
