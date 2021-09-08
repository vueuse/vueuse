import { from as fromRxjs, fromEvent as fromEventRx, Observable } from 'rxjs'
import type { ObservableInput } from 'rxjs'
import { filter, mergeMap } from 'rxjs/operators'
import { Ref, isRef, watch } from 'vue-demi'

export function from<T>(value: ObservableInput<T> | Ref<T>): Observable<T> {
  if (isRef<T>(value)) {
    return new Observable((subscriber) => {
      watch(value, val => subscriber.next(val))
    })
  }
  else {
    return fromRxjs(value)
  }
}

export function fromEvent<T extends HTMLElement>(value: Ref<T>, event: string): Observable<Event> {
  return from(value).pipe(
    filter(value => value instanceof HTMLElement),
    mergeMap(value => fromEventRx(value, event)),
  )
}
