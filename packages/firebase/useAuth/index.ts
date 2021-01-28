import { computed, ComputedRef, ref, Ref } from 'vue'
import type firebase from 'firebase'
import 'firebase/auth'

export enum FirebaseAuthStatus {
  Pending = 'pending',
  Authenticated = 'authenticated',
  Unauthenticated = 'unauthenticated',
}

export interface FirebaseAuthOptions {
  authenticationStatus: Ref<FirebaseAuthStatus>
  isAuthenticated: ComputedRef<boolean>
  user: Ref<firebase.User | null>
}

export function useAuth(instance: typeof firebase): UseAuth {
  const authenticationStatus = ref<FirebaseAuthStatus>(FirebaseAuthStatus.Pending)
  const isAuthenticated = computed(() => authenticationStatus.value === FirebaseAuthStatus.Authenticated)
  const user = ref<firebase.User | null>(null)

  const { auth } = instance

  // Initial check to see if user is signed in
  if (instance.auth().currentUser)
    authenticationStatus.value = FirebaseAuthStatus.Authenticated
  else
    authenticationStatus.value = FirebaseAuthStatus.Unauthenticated

  instance
    .auth()
    .onIdTokenChanged((authUser) => {
      if (authUser) {
        user.value = authUser
        authenticationStatus.value = FirebaseAuthStatus.Authenticated
      }
      else {
        user.value = null
        authenticationStatus.value = FirebaseAuthStatus.Unauthenticated
      }
    })

  return {
    authenticationStatus,
    isAuthenticated,
    user,
  }
}
