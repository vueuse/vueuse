---
category: '@Firebase'
---

# useAuth

Reactive [Firebase Auth](https://firebase.google.com/docs/auth) binding. It provides a reactive `user` and `isAuthenticated` so you
can easily react to changes in the users authentication status. 

## Usage

```html
<script setup lang="ts">
import firebase from 'firebase'
import { useAuth } from '.'

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

Using a different firebaes auth instance
```ts
import firebase from 'firebase'
const { isAuthenticated, user } = useAuth(firebase.auth) // or userAuth(firebase.auth())
```

<!--FOOTER_STARTS-->
## Type Declarations
```ts
export interface FirebaseAuthOptions {
  isAuthenticated: ComputedRef<boolean>
  user: Ref<firebase.User | null>
}

export declare function useAuth(): FirebaseAuthOptions
export declare function useAuth(authInstance?: typeof firebase.auth | firebase.auth.Auth): FirebaseAuthOptions
```

## Source

[Source](https://github.com/vueuse/vueuse/blob/master/packages/firebase/useAuth/index.ts) • [Docs](https://github.com/vueuse/vueuse/blob/master/packages/firebase/useAuth/index.md) • [Demo](https://github.com/vueuse/vueuse/blob/master/packages/firebase/useAuth/demo.vue)

<!--FOOTER_ENDS-->
