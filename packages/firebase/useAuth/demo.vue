<script setup lang="ts">
import firebase from 'firebase/app'

import { computed } from 'vue'
import { stringify } from '@vueuse/docs-utils'
import { useAuth } from '.'
import { reactive } from 'vue-demi'

if (!firebase.apps.length) {
  firebase.initializeApp({
    apiKey: 'AIzaSyBcgy5ezJoYC1Ed7uwstgy9x5pR5nrv6Q8',
    authDomain: 'vueuse-auth.firebaseapp.com',
    projectId: 'vueuse-auth',
    appId: '1:427098374862:web:03a9f3a301faceccc4069f',
  })
}

const { signInWithPopup, signOut } = firebase.auth()
const { isAuthenticated, authenticationStatus, user } = useAuth(firebase)

const userData = computed(() => {
  if (user.value) {
    return {
      uid: user.value.uid,
      email: user.value.email,
      displayName: user.value.displayName,
    }
  }

  return null
})

const signin = () => {
  signInWithPopup(new firebase.auth.GoogleAuthProvider())
}

const signout = () => {
  signOut()
}

const data = stringify(reactive({
  authenticationStatus,
  isAuthenticated,
  user: userData,
}))

</script>

<template>
  <div>
    <pre>{{ data }}</pre>
    <div v-if="!isAuthenticated">
      <button class="space-x-2" @click="signin">
        <mdi-google />Sign In with Google
      </button>
    </div>
    <div v-else>
      <button @click="signout()">
        <mdi-exit-to-app />
        Sign Out
      </button>
    </div>
  </div>
</template>
