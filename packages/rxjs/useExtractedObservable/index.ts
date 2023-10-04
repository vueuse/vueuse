import type { MapOldSources, MapSources, MultiWatchSources } from '@vueuse/shared'
import { tryOnScopeDispose } from '@vueuse/shared'
import type { Ref, WatchOptions, WatchSource } from 'vue-demi'
import { readonly, shallowRef, watch } from 'vue-demi'
import type { Subscription } from 'rxjs'
import type { WatchExtractedObservableCallback } from '../watchExtractedObservable'
import type { UseObservableOptions } from '../useObservable'

export interface UseExtractedObservableOptions<E> extends UseObservableOptions<E> {
  onComplete?: () => void
}

// overload: array of multiple sources + cb
export function useExtractedObservable<
  T extends MultiWatchSources,
  E,
  Immediate extends Readonly<boolean> = false,
>(
  sources: [...T],
  extractor: WatchExtractedObservableCallback<
    MapSources<T>,
    MapOldSources<T, Immediate>,
    E
  >,
  options?: UseExtractedObservableOptions<E>,
  watchOptions?: WatchOptions<Immediate>,
): Readonly<Ref<E>>

// overload: multiple sources w/ `as const`
// watch([foo, bar] as const, () => {})
// somehow [...T] breaks when the type is readonly
export function useExtractedObservable<
  T extends Readonly<MultiWatchSources>,
  E,
  Immediate extends Readonly<boolean> = false,
>(
  sources: T,
  extractor: WatchExtractedObservableCallback<
    MapSources<T>,
    MapOldSources<T, Immediate>,
    E
  >,
  options?: UseExtractedObservableOptions<E>,
  watchOptions?: WatchOptions<Immediate>,
): Readonly<Ref<E>>

// overload: single source + cb
export function useExtractedObservable<
  T,
  E,
  Immediate extends Readonly<boolean> = false,
>(
  sources: WatchSource<T>,
  extractor: WatchExtractedObservableCallback<
    T,
    Immediate extends true ? T | undefined : T,
    E
  >,
  options?: UseExtractedObservableOptions<E>,
  watchOptions?: WatchOptions<Immediate>,
): Readonly<Ref<E>>

// overload: watching reactive object w/ cb
export function useExtractedObservable<
  T extends object,
  E,
  Immediate extends Readonly<boolean> = false,
>(
  sources: T,
  extractor: WatchExtractedObservableCallback<
    T,
    Immediate extends true ? T | undefined : T,
    E
  >,
  options?: UseExtractedObservableOptions<E>,
  watchOptions?: WatchOptions<Immediate>,
): Readonly<Ref<E>>

// implementation
export function useExtractedObservable<T = any, E = unknown, Immediate extends Readonly<boolean> = false>(
  source: T | WatchSource<T>,
  extractor: WatchExtractedObservableCallback<any, any, E>,
  options?: UseExtractedObservableOptions<E>,
  watchOptions?: WatchOptions<Immediate>,
): Readonly<Ref<E>> {
  let subscription: Subscription | undefined

  tryOnScopeDispose(() => {
    subscription?.unsubscribe()

    // Set to undefined to avoid calling unsubscribe multiple times on a same subscription
    subscription = undefined
  })

  // Construct it first so that the `watch` can override the value if the observable emits immediately
  const obsRef = shallowRef<E | undefined>(options?.initialValue)

  watch(source as any, (value, oldValue, onCleanup) => {
    subscription?.unsubscribe()

    if (typeof value !== 'undefined' && value !== null) {
      const observable = extractor(value, oldValue, onCleanup)
      subscription = observable.subscribe({
        error: (err) => {
          options?.onError?.(err)
        },
        complete: () => {
          options?.onComplete?.()
        },
        next: (val) => {
          obsRef.value = val
        },
      })
    }
    else {
      subscription = undefined
    }
  }, {
    immediate: true,
    ...watchOptions,
  })

  return readonly(obsRef) as Readonly<Ref<E>>
}
