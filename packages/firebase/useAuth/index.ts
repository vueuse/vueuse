import { computed, ComputedRef, ref, Ref } from 'vue'
import type firebase from 'firebase'
import 'firebase/auth'

export enum FirebaseAuthStatus {
  Pending = 'pending',
  Authenticated = 'authenticated',
  Unauthenticated = 'unauthenticated',
}

interface UseAuth {
  authenticationStatus: Ref<FirebaseAuthStatus>
  isAuthenticated: ComputedRef<boolean>
  user: Ref<firebase.User | null>

  signInAnonymously(): Promise<firebase.auth.UserCredential>
  signInWithCredential(credential: firebase.auth.AuthCredential): Promise<firebase.auth.UserCredential>
  signInWithCustomToken(token: string): Promise<firebase.auth.UserCredential>
  signInWithEmailAndPassword(email: string, password: string): Promise<firebase.auth.UserCredential>
  signInWithEmailLink(email: string, emailLink?: string | undefined): Promise<firebase.auth.UserCredential>
  signInWithPhoneNumber(phoneNumber: string, applicationVerifier: firebase.auth.ApplicationVerifier): Promise<firebase.auth.ConfirmationResult>
  signInWithRedirect(provider: firebase.auth.AuthProvider): Promise<void>
  signInWithPopup(provider: firebase.auth.AuthProvider): Promise<firebase.auth.UserCredential>
  signOut(): Promise<void>
  createUserWithEmailAndPassword(email: string, password: string): void
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

    signInAnonymously() { return auth().signInAnonymously() },
    signInWithCredential(credential: firebase.auth.AuthCredential) { return auth().signInWithCredential(credential) },
    signInWithCustomToken(token: string) { return auth().signInWithCustomToken(token) },
    signInWithEmailAndPassword(email: string, password: string) { return auth().signInWithEmailAndPassword(email, password) },
    signInWithEmailLink(email: string, emailLink?: string | undefined) { return auth().signInWithEmailLink(email, emailLink) },
    signInWithPhoneNumber(phoneNumber: string, applicationVerifier: firebase.auth.ApplicationVerifier) { return auth().signInWithPhoneNumber(phoneNumber, applicationVerifier) },
    signInWithRedirect(provider: firebase.auth.AuthProvider) { return auth().signInWithRedirect(provider) },
    signInWithPopup(provider: firebase.auth.AuthProvider) { return auth().signInWithPopup(provider) },
    signOut() { return auth().signOut() },
    createUserWithEmailAndPassword(email: string, password: string) { return auth().createUserWithEmailAndPassword(email, password) },
  }
}
