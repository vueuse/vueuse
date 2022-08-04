import type { ComputedRef, Ref, WatchOptions, WatchSource } from 'vue-demi'

/**
 * Any function
 */
export type Fn = () => void

/**
 * A ref that allow to set null or undefined
 */
export type RemovableRef<T> = Omit<Ref<T>, 'value'> & {
  get value(): T
  set value(value: T | null | undefined)
}

/**
 * @deprecated Use `RemovableRef`
 */
export type RemoveableRef<T> = RemovableRef<T>

/**
 * Maybe it's a ref, or a plain value
 *
 * ```ts
 * type MaybeRef<T> = T | Ref<T>
 * ```
 */
export type MaybeRef<T> = T | Ref<T>

/**
 * Maybe it's a ref, or a plain value, or a getter function
 *
 * ```ts
 * type MaybeComputedRef<T> = T | Ref<T> | (() => T)
 * ```
 */
export type MaybeComputedRef<T> = (() => T) | T | Ref<T> | ComputedRef<T>

/**
 * Make all the nested attributes of an object or array to MaybeRef<T>
 *
 * Good for accepting options that will be wrapped with `reactive` or `ref`
 *
 * ```ts
 * UnwrapRef<DeepMaybeRef<T>> === T
 * ```
 */
export type DeepMaybeRef<T> = T extends Ref<infer V>
  ? MaybeRef<V>
  : T extends Array<any> | object
    ? { [K in keyof T]: DeepMaybeRef<T[K]> }
    : MaybeRef<T>

/**
 * Infers the element type of an array
 */
export type ElementOf<T> = T extends (infer E)[] ? E : never

export type ShallowUnwrapRef<T> = T extends Ref<infer P> ? P : T

export type Awaitable<T> = Promise<T> | T

export type ArgumentsType<T> = T extends (...args: infer U) => any ? U : never

export interface Pausable {
  /**
   * A ref indicate whether a pusable instance is active
   */
  isActive: Ref<boolean>

  /**
   * Temporary pause the effect from executing
   */
  pause: Fn

  /**
   * Resume the effects
   */
  resume: Fn
}

export interface Stoppable {
  /**
   * A ref indicate whether a stoppable instance is executing
   */
  isPending: Ref<boolean>

  /**
   * Stop the effect from executing
   */
  stop: Fn

  /**
   * Start the effects
   */
  start: Fn
}

/**
 * @deprecated Use `Stoppable`
 */
export type Stopable = Stoppable

export interface ConfigurableFlush {
  /**
   * Timing for monitoring changes, refer to WatchOptions for more details
   *
   * @default 'pre'
   */
  flush?: WatchOptions['flush']
}

export interface ConfigurableFlushSync {
  /**
   * Timing for monitoring changes, refer to WatchOptions for more details.
   * Unlike `watch()`, the default is set to `sync`
   *
   * @default 'sync'
   */
  flush?: WatchOptions['flush']
}

// Internal Types
export type MapSources<T> = {
  [K in keyof T]: T[K] extends WatchSource<infer V> ? V : never;
}
export type MapOldSources<T, Immediate> = {
  [K in keyof T]: T[K] extends WatchSource<infer V> ? Immediate extends true ? V | undefined : V : never;
}
