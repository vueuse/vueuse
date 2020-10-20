import type { Subscription } from 'rxjs'
import { tryOnUnmounted } from '@vueuse/shared'

export function useSubscription(
  subscription: Subscription,
) {
  tryOnUnmounted(() => {
    subscription.unsubscribe()
  })
}
