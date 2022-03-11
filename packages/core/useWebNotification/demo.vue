<script setup lang="ts">
import { useWebNotification } from '@vueuse/core'
import type { UseWebNotificationOptions } from '@vueuse/core'

const options: UseWebNotificationOptions = {
  title: 'Hello, world from VueUse!',
  dir: 'auto',
  lang: 'en',
  renotify: true,
  tag: 'test',
}

const {
  isSupported,
  show,
} = useWebNotification(options)
</script>

<template>
  <div>
    <p>
      Supported: <BooleanDisplay :value="isSupported" />
    </p>
  </div>

  <div v-if="isSupported">
    <button @click="show()">
      Show Notification
    </button>
  </div>
  <div v-else>
    The Notification Web API is not supported in your browser.
  </div>
</template>
