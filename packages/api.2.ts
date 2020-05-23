import Vue from 'vue'
import CompositionAPI, { watch as v2Watch, Ref } from '@vue/composition-api'

export * from '@vue/composition-api'

export const version = 2

export function init() {
  Vue.use(CompositionAPI)
}

// Ployfill for '@vue/composition-api'
// Should be removed after https://github.com/vuejs/composition-api/pull/300 gets merged
type CleanupRegistertor = (invalidate: () => void) => void
declare type WatcherSource<T> = Ref<T> | (() => T)
type WatcherCallBack<T> = (newVal: T, oldVal: T, onCleanup: CleanupRegistertor) => void
type FlushMode = 'pre' | 'post' | 'sync'
export function watch<T>(
  source: WatcherSource<T>,
  cb: WatcherCallBack<T>, options?: {
    immediate?: boolean
    deep?: boolean
    flush?: FlushMode
  }) {
  return v2Watch(
    source,
    cb,
    {
      ...options,
      lazy: options?.immediate !== true,
    })
}
