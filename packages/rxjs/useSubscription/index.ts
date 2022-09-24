import type { Unsubscribable } from 'rxjs'
import { tryOnScopeDispose } from '@vueuse/shared'

export function useSubscription(
  subscription: Unsubscribable,
) {
  tryOnScopeDispose(() => {
    subscription.unsubscribe()
  })
}
