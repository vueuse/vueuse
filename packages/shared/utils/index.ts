import { Ref } from 'vue-demi'
export * from './is'

export type MaybeRef<T> = T | Ref<T>

export function promiseTimeout(ms: number, throwOnTimeout = false, reason = 'Timeout'): Promise<void> {
  return new Promise((resolve, reject) => {
    if (throwOnTimeout)
      setTimeout(() => reject(reason), ms)
    else
      setTimeout(resolve, ms)
  })
}

export function invoke<T>(fn: () => T): T {
  return fn()
}
