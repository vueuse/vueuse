---
category: '@Firebase 9'
---

# useAuth

Reactive [Firebase Auth](https://firebase.google.com/docs/auth) binding. It provides a reactive `user` and `isAuthenticated` so you
can easily react to changes in the users' authentication status.

## Usage

```html
<script setup lang="ts">
import { initializeApp } from 'firebase/app'
import { getAuth, signInWithPopup, GoogleAuthProvider } from 'firebase/auth'
import { useAuth } from '@vueuse/firebase/useAuth'

const app = initializeApp({ projectId: 'MY PROJECT ID' })
const auth = getAuth(app)

const { isAuthenticated, user } = useAuth(firebase.auth)

const signIn = () => signInWithPopup(new GoogleAuthProvider())
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
