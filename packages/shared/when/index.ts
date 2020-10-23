import { WatchOptions, watch, WatchSource } from 'vue-demi'
import { promiseTimeout } from '../utils'

export interface WhenToMatchOptions {
  flush?: WatchOptions['flush']
  timeout?: number
  throwOnTimeout?: boolean
}

export interface WhenInstance<T> {
  readonly not: WhenInstance<T>

  toMatch(condition: (v: T | object) => boolean, options?: WhenToMatchOptions): Promise<void>
  toBe<P>(value: P | T, options?: WhenToMatchOptions): Promise<void>
  toBeTruthy(options?: WhenToMatchOptions): Promise<void>
  toBeNull(options?: WhenToMatchOptions): Promise<void>
  toBeUndefined(options?: WhenToMatchOptions): Promise<void>
  toBeNaN(options?: WhenToMatchOptions): Promise<void>
  toContain<P>(value: P, options?: WhenToMatchOptions): Promise<void>
  changed(options?: WhenToMatchOptions): Promise<void>
  changedTimes(n?: number, options?: WhenToMatchOptions): Promise<void>
}

export function when<T>(r: WatchSource<T> | object): WhenInstance<T> {
  let isNot = false

  function toMatch(
    condition: (v: T | object) => boolean,
    { flush = 'sync', timeout, throwOnTimeout }: WhenToMatchOptions = {},
  ): Promise<void> {
    let stop: Function | null = null
    const watcher = new Promise<void>((resolve) => {
      stop = watch(r, (v) => {
        if (condition(v) === !isNot) {
          stop?.()
          resolve()
        }
      }, {
        flush,
        immediate: true,
      })
    })

    const promises = [watcher]
    if (timeout) {
      promises.push(
        promiseTimeout(timeout, throwOnTimeout)
          .finally(() => { stop?.() }),
      )
    }

    return Promise.race(promises)
  }

  function toBe<P>(value: P | T, options?: WhenToMatchOptions) {
    return toMatch(v => v === value, options)
  }

  function toBeTruthy(options?: WhenToMatchOptions) {
    return toMatch(v => Boolean(v), options)
  }

  function toBeNull(options?: WhenToMatchOptions) {
    return toBe<null>(null, options)
  }

  function toBeUndefined(options?: WhenToMatchOptions) {
    return toBe<undefined>(undefined, options)
  }

  function toBeNaN(options?: WhenToMatchOptions) {
    return toMatch(Number.isNaN, options)
  }

  function toContain<P>(value: P, options?: WhenToMatchOptions) {
    return toMatch((v) => {
      const array = Array.from(v as any)
      return array.includes(value)
    }, options)
  }

  function changed(options?: WhenToMatchOptions) {
    return changedTimes(1, options)
  }

  function changedTimes(n = 1, options?: WhenToMatchOptions) {
    let count = -1 // skip the immediate check
    return toMatch(() => {
      count += 1
      return count >= n
    }, options)
  }

  return {
    toMatch,
    toBe,
    toBeTruthy,
    toBeNull,
    toBeNaN,
    toBeUndefined,
    toContain,
    changed,
    changedTimes,
    get not() {
      isNot = !isNot
      return this
    },
  }
}
