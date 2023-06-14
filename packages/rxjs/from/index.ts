import { Observable, fromEvent as fromEventRx, from as fromRxjs } from 'rxjs'
import type { ObservableInput, Subscription } from 'rxjs'
import type { Ref, WatchOptions } from 'vue-demi'
import type { MaybeRef } from '@vueuse/shared'
import { isRef, watch } from 'vue-demi'

export function from<T>(value: ObservableInput<T> | Ref<T>, watchOptions?: WatchOptions): Observable<T> {
  if (isRef<T>(value))
    return new Observable(subscriber => watch(value, val => subscriber.next(val), watchOptions))

  return fromRxjs(value)
}

export function fromEvent<T extends HTMLElement>(value: MaybeRef<T>, event: string): Observable<Event> {
  if (isRef<T>(value)) {
    return new Observable((subscriber) => {
      let innerSub: Subscription | undefined
      return watch(value, (element) => {
        innerSub?.unsubscribe()
        if (element instanceof HTMLElement) {
          innerSub = fromEventRx(element, event).subscribe(subscriber)
          subscriber.add(innerSub)
        }
      }, { immediate: true })
    })
  }
  return fromEventRx(value, event)
}
