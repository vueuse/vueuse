import { tryOnScopeDispose } from '../tryOnScopeDispose'
import type { AnyFn } from '../utils'

interface UseRafOptions {
  /**
   * Cancel the previous RAF call before requesting a new AF
   *
   * @default false
   */
  debounce?: boolean
}

export type UseRafCallbackFn = (timestamp: DOMHighResTimeStamp, ...args: Parameters<AnyFn>) => ReturnType<AnyFn>

type OmitFirstArrayElement<T extends any[]> = T extends [any, ...infer R] ? R : []

/**
 * Call function on next `requestAnimationFrame`.
 *
 * @see https://vueuse.org/useRaf
 * @param fn
 * @param options
 */
export function useRaf<CallbackFn extends UseRafCallbackFn>(fn: CallbackFn, options: UseRafOptions = {}) {
  const {
    debounce = false,
  } = options

  let rafId: number = 0

  const cancel = () => {
    if (window && rafId !== 0) {
      window.cancelAnimationFrame(rafId)
      rafId = 0
    }
  }

  const request = (...args: OmitFirstArrayElement<Parameters<CallbackFn>>) => {
    if (window) {
      if (debounce) {
        cancel()
      }

      rafId = window.requestAnimationFrame(ts => fn(ts, ...args))
    }
  }

  tryOnScopeDispose(cancel)

  return {
    cancel,
    request,
  }
}
