import { Observable } from 'rxjs'
import { Ref, ref } from 'vue-demi'
import { tryOnUnmounted } from '../../core/utils'

export function useObservable<H>(observable: Observable<H>): Readonly<Ref<H>> {
  const value = ref<H | undefined>()
  const subscription = observable.subscribe(val => (value.value = val))
  tryOnUnmounted(() => {
    subscription.unsubscribe()
  })
  return value as Readonly<Ref<H>>
}
