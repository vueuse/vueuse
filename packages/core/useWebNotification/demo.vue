<script setup lang="ts">
import { useWebNotification } from '@vueuse/core'
import type { UseWebNotificationOptions } from '@vueuse/core'

const options: UseWebNotificationOptions = {
  title: 'Hello, VueUse world!',
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
      Supported:
      <b>{{ isSupported }}</b>
    </p>
  </div>

  <div v-if="isSupported">
    <button @click="show">
      show notification
    </button>
  </div>
  <div v-else>
    The Notification Web API is not supported in your browser.
  </div>
</template>
