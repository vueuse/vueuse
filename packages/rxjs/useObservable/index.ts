import { Observable } from 'rxjs'
import { Ref, ref } from 'vue-demi'
import { tryOnScopeDispose } from '@vueuse/shared'

export interface UseObservableOptions {
  onError?: (err: any) => void
}

export function useObservable<H>(observable: Observable<H>, options?: UseObservableOptions): Readonly<Ref<H>> {
  const value = ref<H | undefined>()
  const subscription = observable.subscribe({
    next: val => (value.value = val),
    error: options?.onError,
  })
  tryOnScopeDispose(() => {
    subscription.unsubscribe()
  })
  return value as Readonly<Ref<H>>
}
