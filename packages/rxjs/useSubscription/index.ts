import type { Subscription } from 'rxjs'
import { tryOnUnmounted } from '../../core/utils'

export function useSubscription(
  subscription: Subscription,
) {
  tryOnUnmounted(() => {
    subscription.unsubscribe()
  })
}
