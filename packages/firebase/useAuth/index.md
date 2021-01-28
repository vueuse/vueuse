---
category: '@Firebase'
---

# useAuth

Reactive [Firebase Auth](https://firebase.google.com/docs/auth) binding 

## Usage

```html
<script setup lang="ts">
import firebase from 'firebase'
import { useAuth } from '@vueuse/firebase'

// Ensure your firebase application is initialized using `firebaes.initialize`

const { user, isAuthenticated, signInWithPopup, signOut } = useAuth(firebase)

const signin = () => {
  signInWithPopup(new firebase.auth.GoogleAuthProvider())
}

</script>

<tempalte>
  <div>
    <button v-if="!isAuthenticated" @click="signin">Sign in with Google</button>
    <div v-else>
      You are authenticated!
      <button @click="signOut()">Sign Out</button>
    </div>
  </div>
</template>
```

<!--FOOTER_STARTS-->
## Type Declarations
```ts
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

export declare function useAuth(instance: typeof firebase): UseAuth
```

## Source

[Source](https://github.com/vueuse/vueuse/blob/master/packages/firebase/useAuth/index.ts) • [Docs](https://github.com/vueuse/vueuse/blob/master/packages/firebase/useAuth/index.md) • [Demo](https://github.com/vueuse/vueuse/blob/master/packages/firebase/useAuth/demo.vue)

<!--FOOTER_ENDS-->
