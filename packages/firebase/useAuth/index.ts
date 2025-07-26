import type { Auth, User } from 'firebase/auth'
import type { ComputedRef, Ref } from 'vue'
import { computed, ref as deepRef } from 'vue'

export interface UseFirebaseAuthOptions {
  isAuthenticated: ComputedRef<boolean>
  user: Ref<User | null>
}

/**
 * Reactive Firebase Auth binding
 *
 * @see https://vueuse.org/useAuth
 *
 * @__NO_SIDE_EFFECTS__
 */
export function useAuth(auth: Auth) {
  const user = deepRef<User | null>(auth.currentUser)
  const isAuthenticated = computed(() => !!user.value)

  auth.onIdTokenChanged(authUser => user.value = authUser)

  return {
    isAuthenticated,
    user,
  }
}
