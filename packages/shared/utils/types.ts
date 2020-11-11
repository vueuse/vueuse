import { Ref, WatchSource } from 'vue-demi'

export type Fn = () => void

export type MaybeRef<T> = T | Ref<T>

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

// Internal Types
export type MapSources<T> = {
  [K in keyof T]: T[K] extends WatchSource<infer V> ? V : never;
}
export type MapOldSources<T, Immediate> = {
  [K in keyof T]: T[K] extends WatchSource<infer V> ? Immediate extends true ? V | undefined : V : never;
}
