import { computed, ComputedRef, ref, Ref } from 'vue-demi'
import firebase from 'firebase'

export interface FirebaseAuthOptions {
  isAuthenticated: ComputedRef<boolean>
  user: Ref<firebase.User | null>
}

export function useAuth(authInstance?: typeof firebase.auth | firebase.auth.Auth) {
  let auth: firebase.auth.Auth

  if (authInstance) {
    if (authInstance instanceof Function)
      auth = authInstance()
    else
      auth = authInstance
  }
  else {
    auth = firebase.auth()
  }

  const user = ref<firebase.User | null>(auth.currentUser)
  const isAuthenticated = computed(() => !!user.value)

  auth.onIdTokenChanged(authUser => user.value = authUser)

  return {
    isAuthenticated,
    user,
  }
}
