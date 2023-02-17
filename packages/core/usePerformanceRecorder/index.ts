import { tryOnScopeDispose } from '@vueuse/shared'
import { useSupported } from '../useSupported'
import type { ConfigurableWindow } from '../_configurable'
import { defaultWindow } from '../_configurable'

export type UsePerformanceRecorderOptions = PerformanceObserverInit & ConfigurableWindow

/**
 * Records performance metrics.
 *
 * @see https://vueuse.org/usePerformanceRecorder
 * @param options
 */
export function usePerformanceRecorder(options: UsePerformanceRecorderOptions, callback: PerformanceObserverCallback) {
  const {
    window = defaultWindow,
    ...performanceOptions
  } = options

  const isSupported = useSupported(() => window && 'PerformanceObserver' in window)

  const observer = new PerformanceObserver(callback)
  observer.observe(performanceOptions)

  const stop = () => {
    observer?.disconnect()
  }

  tryOnScopeDispose(stop)

  return {
    isSupported,
    stop,
  }
}
