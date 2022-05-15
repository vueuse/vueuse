import type { Observable } from 'rxjs'
import type { Ref, UnwrapRef } from 'vue-demi'
import { ref } from 'vue-demi'
import { tryOnScopeDispose } from '@vueuse/shared'

export interface UseObservableOptions<I> {
  onError?: (err: any) => void
  /**
   * The value that should be set if the observable has not emitted.
   */
  initialValue?: I | undefined
}

export function useObservable<H, I = undefined>(
  observable: Observable<H>,
  options?: UseObservableOptions<I | undefined>): Readonly<Ref<H | I>> {
  const value = ref<H | I | undefined>(options?.initialValue)
  const subscription = observable.subscribe({
    next: val => (value.value = (val as UnwrapRef<H>)),
    error: options?.onError,
  })
  tryOnScopeDispose(() => {
    subscription.unsubscribe()
  })
  return value as Readonly<Ref<H | I>>
}
