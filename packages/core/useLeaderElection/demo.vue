<script setup lang="ts">
import { formatTimeAgo, useBroadcastChannel, useIntervalFn, useLeaderElection, useNow } from '@vueuse/core'
import { computed, ref, watch } from 'vue'

const { isSupported, isLeader, asLeader } = useLeaderElection({ name: 'vueuse-demo-shared-session' })
interface Session { expires: number, username: string }
const { data, post } = useBroadcastChannel<Session | null | undefined, Session | null>({ name: 'vueuse-demo-shared-session' })
const now = useNow({ interval: 1000 })
const { pause, resume, isActive } = useIntervalFn(() => {
  if (data.value === null) {
    pause()
    return
  }
  asLeader(async (signal) => {
    if (data.value === undefined || data.value!.expires > Date.now() - 1000 * 60) {
      pause()
      try {
        // const newSession = await (await fetch('/refresh/session', { signal, credentials: 'include' })).json() as Session
        const newSession = { expires: now.value.getTime() + 1000 * 60 * 2, username: 'demo-user' }
        data.value = newSession
        post(newSession)
      }
      finally {
        resume()
      }
    }
  })
})
function login() {
  const newSession = { expires: now.value.getTime() + 1000 * 60 * 2, username: 'demo-user' }
  data.value = newSession
  post(newSession)
}
function logout() {
  data.value = null
  post(null)
}
const isLoggedIn = computed(() => !!data.value?.username)
const expires = computed(() => {
  const _ = now.value
  if (data.value?.expires) {
    formatTimeAgo(new Date(data.value?.expires))
  }
  return ''
})
watch(isLeader, (leader) => {
  if (leader) {
    resume()
  }
  else {
    pause()
  }
})
const message = ref('')
</script>

<template>
  <div>
    <p>isSupported: <BooleanDisplay :value="isSupported" class="font-bold" /></p>
    <p>isLeader: <BooleanDisplay :value="isLeader" class="font-bold" /></p>
    <p>isActive: <BooleanDisplay :value="isActive" class="font-bold" /></p>
    <p>isLoggedIn: <BooleanDisplay :value="isLoggedIn" class="font-bold" /></p>
    <p>expires: {{ expires }}</p>
    <p>data: {{ data }}</p>
  </div>

  <div v-if="isSupported">
    <div class="flex gap-2">
      <p>💡</p>
      <p class="flex-1">
        Please open this page in at least two tabs.<br>
        Close and open tabs or change pages in them to see that only one tab will be the leader.
      </p>
    </div>
    <button :disabled="isLoggedIn" @click="login">
      Login
    </button>
    <button :disabled="!isLoggedIn" @click="logout">
      Logout
    </button>
    <span class="ml-2">
      {{ message }}
    </span>
  </div>
  <div v-else>
    Aww, snap! The Web Locks API is not supported in your browser.
  </div>
</template>
