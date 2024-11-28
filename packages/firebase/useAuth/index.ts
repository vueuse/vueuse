import type { Auth, User } from 'firebase/auth'
import type { ComputedRef, Ref } from 'vue'
import { computed, ref } from 'vue'

export interface UseFirebaseAuthOptions {
  isAuthenticated: ComputedRef<boolean>
  user: Ref<User | null>
}

/**
 * Reactive Firebase Auth binding
 *
 * @see https://vueuse.org/useAuth
 */
export function useAuth(auth: Auth) {
  const user = ref<User | null>(auth.currentUser)
  const isAuthenticated = computed(() => !!user.value)

  auth.onIdTokenChanged(authUser => user.value = authUser)

  return {
    isAuthenticated,
    user,
  }
}
