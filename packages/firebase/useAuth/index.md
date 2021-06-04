---
category: '@Firebase'
---

# useAuth

Reactive [Firebase Auth](https://firebase.google.com/docs/auth) binding. It provides a reactive `user` and `isAuthenticated` so you
can easily react to changes in the users' authentication status. 

## Usage

```html
<script setup lang="ts">
import firebase from 'firebase'
import { useAuth } from '@vueuse/firebase/useAuth'

const { auth } = firebase
const { GoogleAuthProvider } = auth

const { isAuthenticated, user } = useAuth()

const signIn = () => auth().signInWithPopup(new GoogleAuthProvider())
</script>

<template>
  <pre v-if="isAuthenticated">{{ user }}</pre>
  <div v-else>
    <button @click="signIn">
      Sign In with Google
    </button>
  </div>
</template>
```

Using a different firebase auth instance
```ts
import firebase from 'firebase'
import { useAuth } from '@vueuse/firebase/useAuth'

const { isAuthenticated, user } = useAuth(firebase.auth) // or userAuth(firebase.auth())
```

<!--FOOTER_STARTS-->
## Type Declarations

```typescript
export interface FirebaseAuthOptions {
  isAuthenticated: ComputedRef<boolean>
  user: Ref<firebase.User | null>
}
export declare function useAuth(
  authInstance?: typeof firebase.auth | firebase.auth.Auth
): {
  isAuthenticated: ComputedRef<boolean>
  user: Ref<{
    delete: () => Promise<void>
    emailVerified: boolean
    getIdTokenResult: (
      forceRefresh?: boolean | undefined
    ) => Promise<firebase.auth.IdTokenResult>
    getIdToken: (forceRefresh?: boolean | undefined) => Promise<string>
    isAnonymous: boolean
    linkAndRetrieveDataWithCredential: (
      credential: firebase.auth.AuthCredential
    ) => Promise<firebase.auth.UserCredential>
    linkWithCredential: (
      credential: firebase.auth.AuthCredential
    ) => Promise<firebase.auth.UserCredential>
    linkWithPhoneNumber: (
      phoneNumber: string,
      applicationVerifier: firebase.auth.ApplicationVerifier
    ) => Promise<firebase.auth.ConfirmationResult>
    linkWithPopup: (
      provider: firebase.auth.AuthProvider
    ) => Promise<firebase.auth.UserCredential>
    linkWithRedirect: (provider: firebase.auth.AuthProvider) => Promise<void>
    metadata: {
      creationTime?: string | undefined
      lastSignInTime?: string | undefined
    }
    multiFactor: {
      enrolledFactors: {
        uid: string
        displayName?: string | null | undefined
        enrollmentTime: string
        factorId: string
      }[]
      enroll: (
        assertion: firebase.auth.MultiFactorAssertion,
        displayName?: string | null | undefined
      ) => Promise<void>
      getSession: () => Promise<firebase.auth.MultiFactorSession>
      unenroll: (
        option: string | firebase.auth.MultiFactorInfo
      ) => Promise<void>
    }
    phoneNumber: string | null
    providerData: ({
      displayName: string | null
      email: string | null
      phoneNumber: string | null
      photoURL: string | null
      providerId: string
      uid: string
    } | null)[]
    reauthenticateAndRetrieveDataWithCredential: (
      credential: firebase.auth.AuthCredential
    ) => Promise<firebase.auth.UserCredential>
    reauthenticateWithCredential: (
      credential: firebase.auth.AuthCredential
    ) => Promise<firebase.auth.UserCredential>
    reauthenticateWithPhoneNumber: (
      phoneNumber: string,
      applicationVerifier: firebase.auth.ApplicationVerifier
    ) => Promise<firebase.auth.ConfirmationResult>
    reauthenticateWithPopup: (
      provider: firebase.auth.AuthProvider
    ) => Promise<firebase.auth.UserCredential>
    reauthenticateWithRedirect: (
      provider: firebase.auth.AuthProvider
    ) => Promise<void>
    refreshToken: string
    reload: () => Promise<void>
    sendEmailVerification: (
      actionCodeSettings?: firebase.auth.ActionCodeSettings | null | undefined
    ) => Promise<void>
    tenantId: string | null
    toJSON: () => Object
    unlink: (providerId: string) => Promise<firebase.User>
    updateEmail: (newEmail: string) => Promise<void>
    updatePassword: (newPassword: string) => Promise<void>
    updatePhoneNumber: (
      phoneCredential: firebase.auth.AuthCredential
    ) => Promise<void>
    updateProfile: (profile: {
      displayName?: string | null | undefined
      photoURL?: string | null | undefined
    }) => Promise<void>
    verifyBeforeUpdateEmail: (
      newEmail: string,
      actionCodeSettings?: firebase.auth.ActionCodeSettings | null | undefined
    ) => Promise<void>
    displayName: string | null
    email: string | null
    photoURL: string | null
    providerId: string
    uid: string
  } | null>
}
```

## Source

[Source](https://github.com/vueuse/vueuse/blob/main/packages/firebase/useAuth/index.ts) • [Docs](https://github.com/vueuse/vueuse/blob/main/packages/firebase/useAuth/index.md)


<!--FOOTER_ENDS-->
