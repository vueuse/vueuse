import { computed, ComputedRef, ref, Ref } from 'vue'
import firebase from 'firebase'
import 'firebase/auth'

export interface FirebaseAuthOptions {
  isAuthenticated: ComputedRef<boolean>
  user: Ref<firebase.User | null>
}

export function useAuth() {
  const { auth } = firebase

  const user = ref<firebase.User | null>(auth().currentUser)
  const isAuthenticated = computed(() => !!user.value)

  auth().onIdTokenChanged(authUser => user.value = authUser)

  return {
    isAuthenticated,
    user,
  }
}
