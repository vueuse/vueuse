import { computed, ComputedRef, ref, Ref } from 'vue-demi'
import { Auth, onIdTokenChanged, User } from 'firebase/auth'

export interface FirebaseAuthOptions {
  isAuthenticated: ComputedRef<boolean>
  user: Ref<User | null>
}

export function useAuth(authInstance: Auth) {
  let auth: Auth

  if (authInstance instanceof Function)
    auth = authInstance()
  else
    auth = authInstance

  const user = ref<User | null>(auth.currentUser)
  const isAuthenticated = computed(() => !!user.value)

  onIdTokenChanged(auth, authUser => user.value = authUser)

  return {
    isAuthenticated,
    user,
  }
}
