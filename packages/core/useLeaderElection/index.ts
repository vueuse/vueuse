import type { ComputedRef, MaybeRefOrGetter, Ref, WatchOptionsBase } from 'vue'
import type { ConfigurableNavigator } from '../_configurable'
import { tryOnScopeDispose } from '@vueuse/shared'
import { readonly, ref, toValue, watchEffect } from 'vue'
import { defaultNavigator } from '../_configurable'
import { isExpectedWebLockRejection, useWebLocks } from '../useWebLocks'

export interface UseLeaderElectionOptions<Keys extends string = string> extends ConfigurableNavigator, WatchOptionsBase {
  /**
   * The name of the lock that gets used to elect the one tab that does the work.
   * Needs to be uniq throughout the origin.
   */
  name: MaybeRefOrGetter<Keys>
}

export interface UseLeaderElectionReturn {
  /**
   * Returns whether the Web Locks API is supported by the current browser.
   */
  isSupported: ComputedRef<boolean>

  /**
   * Reactive boolean that tracks whether the current tab was elected as the one tab to do the work.
   * If the tab was elected as leader it will stay the leader until the current scope gets disposed.
   * Then a new tab becomes the leader. isElected will only ever transition from `false` to `true` in
   * the lifetime of a component (when the lock name does not dynamically change).
   */
  isLeader: Readonly<Ref<boolean>>

  /**
   * Executes the workload function if the Web Locks API is not supported or if the current tab is the elected tab.
   * The workload function gets passed a signal that gets aborted when the scope gets disposed/we stop being the leader.
   * `signal` will be `undefined` when `isSupported` is `false`.
   *
   * @return `true` when the workload function was executed `false` otherwise.
   */
  asLeader: (workload: (signal?: AbortSignal) => void) => boolean
}

/**
 * Ensure that code gets executed only in one of many tabs.
 *
 * @see https://vueuse.org/useLeaderElection/
 * @param [options]
 */
export function useLeaderElection<Keys extends string = string>(options: UseLeaderElectionOptions<Keys>): UseLeaderElectionReturn {
  const {
    name,
    navigator = defaultNavigator,
    flush = 'sync',
  } = options
  const { isSupported, request } = useWebLocks<Record<string, void>>({ navigator })
  const isLeader = ref(false)
  let currentSignal: AbortSignal | undefined
  const asLeader = (workload: (signal?: AbortSignal) => void) => {
    if ((isSupported.value && isLeader.value) || !isSupported.value) {
      workload(currentSignal)
      return true
    }
    else {
      return false
    }
  }
  if (isSupported.value) {
    let currentLock: (() => void) | undefined
    const stopWatch = watchEffect(() => {
      if (currentLock) {
        isLeader.value = false
        currentSignal = undefined
        currentLock()
        currentLock = undefined
      }
      request(toValue(name), (signal) => {
        currentSignal = signal
        isLeader.value = true
        return new Promise((resolve) => {
          currentLock = resolve
        })
      }).catch((error) => {
        if (!isExpectedWebLockRejection(error)) {
          // can be InvalidStateError, SecurityError, or NotSupportedError
          // see https://developer.mozilla.org/en-US/docs/Web/API/LockManager/request#exceptions
          throw error
        }
      })
    }, { flush })
    tryOnScopeDispose(stopWatch)
  }

  return { isSupported, isLeader: readonly(isLeader), asLeader }
}
