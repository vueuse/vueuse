import { Observable, fromEvent as fromEventRx, from as fromRxjs } from 'rxjs'
import type { ObservableInput } from 'rxjs'
import { filter, mergeMap } from 'rxjs/operators'
import type { Ref, WatchOptions } from 'vue-demi'
import type { MaybeRef } from '@vueuse/shared'
import { isRef, watch } from 'vue-demi'

export function from<T>(value: ObservableInput<T> | Ref<T>, watchOptions?: WatchOptions): Observable<T> {
  if (isRef<T>(value)) {
    return new Observable((subscriber) => {
      const watchStopHandle = watch(value, val => subscriber.next(val), watchOptions)

      return () => {
        watchStopHandle()
      }
    })
  }
  else {
    return fromRxjs(value)
  }
}

export function fromEvent<T extends HTMLElement>(value: MaybeRef<T>, event: string): Observable<Event> {
  if (isRef<T>(value)) {
    return from(value, { immediate: true }).pipe(
      filter(value => value instanceof HTMLElement),
      mergeMap(value => fromEventRx(value, event)),
    )
  }
  return fromEventRx(value, event)
}
