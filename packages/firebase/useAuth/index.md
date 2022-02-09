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

const { GoogleAuthProvider } = firebase.auth

const { isAuthenticated, user } = useAuth(firebase.auth)

const signIn = () => firebase.auth().signInWithPopup(new GoogleAuthProvider())
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
