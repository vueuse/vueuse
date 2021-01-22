<<<<<<< HEAD
import { WatchOptions, watch, WatchSource, isRef } from 'vue-demi'
import { promiseTimeout } from '../utils'
=======
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
>>>>>>> 4f558b9a2dea5f5f3ddc2b34ae605d95177ad22e

export interface WhenToMatchOptions {
  flush?: WatchOptions['flush']
  timeout?: number
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

export interface BaseWhenInstance<T> {
  toMatch(
    condition: (v: T) => boolean,
    options?: WhenToMatchOptions
  ): Promise<void>
  changed(options?: WhenToMatchOptions): Promise<void>
  changedTimes(n?: number, options?: WhenToMatchOptions): Promise<void>
}

<<<<<<< HEAD
export interface BaseWhenInstance<T> {
  toMatch(
    condition: (v: T) => boolean,
    options?: WhenToMatchOptions
  ): Promise<void>
  changed(options?: WhenToMatchOptions): Promise<void>
  changedTimes(n?: number, options?: WhenToMatchOptions): Promise<void>
}

export interface RefWhenInstance<T> extends BaseWhenInstance<T> {
  readonly not: RefWhenInstance<T>

  toBe<P>(value: P | T, options?: WhenToMatchOptions): Promise<void>
=======
export interface ValueWhenInstance<T> extends BaseWhenInstance<T> {
  readonly not: ValueWhenInstance<T>

  toBe<P = T>(value: MaybeRef<T | P>, options?: WhenToMatchOptions): Promise<void>
>>>>>>> 4f558b9a2dea5f5f3ddc2b34ae605d95177ad22e
  toBeTruthy(options?: WhenToMatchOptions): Promise<void>
  toBeNull(options?: WhenToMatchOptions): Promise<void>
  toBeUndefined(options?: WhenToMatchOptions): Promise<void>
  toBeNaN(options?: WhenToMatchOptions): Promise<void>
<<<<<<< HEAD
}
export interface RecordWhenInstance<T> extends BaseWhenInstance<T> {
  readonly not: RecordWhenInstance<T>
}
export interface ArrayWhenInstance<T> extends BaseWhenInstance<T> {
  readonly not: ArrayWhenInstance<T>

  toContain<P>(value: P, options?: WhenToMatchOptions): Promise<void>
}

export function when<T>(r: WatchSource<T>): RefWhenInstance<T>
export function when<T extends { [key: string]: unknown }>(
  r: T
): RecordWhenInstance<T>
export function when<T extends unknown[]>(r: T): ArrayWhenInstance<T>
=======
}

export interface ArrayWhenInstance<T> extends BaseWhenInstance<T> {
  readonly not: ArrayWhenInstance<T>

  toContains(value: MaybeRef<ElementOf<ShallowUnwrapRef<T>>>, options?: WhenToMatchOptions): Promise<void>
}

export function when<T extends unknown[]>(r: T): ArrayWhenInstance<T>
export function when<T extends Ref<unknown[]>>(r: T): ArrayWhenInstance<T>
export function when<T>(r: WatchSource<T>): ValueWhenInstance<T>
export function when<T>(r: T): ValueWhenInstance<T>
>>>>>>> 4f558b9a2dea5f5f3ddc2b34ae605d95177ad22e
export function when<T>(r: any): any {
  let isNot = false

  function toMatch(
<<<<<<< HEAD
    condition: (v: T | object) => boolean,
    { flush = 'sync', timeout, throwOnTimeout }: WhenToMatchOptions = {},
=======
    condition: (v: any) => boolean,
    { flush = 'sync', deep = false, timeout, throwOnTimeout }: WhenToMatchOptions = {},
>>>>>>> 4f558b9a2dea5f5f3ddc2b34ae605d95177ad22e
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
<<<<<<< HEAD
=======
          deep,
>>>>>>> 4f558b9a2dea5f5f3ddc2b34ae605d95177ad22e
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

<<<<<<< HEAD
  type ElementOf<T> = T extends (infer E)[] ? E : never
  function toContain<P extends ElementOf<T>>(
    value: P,
=======
  function toContains(
    value: any,
>>>>>>> 4f558b9a2dea5f5f3ddc2b34ae605d95177ad22e
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

<<<<<<< HEAD
  if (isRef(r)) {
    return {
      toMatch,
      toBe,
      toBeTruthy,
      toBeNull,
      toBeNaN,
      toBeUndefined,
=======
  if (Array.isArray(unref(r))) {
    const instance: ArrayWhenInstance<T> = {
      toMatch,
      toContains,
>>>>>>> 4f558b9a2dea5f5f3ddc2b34ae605d95177ad22e
      changed,
      changedTimes,
      get not() {
        isNot = !isNot
        return this
      },
    }
<<<<<<< HEAD
  }

  if (Array.isArray(r)) {
    return {
      toMatch,
      toContain,
=======
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
>>>>>>> 4f558b9a2dea5f5f3ddc2b34ae605d95177ad22e
      changed,
      changedTimes,
      get not() {
        isNot = !isNot
        return this
      },
    }
<<<<<<< HEAD
  }

  return {
    toMatch,
    changed,
    changedTimes,
    get not() {
      isNot = !isNot
      return this
    },
=======

    return instance
>>>>>>> 4f558b9a2dea5f5f3ddc2b34ae605d95177ad22e
  }
}
