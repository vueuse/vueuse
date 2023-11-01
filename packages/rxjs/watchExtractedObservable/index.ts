import type { WatchOptions, WatchSource, WatchStopHandle } from 'vue-demi'
import { watch } from 'vue-demi'
import type { Observable, Subscription } from 'rxjs'
import type { MapOldSources, MapSources, MultiWatchSources } from '@vueuse/shared'
import { tryOnScopeDispose } from '@vueuse/shared'

export type OnCleanup = (cleanupFn: () => void) => void
export type WatchExtractedObservableCallback<Value, OldValue, ObservableElement> = (value: NonNullable<Value>, oldValue: OldValue, onCleanup: OnCleanup) => Observable<ObservableElement>

export interface WatchExtractedObservableOptions {
  onError?: (err: unknown) => void
  onComplete?: () => void
}

// overload: array of multiple sources + cb
export function watchExtractedObservable<
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
  callback: (snapshot: E) => void,
  subscriptionOptions?: WatchExtractedObservableOptions,
  watchOptions?: WatchOptions<Immediate>
): WatchStopHandle

// overload: multiple sources w/ `as const`
// watch([foo, bar] as const, () => {})
// somehow [...T] breaks when the type is readonly
export function watchExtractedObservable<
  T extends Readonly<MultiWatchSources>,
  E,
  Immediate extends Readonly<boolean> = false,
>(
  source: T,
  extractor: WatchExtractedObservableCallback<
    MapSources<T>,
    MapOldSources<T, Immediate>,
    E
  >,
  callback: (snapshot: E) => void,
  subscriptionOptions?: WatchExtractedObservableOptions,
  watchOptions?: WatchOptions<Immediate>
): WatchStopHandle

// overload: single source + cb
export function watchExtractedObservable<
  T,
  E,
  Immediate extends Readonly<boolean> = false,
>(
  source: WatchSource<T>,
  extractor: WatchExtractedObservableCallback<
    T,
    Immediate extends true ? T | undefined : T,
    E
  >,
  callback: (snapshot: E) => void,
  subscriptionOptions?: WatchExtractedObservableOptions,
  watchOptions?: WatchOptions<Immediate>
): WatchStopHandle

// overload: watching reactive object w/ cb
export function watchExtractedObservable<
  T extends object,
  E,
  Immediate extends Readonly<boolean> = false,
>(
  source: T,
  extractor: WatchExtractedObservableCallback<
    T,
    Immediate extends true ? T | undefined : T,
    E
  >,
  callback: (snapshot: E) => void,
  subscriptionOptions?: WatchExtractedObservableOptions,
  watchOptions?: WatchOptions<Immediate>
): WatchStopHandle

// implementation
export function watchExtractedObservable<T = any, E = unknown, Immediate extends Readonly<boolean> = false>(
  source: T | WatchSource<T>,
  extractor: WatchExtractedObservableCallback<any, any, E>,
  callback: (snapshot: E) => void,
  subscriptionOptions?: WatchExtractedObservableOptions,
  watchOptions?: WatchOptions<Immediate>,
): WatchStopHandle {
  let subscription: Subscription | undefined

  tryOnScopeDispose(() => {
    subscription?.unsubscribe()

    // Set to undefined to avoid calling unsubscribe multiple times on a same subscription
    subscription = undefined
  })

  return watch(source as any, (value, oldValue, onCleanup) => {
    subscription?.unsubscribe()

    if (typeof value !== 'undefined' && value !== null) {
      const observable = extractor(value, oldValue, onCleanup)
      subscription = observable.subscribe({
        next: callback,
        error: subscriptionOptions?.onError,
        complete: subscriptionOptions?.onComplete,
      })
    }
    else {
      // Set to undefined to avoid calling unsubscribe multiple times on a same subscription
      subscription = undefined
    }
  }, watchOptions)
}
