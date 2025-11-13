<script setup lang="ts">
import {
  isExpectedWebLockRejection,
  useWebLocks,
  useWebLocksAbortLockHeld,
  useWebLocksAbortLockStolen,
  useWebLocksAbortScopeDisposed,
} from '@vueuse/core'
import { promiseTimeout } from '@vueuse/shared'
import { ref, watch } from 'vue'

const { isSupported, request } = useWebLocks<{ 'vue-use-demo-lock': string }>()
const mode = ref<LockMode>('exclusive')
const ifAvailable = ref(false)
const steal = ref(false)
const timeout = ref(false)
const message = ref('')
const workingOrWaiting = ref(false)

function log(msg: string): void {
  console.log(`[${(new Date()).toLocaleTimeString()}] ${msg}`)
}

async function getLock() {
  workingOrWaiting.value = true
  message.value = `Waiting for lock (mode: ${mode.value}${ifAvailable.value ? ', ifAvailable: true' : ''}${steal.value ? ', steal: true' : ''})…`
  try {
    const abortController = new AbortController()
    setTimeout(() => {
      abortController.abort('Waited too long for the lock')
    }, 2000)
    message.value = await request('vue-use-demo-lock', {
      mode: mode.value,
      ifAvailable: ifAvailable.value,
      steal: steal.value,
      signal: timeout.value ? abortController.signal : undefined,
    }, async (signal) => {
      message.value = 'I have the lock and I am holding it for 10 seconds'
      await promiseTimeout(1000)
      for (let i = 9; i > 0; i--) {
        signal.throwIfAborted()
        message.value = `I have the lock and I am holding it for ${i} more second${i > 1 ? 's' : ''}`
        await promiseTimeout(1000)
      }
      return 'I have released the lock'
    })
  }
  catch (error) {
    // probably invalid lock request options…
    if (!isExpectedWebLockRejection(error)) {
      message.value = String(error)
    }
    else if (error === useWebLocksAbortLockStolen) {
      message.value = 'The lock got stolen'
    }
    else if (error === useWebLocksAbortLockHeld) {
      message.value = 'I could not acquire the lock immediately'
    }
    else if (error === useWebLocksAbortScopeDisposed) {
      log('The scope got disposed') // only log to console - our UI is gone anyway
    }
  }
  finally {
    workingOrWaiting.value = false
  }
}
watch(message, log)
</script>

<template>
  <div>
    <p>
      isSupported: <BooleanDisplay :value="isSupported" class="font-bold" />
    </p>
  </div>

  <div v-if="isSupported">
    <form class="border-main border-solid border rounded-md px-3 flex flex-col gap-2" @submit.prevent>
      <p class="font-bold">
        Request lock with options:
      </p>
      <fieldset class="flex gap-2 border-none">
        <legend class="float-left w-24">
          mode:
        </legend>
        <input id="mode-exclusive" v-model="mode" type="radio" value="exclusive">
        <label for="mode-exclusive">exclusive</label>
        <input id="mode-shared" v-model="mode" type="radio" value="shared">
        <label for="mode-shared">shared</label>
      </fieldset>
      <fieldset class="flex gap-2 border-none">
        <legend class="float-left w-24">
          ifAvailable:
        </legend>
        <input id="ifAvailable" v-model="ifAvailable" type="checkbox">
        <label for="ifAvailable">ifAvailable</label>
      </fieldset>
      <fieldset class="flex gap-2 border-none">
        <legend class="float-left w-24">
          steal:
        </legend>
        <input id="steal" v-model="steal" type="checkbox">
        <label for="steal">steal</label>
      </fieldset>
      <fieldset class="flex gap-2 border-none">
        <legend class="float-left w-24">
          signal:
        </legend>
        <input id="timeout" v-model="timeout" type="checkbox">
        <label for="timeout">2 seconds timeout</label>
      </fieldset>
      <div class="flex gap-2 items-start">
        <button class="flex-shrink-0" :disabled="workingOrWaiting" type="button" @click="getLock">
          Request Lock
        </button>
        <p>
          {{ message }}
        </p>
      </div>
    </form>
    <p>💡 <small>Open this page in at least two tabs. Open browser console to see message history.</small></p>
  </div>
  <div v-else>
    Aww, snap! The Web Locks API is not supported in your browser.
  </div>
</template>
