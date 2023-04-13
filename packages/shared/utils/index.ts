export * from './is'
export * from './filters'
export * from './types'
export * from './compatibility'

export function promiseTimeout(
  ms: number,
  throwOnTimeout = false,
  reason = 'Timeout',
): Promise<void> {
  return new Promise((resolve, reject) => {
    if (throwOnTimeout)
      setTimeout(() => reject(reason), ms)
    else
      setTimeout(resolve, ms)
  })
}

export function identity<T>(arg: T): T {
  return arg
}

export interface SingletonPromiseReturn<T> {
  (): Promise<T>
  /**
   * Reset current staled promise.
   * await it to have proper shutdown.
   */
  reset: () => Promise<void>
}

/**
 * Create singleton promise function
 *
 * @example
 * ```
 * const promise = createSingletonPromise(async () => { ... })
 *
 * await promise()
 * await promise() // all of them will be bind to a single promise instance
 * await promise() // and be resolved together
 * ```
 */
export function createSingletonPromise<T>(fn: () => Promise<T>): SingletonPromiseReturn<T> {
  let _promise: Promise<T> | undefined

  function wrapper() {
    if (!_promise)
      _promise = fn()
    return _promise
  }
  wrapper.reset = async () => {
    const _prev = _promise
    _promise = undefined
    if (_prev)
      await _prev
  }

  return wrapper
}

export function invoke<T>(fn: () => T): T {
  return fn()
}

export function containsProp(obj: object, ...props: string[]) {
  return props.some(k => k in obj)
}

/**
 * Increase string a value with unit
 *
 * @example '2px' + 1 = '3px'
 * @example '15em' + (-2) = '13em'
 */
export function increaseWithUnit(target: number, delta: number): number
export function increaseWithUnit(target: string, delta: number): string
export function increaseWithUnit(target: string | number, delta: number): string | number
export function increaseWithUnit(target: string | number, delta: number): string | number {
  if (typeof target === 'number')
    return target + delta
  const value = target.match(/^-?[0-9]+\.?[0-9]*/)?.[0] || ''
  const unit = target.slice(value.length)
  const result = (parseFloat(value) + delta)
  if (Number.isNaN(result))
    return target
  return result + unit
}

/**
 * Create a new subset object by giving keys
 *
 * @category Object
 */
export function objectPick<O extends object, T extends keyof O>(obj: O, keys: T[], omitUndefined = false) {
  return keys.reduce((n, k) => {
    if (k in obj) {
      if (!omitUndefined || obj[k] !== undefined)
        n[k] = obj[k]
    }
    return n
  }, {} as Pick<O, T>)
}

export function objectEntries<T extends object>(obj: T) {
  return Object.entries(obj) as Array<[keyof T, T[keyof T]]>
}
