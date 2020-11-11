import { Ref, WatchSource } from 'vue-demi'

export type Fn = () => void

export type MaybeRef<T> = T | Ref<T>

// Internal Types
export type MapSources<T> = {
  [K in keyof T]: T[K] extends WatchSource<infer V> ? V : never;
}
export type MapOldSources<T, Immediate> = {
  [K in keyof T]: T[K] extends WatchSource<infer V> ? Immediate extends true ? V | undefined : V : never;
}
