import { Observable } from 'rxjs'
import { Ref, ref } from 'vue-demi'
import { tryOnUnmounted } from '@vueuse/shared'

export function useObservable<H>(observable: Observable<H>): { out: Readonly<Ref<H>>, onError: (cb: (err: any) => void) => void } {
  const out = ref<H | undefined>()
  const errorHandlers = new Set<(err: any) => void>()

  const subscription = observable.subscribe({
    next: val => (out.value = val),
    error: err => {
      if (errorHandlers.size) {
        errorHandlers.forEach(cb => cb(err))
      } else {
        // Allow RxJS to treat the error as unhandled, as it normally would
        // with no error handling provided.
        throw err
      }
    }
  })

  subscription.add(() => {
    // Ensure that our error handlers are cleaned up when our subscription is done.
    errorHandlers.clear();
  });

  tryOnUnmounted(() => {
    subscription.unsubscribe()
  })

  const onError = (cb: (err: any) => void) => {
    errorHandlers.add(cb);
  }

  return {
    out: out as Readonly<Ref<H>>,
    onError
  }
}
