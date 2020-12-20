import { ComputedRef, Ref, WatchOptions, WatchSource } from 'vue-demi'

export type Fn = () => void

export type MaybeRef<T> = T | Ref<T> | ComputedRef<T>
export type ElementOf<T> = T extends (infer E)[] ? E : never
export type ShallowUnwrapRef<T> = T extends Ref<infer P> ? P : T

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
