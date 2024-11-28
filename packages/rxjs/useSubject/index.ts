import type { Subject } from 'rxjs'
import type { Ref } from 'vue'
import type { UseObservableOptions } from '../useObservable'
import { tryOnScopeDispose } from '@vueuse/shared'
import { BehaviorSubject } from 'rxjs'
import { ref, watch } from 'vue'

export interface UseSubjectOptions<I = undefined> extends Omit<UseObservableOptions<I>, 'initialValue'> {
}

export function useSubject<H>(subject: BehaviorSubject<H>, options?: UseSubjectOptions): Ref<H>
export function useSubject<H>(subject: Subject<H>, options?: UseSubjectOptions): Ref<H | undefined>
export function useSubject<H>(subject: Subject<H>, options?: UseSubjectOptions) {
  const value = ref(
    subject instanceof BehaviorSubject
      ? subject.value
      : undefined,
  ) as typeof subject extends BehaviorSubject<H> ? Ref<H> : Ref<H | undefined>

  const subscription = subject.subscribe({
    next(val) { value.value = val },
    error: options?.onError,
  })

  watch(value, (nextValue) => {
    subject.next(nextValue)
  })

  tryOnScopeDispose(() => {
    subscription.unsubscribe()
  })

  return value
}
