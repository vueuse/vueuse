import type { Unsubscribable } from 'rxjs'
import { tryOnUnmounted } from '@vueuse/shared'

export function useSubscription(
  subscription: Unsubscribable,
) {
  tryOnUnmounted(() => {
    subscription.unsubscribe()
  })
}
