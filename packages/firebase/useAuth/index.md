---
category: '@Firebase'
---

# useAuth

Reactive [Firebase Auth](https://firebase.google.com/docs/auth) binding. It provides a reactive `user` and `isAuthenticated` so you
can easily react to changes in the users' authentication status.

## Usage

```vue
<script setup lang="ts">
import { useAuth } from '@vueuse/firebase/useAuth'
import { initializeApp } from 'firebase/app'
import { getAuth, GoogleAuthProvider, signInWithPopup } from 'firebase/auth'

const app = initializeApp({ /* config */ })
const auth = getAuth(app)
const { isAuthenticated, user } = useAuth(auth)

const signIn = () => signInWithPopup(auth, new GoogleAuthProvider())
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

## Return Values

| Name              | Type                   | Description                                               |
| ----------------- | ---------------------- | --------------------------------------------------------- |
| `user`            | `Ref<User \| null>`    | The current Firebase user, or `null` if not authenticated |
| `isAuthenticated` | `ComputedRef<boolean>` | Whether a user is currently authenticated                 |

The composable automatically updates when the user's ID token changes (including sign-in, sign-out, and token refresh events) using Firebase's `onIdTokenChanged` listener.
