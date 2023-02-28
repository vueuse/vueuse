import type { WatchOptions, WatchSource } from 'vue-demi'
import { isRef, watch } from 'vue-demi'
import { resolveUnref } from '../resolveUnref'
import type { ElementOf, MaybeComputedRef, ShallowUnwrapRef } from '../utils'
import { promiseTimeout } from '../utils'

export interface UntilToMatchOptions {
  /**
   * Milliseconds timeout for promise to resolve/reject if the when condition does not meet.
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

  /**
   * `deep` option for internal watch
   *
   * @default 'false'
   */
  deep?: WatchOptions['deep']
}

export interface UntilBaseInstance<T, Not extends boolean = false> {
  toMatch<U extends T = T>(
    condition: (v: T) => v is U,
    options?: UntilToMatchOptions
  ): Not extends true ? Promise<Exclude<T, U>> : Promise<U>
  toMatch(
    condition: (v: T) => boolean,
    options?: UntilToMatchOptions
  ): Promise<T>
  changed(options?: UntilToMatchOptions): Promise<T>
  changedTimes(n?: number, options?: UntilToMatchOptions): Promise<T>
}

type Falsy = false | void | null | undefined | 0 | 0n | ''

export interface UntilValueInstance<T, Not extends boolean = false> extends UntilBaseInstance<T, Not> {
  readonly not: UntilValueInstance<T, Not extends true ? false : true>

  toBe<P = T>(value: MaybeComputedRef<P>, options?: UntilToMatchOptions): Not extends true ? Promise<T> : Promise<P>
  toBeTruthy(options?: UntilToMatchOptions): Not extends true ? Promise<T & Falsy> : Promise<Exclude<T, Falsy>>
  toBeNull(options?: UntilToMatchOptions): Not extends true ? Promise<Exclude<T, null>> : Promise<null>
  toBeUndefined(options?: UntilToMatchOptions): Not extends true ? Promise<Exclude<T, undefined>> : Promise<undefined>
  toBeNaN(options?: UntilToMatchOptions): Promise<T>
}

export interface UntilArrayInstance<T> extends UntilBaseInstance<T> {
  readonly not: UntilArrayInstance<T>

  toContains(value: MaybeComputedRef<ElementOf<ShallowUnwrapRef<T>>>, options?: UntilToMatchOptions): Promise<T>
}

function createUntil<T>(r: any, isNot = false) {
  function toMatch(
    condition: (v: any) => boolean,
    { flush = 'sync', deep = false, timeout, throwOnTimeout }: UntilToMatchOptions = {},
  ): Promise<T> {
    let stop: Function | null = null
    const watcher = new Promise<T>((resolve) => {
      stop = watch(
        r,
        (v) => {
          if (condition(v) !== isNot) {
            stop?.()
            resolve(v)
          }
        },
        {
          flush,
          deep,
          immediate: true,
        },
      )
    })

    const promises = [watcher]
    if (timeout != null) {
      promises.push(
        promiseTimeout(timeout, throwOnTimeout)
          .then(() => resolveUnref(r))
          .finally(() => stop?.()),
      )
    }

    return Promise.race(promises)
  }

  function toBe<P>(value: MaybeComputedRef<P | T>, options?: UntilToMatchOptions) {
    if (!isRef(value))
      return toMatch(v => v === value, options)

    const { flush = 'sync', deep = false, timeout, throwOnTimeout } = options ?? {}
    let stop: Function | null = null
    const watcher = new Promise<T>((resolve) => {
      stop = watch(
        [r, value],
        ([v1, v2]) => {
          if (isNot !== (v1 === v2)) {
            stop?.()
            resolve(v1)
          }
        },
        {
          flush,
          deep,
          immediate: true,
        },
      )
    })

    const promises = [watcher]
    if (timeout != null) {
      promises.push(
        promiseTimeout(timeout, throwOnTimeout)
          .then(() => resolveUnref(r))
          .finally(() => {
            stop?.()
            return resolveUnref(r)
          }),
      )
    }

    return Promise.race(promises)
  }

  function toBeTruthy(options?: UntilToMatchOptions) {
    return toMatch(v => Boolean(v), options)
  }

  function toBeNull(options?: UntilToMatchOptions) {
    return toBe<null>(null, options)
  }

  function toBeUndefined(options?: UntilToMatchOptions) {
    return toBe<undefined>(undefined, options)
  }

  function toBeNaN(options?: UntilToMatchOptions) {
    return toMatch(Number.isNaN, options)
  }

  function toContains(
    value: any,
    options?: UntilToMatchOptions,
  ) {
    return toMatch((v) => {
      const array = Array.from(v as any)
      return array.includes(value) || array.includes(resolveUnref(value))
    }, options)
  }

  function changed(options?: UntilToMatchOptions) {
    return changedTimes(1, options)
  }

  function changedTimes(n = 1, options?: UntilToMatchOptions) {
    let count = -1 // skip the immediate check
    return toMatch(() => {
      count += 1
      return count >= n
    }, options)
  }

  if (Array.isArray(resolveUnref(r))) {
    const instance: UntilArrayInstance<T> = {
      toMatch,
      toContains,
      changed,
      changedTimes,
      get not() {
        return createUntil(r, !isNot) as UntilArrayInstance<T>
      },
    }
    return instance
  }
  else {
    const instance: UntilValueInstance<T, boolean> = {
      toMatch,
      toBe,
      toBeTruthy: toBeTruthy as any,
      toBeNull: toBeNull as any,
      toBeNaN,
      toBeUndefined: toBeUndefined as any,
      changed,
      changedTimes,
      get not() {
        return createUntil(r, !isNot) as UntilValueInstance<T, boolean>
      },
    }

    return instance
  }
}

/**
 * Promised one-time watch for changes
 *
 * @see https://vueuse.org/until
 * @example
 * ```
 * const { count } = useCounter()
 *
 * await until(count).toMatch(v => v > 7)
 *
 * alert('Counter is now larger than 7!')
 * ```
 */
export function until<T extends unknown[]>(r: WatchSource<T> | MaybeComputedRef<T>): UntilArrayInstance<T>
export function until<T>(r: WatchSource<T> | MaybeComputedRef<T>): UntilValueInstance<T>
export function until<T>(r: any): UntilValueInstance<T> | UntilArrayInstance<T> {
  return createUntil(r)
}
