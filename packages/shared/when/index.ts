import { WatchOptions, watch, WatchSource, unref, Ref } from 'vue-demi'
import { ElementOf, promiseTimeout, ShallowUnwrapRef, MaybeRef } from '../utils'

export interface WhenToMatchOptions {
  /**
   * Milseconds timeout for promise to resolve/reject if the when condition does not meet.
   * 0 for never timed out
   *
   * @default 0
   */
  timeout?: number

  /**
   * Reject the promise when timeout
   *
   * @default false
   */
  throwOnTimeout?: boolean

  /**
   * `flush` option for internal watch
   *
   * @default 'sync'
   */
  flush?: WatchOptions['flush']
}

export interface BaseWhenInstance<T> {
  toMatch(
    condition: (v: T) => boolean,
    options?: WhenToMatchOptions
  ): Promise<void>
  changed(options?: WhenToMatchOptions): Promise<void>
  changedTimes(n?: number, options?: WhenToMatchOptions): Promise<void>
}

export interface ValueWhenInstance<T> extends BaseWhenInstance<T> {
  readonly not: ValueWhenInstance<T>

  toBe<P = T>(value: MaybeRef<T | P>, options?: WhenToMatchOptions): Promise<void>
  toBeTruthy(options?: WhenToMatchOptions): Promise<void>
  toBeNull(options?: WhenToMatchOptions): Promise<void>
  toBeUndefined(options?: WhenToMatchOptions): Promise<void>
  toBeNaN(options?: WhenToMatchOptions): Promise<void>
}

export interface ArrayWhenInstance<T> extends BaseWhenInstance<T> {
  readonly not: ArrayWhenInstance<T>

  toContains(value: MaybeRef<ElementOf<ShallowUnwrapRef<T>>>, options?: WhenToMatchOptions): Promise<void>
}

export function when<T extends unknown[]>(r: T): ArrayWhenInstance<T>
export function when<T extends Ref<unknown[]>>(r: T): ArrayWhenInstance<T>
export function when<T>(r: WatchSource<T>): ValueWhenInstance<T>
export function when<T>(r: T): ValueWhenInstance<T>
export function when<T>(r: any): any {
  let isNot = false

  function toMatch(
    condition: (v: any) => boolean,
    { flush = 'sync', timeout, throwOnTimeout }: WhenToMatchOptions = {},
  ): Promise<void> {
    let stop: Function | null = null
    const watcher = new Promise<void>((resolve) => {
      stop = watch(
        r,
        (v) => {
          if (condition(v) === !isNot) {
            stop?.()
            resolve()
          }
        },
        {
          flush,
          immediate: true,
        },
      )
    })

    const promises = [watcher]
    if (timeout) {
      promises.push(
        promiseTimeout(timeout, throwOnTimeout).finally(() => {
          stop?.()
        }),
      )
    }

    return Promise.race(promises)
  }

  function toBe<P>(value: P | T, options?: WhenToMatchOptions) {
    return toMatch(v => v === unref(value), options)
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

  function toContains(
    value: any,
    options?: WhenToMatchOptions,
  ) {
    return toMatch((v) => {
      const array = Array.from(v as any)
      return array.includes(value) || array.includes(unref(value))
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

  if (Array.isArray(unref(r))) {
    const instance: ArrayWhenInstance<T> = {
      toMatch,
      toContains,
      changed,
      changedTimes,
      get not() {
        isNot = !isNot
        return this
      },
    }
    return instance
  }
  else {
    const instance: ValueWhenInstance<T> = {
      toMatch,
      toBe,
      toBeTruthy,
      toBeNull,
      toBeNaN,
      toBeUndefined,
      changed,
      changedTimes,
      get not() {
        isNot = !isNot
        return this
      },
    }

    return instance
  }
}
