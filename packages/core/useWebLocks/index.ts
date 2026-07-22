import type { ComputedRef } from 'vue'
import type { ConfigurableNavigator } from '../_configurable'
import { tryOnScopeDispose } from '@vueuse/shared'
import { defaultNavigator } from '../_configurable'
import { useSupported } from '../useSupported'

export interface UseWebLocksOptions extends ConfigurableNavigator {
  /**
   * Force the release of all held locks when the scope gets disposed.
   * You can set this to `false` when you do need the return value of the callback even if the scope gets disposed
   * while the callback gets executed. The default is `true` since you normally do not need the promise resolve normally
   * when the scope gets disposed.
   *
   * Either way of course the callback function does not automatically get terminated when the scope gets disposed.
   * Long-running callback function should check the AbortSignal they get as parameter (e.g. call `signal.throwIfAborted()`).
   *
   * @default true
   */
  forceRelease?: boolean
}

export interface UseWebLocksRequestOptions {
  /**
   * Either "exclusive" or "shared". The default value is "exclusive". Use "shared" to e.g. implement a one-writer-multiple-reader pattern.
   *
   * @default "exclusive"
   */
  mode?: LockMode

  /**
   * If `true`, the lock request will only be granted if it is not already held.
   * If it cannot be granted, the request gets rejected with `useWebLocksAbortLockHeld`.
   *
   * @default false
   */
  ifAvailable?: boolean

  /**
   * If `true`, then any held locks with the same name will be released, and the request will be granted, preempting any queued requests for it.
   * This is an escape hatch to resolve deadlock situations. You should not need to use it.
   * All useWebLocks composables currently holding this lock will immediately be rejected with `useWebLocksAbortLockStolen`.
   *
   * @default false
   */
  steal?: boolean

  /**
   * An AbortSignal (the signal property of an AbortController); if specified and the AbortController is aborted,
   * the lock request is dropped if it was not already granted.
   * The lock request always gets aborted when the scope gets disposed.
   * Use this to abort lock requests manually (e.g. when the request takes too long).
   */
  signal?: AbortSignal
}

export interface UseWebLocksReturn<ReturnMap extends Record<string, unknown> = Record<string, unknown>> {
  /**
   * Returns whether the Web Locks API is supported by the current browser.
   */
  isSupported: ComputedRef<boolean>

  /**
   * Request a web lock. Can be called simultaneously with different lock names to request different locks in parallel.
   * Multiple request calls with the same name can be queued. They will get executed sequentially.
   *
   * @param name name of the lock to request. Cannot start with a hyphen (-). Needs to be unique in the whole origin.
   * @param options optional options for the lock.
   * @param callback function to call when the lock is held.
   *                 It gets an abort signal as parameter that can be used to bail when the scope gets disposed while the lock is held or another process steals the lock.
   * @return Promise that resolves with the return value of callback when the lock is released or gets rejected in error conditions.
   *         There are three distinct rejection reasons that you can test for:
   *
   *  - `useWebLocksAbortScopeDisposed` signals that the scope was disposed while we tried to get the lock (or while callback was executed and `forceRelease` is `true`)
   *  - `useWebLocksAbortLockStolen` signals that another process stole the lock
   *  - `useWebLocksAbortLockHeld` signals that an `ifAvailable` request could not be granted because another process was holding the lock
   *
   * @see https://developer.mozilla.org/en-US/docs/Web/API/LockManager/request
   */
  request: (<Name extends keyof ReturnMap>(name: Name, callback: (signal: AbortSignal) => PromiseLike<ReturnMap[Name]> | ReturnMap[Name]) => Promise<Awaited<ReturnMap[Name]>>) &
    (<Name extends keyof ReturnMap>(name: Name, options: UseWebLocksRequestOptions, callback: (signal: AbortSignal) => PromiseLike<ReturnMap[Name]> | ReturnMap[Name]) => Promise<Awaited<ReturnMap[Name]>>)
}

/**
 * Symbol that is the requests rejection reason and is the reason of the AbortSignal when the lock (request) was aborted because the current scope was disposed.
 */
export const useWebLocksAbortScopeDisposed = Symbol('useWebLocksAbortScopeDisposed')

/**
 * Symbol that is the requests rejection reason or is the reason of the AbortSignal when the lock was aborted because another process stole the lock.
 */
export const useWebLocksAbortLockStolen = Symbol('useWebLocksAbortLockStolen')

/**
 * Symbol that is the requests rejection reason when the lock request was aborted because `isAvailable` is `true` and the lock is currently held.
 */
export const useWebLocksAbortLockHeld = Symbol('useWebLocksAbortLockHeld')

/**
 * Reactive Web Locks API. The lock (request) automatically gets release on scope dispose.
 *
 * @see https://vueuse.org/useWebLocks/
 * @see https://developer.mozilla.org/en-US/docs/Web/API/Web_Locks_API
 * @param [options]
 */
export function useWebLocks<ReturnMap extends Record<string, unknown> = Record<string, unknown>>(options: UseWebLocksOptions = {}): UseWebLocksReturn<ReturnMap> {
  const { forceRelease = true, navigator = defaultNavigator } = options
  const isSupported = useSupported(() => navigator?.locks && typeof AbortController === 'function')
  const activeRejects = forceRelease ? new Set<(reason: symbol) => void>() : undefined
  let scopeDisposedAbortController: AbortController
  async function request<Name extends keyof ReturnMap>(name: Name, optionsOrFn: UseWebLocksRequestOptions | ((signal: AbortSignal) => PromiseLike<ReturnMap[Name]> | ReturnMap[Name]), callback?: (signal: AbortSignal) => PromiseLike<ReturnMap[Name]> | ReturnMap[Name]): Promise<Awaited<ReturnMap[Name]>> {
    if (!isSupported.value) {
      throw new Error('Web Locks API or AbortController not supported')
    }
    if (scopeDisposedAbortController.signal.aborted) {
      throw new Error('called request after scope was already disposed')
    }
    const requestOptions = typeof optionsOrFn === 'function' ? {} : optionsOrFn
    callback = typeof optionsOrFn === 'function' ? optionsOrFn : callback
    if (typeof callback !== 'function') {
      throw new TypeError('callback not provided')
    }
    const { mode = 'exclusive', ifAvailable = false, steal = false, signal } = requestOptions
    // This is the only misconfiguration error we need to handle ourselves – all other get thrown natively
    if ((ifAvailable || steal) && signal) {
      throw new DOMException('signal cannot be used with either ifAvailable or steal set to true', 'NotSupportedError')
    }
    const requestAbortController = new AbortController()
    const tellRequestScopeWasDisposed = () => {
      requestAbortController.abort(useWebLocksAbortScopeDisposed)
    }
    scopeDisposedAbortController.signal.addEventListener('abort', tellRequestScopeWasDisposed)
    const tellRequestSignalWasAborted = () => {
      requestAbortController.abort(signal!.reason)
    }
    if (signal) {
      signal.addEventListener('abort', tellRequestSignalWasAborted)
    }
    let inCallback = false
    try {
      return await navigator!.locks.request(name as string, {
        mode,
        ifAvailable,
        steal,
        signal: !ifAvailable && !steal ? requestAbortController.signal : undefined,
      }, (lock) => {
        // we only use the signal for request aborting. since we have the lock, remove our abort event listener
        if (signal) {
          signal.removeEventListener('abort', tellRequestSignalWasAborted)
        }
        if (!lock) {
          throw useWebLocksAbortLockHeld
        }
        return new Promise<Awaited<ReturnMap[Name]>>((resolve, reject) => {
          if (forceRelease) {
            activeRejects!.add(reject)
          }
          inCallback = true
          Promise.resolve(callback(requestAbortController.signal))
            .finally(() => {
              if (forceRelease) {
                activeRejects!.delete(reject)
              }
              inCallback = false
            })
            .then(resolve)
            .catch(reject)
        })
      })
    }
    catch (error) {
      // If execution is in the callback there are only two possible reasons we get an error:
      // (1) we force release the lock on scope dispose (see tryOnScopeDispose below)
      // (2) the lock got stolen
      // For the latter case we normalize the provided browser DOMException to our useWebLocksAbortLockStolen symbol.
      // The browsers all throw 'AbortError' DOMException errors but their message is different for all browsers.
      if (inCallback && error !== useWebLocksAbortScopeDisposed) {
        requestAbortController.abort(useWebLocksAbortLockStolen)
        throw useWebLocksAbortLockStolen
      }
      throw error
    }
    finally {
      scopeDisposedAbortController.signal.removeEventListener('abort', tellRequestScopeWasDisposed)
      if (signal) {
        signal.removeEventListener('abort', tellRequestSignalWasAborted)
      }
    }
  }

  if (isSupported.value) {
    scopeDisposedAbortController = new AbortController()
    tryOnScopeDispose(() => {
      scopeDisposedAbortController.abort(useWebLocksAbortScopeDisposed)
      if (forceRelease) {
        // We preemptively reject/release all held locks when the scope gets disposed.
        // Running callbacks also get notified of the scope disposal via the aborted AbortSignal
        activeRejects!.forEach(reject => reject(useWebLocksAbortScopeDisposed))
        activeRejects!.clear()
      }
    })
  }

  return { isSupported, request }
}

/**
 * Checks if `reason` is an expected promise rejection of the `useWebLocks` composable.
 * `useWebLocks` rejects/aborts web lock requests when the current scope gets disposed, when `isAvailable` is `true` but the lock is already held.
 *  It also aborts running callbacks when the lock got stolen while the callback was still holding it.
 *
 * @param reason
 * @return `true` when you should ignore this rejection reason
 */
export function isExpectedWebLockRejection(reason: unknown): boolean {
  return (reason === useWebLocksAbortScopeDisposed)
    || (reason === useWebLocksAbortLockHeld)
    || (reason === useWebLocksAbortLockStolen)
}
